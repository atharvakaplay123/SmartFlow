"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Activity, Cpu, Timer, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Car, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

function TrafficLight({ roadId, activeRoad, className, arrowDir }: { roadId: string, activeRoad: string, className?: string, arrowDir?: 'up' | 'down' | 'left' | 'right' }) {
   const isActive = roadId === activeRoad;

   return (
      <div className={`absolute flex flex-col items-center gap-1.5 z-40 ${className}`}>
         {/* Up Arrow for Road B */}
         {arrowDir === 'up' && <div className={`-mt-2 ${isActive ? 'text-[#27AE60]' : 'text-[#2F80ED]'}`}><ArrowUp size={20} /></div>}
         
         <div className="relative">
            {/* Left Arrow for Road A */}
            {arrowDir === 'left' && <div className={`absolute top-1.5 -left-8 ${isActive ? 'text-[#27AE60]' : 'text-[#2F80ED]'}`}><ArrowLeft size={20} /></div>}
            {/* Right Arrow for Road C */}
            {arrowDir === 'right' && <div className={`absolute top-1.5 -right-8 ${isActive ? 'text-[#27AE60]' : 'text-[#2F80ED]'}`}><ArrowRight size={20} /></div>}
            
            {/* Vertical Traffic Light Body */}
            <div className="bg-white p-2 rounded-xl flex flex-col gap-2 border border-slate-200 shadow-sm">
                {/* Red Light */}
                <div className={`w-5 h-5 rounded-full border-2 ${!isActive ? 'bg-[#EB5757] border-[#EB5757]' : 'bg-slate-100 border-slate-200'} transition-all duration-300`} />
                {/* Green Light */}
                <div className={`w-5 h-5 rounded-full border-2 ${isActive ? 'bg-[#27AE60] border-[#27AE60]' : 'bg-slate-100 border-slate-200'} transition-all duration-300`} />
            </div>
         </div>

         {/* Status Label */}
         <div className="flex items-center justify-center">
           {!isActive ? (
              <span className="text-[10px] font-black text-[#EB5757] tracking-wider bg-red-50 px-1.5 py-0.5 rounded border border-red-200 transition-opacity">WAIT</span>
           ) : (
              <span className="text-[10px] font-black text-[#27AE60] tracking-wider bg-green-50 px-1.5 py-0.5 rounded border border-green-200 transition-opacity">GO</span>
           )}
         </div>

         {/* Down Arrow for Road D */}
         {arrowDir === 'down' && <div className={`-mb-2 ${isActive ? 'text-[#27AE60]' : 'text-[#2F80ED]'}`}><ArrowDown size={20} /></div>}
      </div>
   )
}

function DensitySlider({ road, value, onChange, isActive, disabled }: { road: string, value: number, onChange: (val: number) => void, isActive: boolean, disabled?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300 ${isActive ? 'border-[#2F80ED] bg-blue-50/30 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300'} ${disabled ? 'opacity-70' : ''}`}>
       <div className="flex justify-between items-center text-sm">
           <span className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <Car className={`w-4 h-4 ${isActive ? 'text-[#2F80ED]' : 'text-slate-400'}`} /> Road {road}
           </span>
           <span className={`font-mono px-2 py-0.5 rounded-md text-xs font-black border ${isActive ? 'bg-[#2F80ED]/10 text-[#2F80ED] border-[#2F80ED]/20' : 'bg-white text-slate-600 border-slate-200'}`}>
              {value} veh
           </span>
       </div>
       <input 
         title={`Road ${road} Density`}
         type="range" 
         min="0" max="100" 
         value={value}
         onChange={(e) => onChange(parseInt(e.target.value))}
         disabled={disabled}
         className={`w-full h-2 bg-slate-200 rounded-lg appearance-none accent-[#2F80ED] ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
       />
    </div>
  )
}

export default function TrafficSimulation() {
  const [sliderValues, setSliderValues] = useState({ A: 20, B: 60, C: 40, D: 30 });
  const [densities, setDensities] = useState({ A: 20, B: 60, C: 40, D: 30 });
  const [cycleIndex, setCycleIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  // Constants
  const GREEN_TIME = 10; // Every signal gets exactly 10 seconds
  const CYCLE_TIME = GREEN_TIME * 4; // 40s total per cycle

  // Which full cycle are we in? (0 = first, 1 = second, ...)
  const cycleNumber = Math.floor(cycleIndex / 4);
  const positionInCycle = cycleIndex % 4; // 0=1st, 1=2nd, 2=3rd, 3=4th

  // Determine signal order — no useMemo to avoid stale cache during first cycle
  let orderedRoads: string[];
  if (cycleNumber === 0) {
    // First cycle: ALWAYS fixed A → B → C → D
    orderedRoads = ['A', 'B', 'C', 'D'];
  } else {
    // Subsequent cycles: sort A, B, C by vehicle density (highest first), D always last
    const abc: [string, number][] = [
      ['A', densities.A],
      ['B', densities.B],
      ['C', densities.C],
    ];
    abc.sort((a, b) => b[1] - a[1]);
    orderedRoads = [...abc.map(x => x[0]), 'D'];
  }

  // Active road based on position in the ordered sequence
  const activeRoad = orderedRoads[positionInCycle];

  // Set timer when a new signal phase begins
  useEffect(() => {
    if (timeLeft === -1 && isRunning) {
      setTimeLeft(GREEN_TIME);
    }
  }, [timeLeft, isRunning]);

  // API trigger — fires exactly once when timer reaches 10s remaining
  const apiTriggeredRef = React.useRef(-1);

  useEffect(() => {
    if (!isRunning || timeLeft !== GREEN_TIME) return;
    if (apiTriggeredRef.current === cycleIndex) return;
    apiTriggeredRef.current = cycleIndex;

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, '');

    // Position 3 (4th signal = always D) → send A, B, C vehicle counts
    if (positionInCycle === 3) {
      console.log(`[Cycle ${cycleNumber}] 4th signal (${activeRoad}) started — calling /api/traffic/abc`);
      fetch(`${baseUrl}/api/greentime/ABC`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ A: densities.A, B: densities.B, C: densities.C })
      }).then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
        return JSON.parse(text);
      }).then(data => {
        console.log('[API ABC Response]', data);

      }).catch(err => console.error('[API ABC Error]', err));
    }

    // Position 2 (3rd signal in priority order) → send D vehicle count
    if (positionInCycle === 2) {
      console.log(`[Cycle ${cycleNumber}] 3rd signal (${activeRoad}) started — calling /api/traffic/d`);
      fetch(`${baseUrl}/api/greentime/D`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ D: densities.D })
      }).then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
        return JSON.parse(text);
      }).then(data => {
        console.log('[API D Response]', data);
        
      }).catch(err => console.error('[API D Error]', err));
    }
  }, [isRunning, timeLeft, cycleIndex, positionInCycle, cycleNumber, activeRoad, densities]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCycleIndex(c => c + 1);
          return -1;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const totalDensity = densities.A + densities.B + densities.C + densities.D;
  const currentGreenTimes = { A: GREEN_TIME, B: GREEN_TIME, C: GREEN_TIME, D: GREEN_TIME };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#0B2A4A] p-6 flex flex-col font-sans selection:bg-[#2F80ED]/20">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
             <Activity className="text-[#2F80ED] h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0B2A4A] tracking-tight">
            SmartFlow Traffic Simulation
          </h1>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F80ED] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2F80ED]"></span>
            </span>
            <span className="text-sm font-bold text-[#0B2A4A]">AI Mode Active</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
            <Timer className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-600">Cycle Time: {CYCLE_TIME}s</span>
          </div>
        </div>
      </header>
    
      <div className="flex-1 flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
        
        {/* Intersection Live Map Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
           <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-30">
              <h2 className="text-lg font-bold text-[#0B2A4A] flex items-center gap-2">
                 <Camera className="h-5 w-5 text-[#2F80ED]" /> Intersection Map
              </h2>
              <div className="flex items-center gap-3 bg-[#F5F8FC] px-5 py-2 rounded-xl border border-slate-200">
                 <Timer className="h-4 w-4 text-[#2F80ED]" />
                 <span className="text-slate-600 font-mono text-sm font-bold">
                    NEXT SIGNAL IN: <span className="text-lg font-black text-[#2F80ED] ml-1">{timeLeft === -1 ? '...' : timeLeft}s</span>
                 </span>
              </div>
           </div>
           
           <div className="flex-1 relative min-h-[600px] flex items-center justify-center p-8 bg-slate-50 z-10 overflow-hidden">
             
             {/* Simulation Canvas */}
             <div className="relative w-[500px] h-[500px] shrink-0">
                {/* Vertical Road (A & C) */}
                <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[120px] bg-[#1E3A5F] rounded-3xl z-0 flex justify-center shadow-md">
                  <div className="w-0.5 h-full border-l-4 border-dashed border-white/20" />
                </div>
                
                {/* Horizontal Road (D & B) */}
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[120px] bg-[#1E3A5F] rounded-3xl z-0 flex items-center shadow-md">
                  <div className="w-full h-0.5 border-t-4 border-dashed border-white/20" />
                </div>
                
                {/* Center Intersection Block */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#1E3A5F] z-10" />
 
                {/* Road Labels */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center font-bold text-white tracking-widest text-xs bg-[#1E3A5F] px-3 py-1.5 rounded-md z-20 shadow-sm border border-transparent">ROAD A</div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-bold text-white tracking-widest text-xs bg-[#1E3A5F] px-3 py-1.5 rounded-md z-20 shadow-sm border border-transparent">ROAD C</div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-white tracking-widest text-xs bg-[#1E3A5F] px-3 py-1.5 rounded-md -rotate-90 z-20 shadow-sm origin-center border border-transparent">ROAD D</div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-white tracking-widest text-xs bg-[#1E3A5F] px-3 py-1.5 rounded-md rotate-90 z-20 shadow-sm origin-center border border-transparent">ROAD B</div>
 
                {/* Center AI Camera panel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[64px] h-[64px] bg-white rounded-2xl border-2 border-[#2F80ED] flex flex-col items-center justify-center z-30 shadow-md">
                   <Camera className="h-6 w-6 text-[#2F80ED] mb-0.5" />
                   <span className="text-[8px] font-black text-[#0B2A4A] tracking-widest text-center leading-tight">AI CAM</span>
                </div>

                {/* Traffic Signals */}
                <TrafficLight roadId="B" activeRoad={activeRoad} className="left-[calc(50%+85px)] bottom-[calc(50%+100px)]" arrowDir="left" />
                <TrafficLight roadId="C" activeRoad={activeRoad} className="left-[calc(50%+100px)] top-[calc(50%+85px)]" arrowDir="up" />
                <TrafficLight roadId="D" activeRoad={activeRoad} className="right-[calc(50%+85px)] top-[calc(50%+100px)]" arrowDir="right" />
                <TrafficLight roadId="A" activeRoad={activeRoad} className="right-[calc(50%+100px)] bottom-[calc(50%+85px)]" arrowDir="down" />
             </div>
           </div>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Traffic Density Controls */}
           <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col">
               <h3 className="text-sm font-black text-[#0B2A4A] uppercase tracking-wider mb-6 flex items-center gap-2">
                 <Cpu className="h-5 w-5 text-[#2F80ED]" /> Density Controls
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <DensitySlider road="A" value={sliderValues.A} onChange={(val) => setSliderValues(d => ({ ...d, A: val }))} isActive={activeRoad === 'A'} disabled={isRunning} />
                  <DensitySlider road="B" value={sliderValues.B} onChange={(val) => setSliderValues(d => ({ ...d, B: val }))} isActive={activeRoad === 'B'} disabled={isRunning} />
                  <DensitySlider road="C" value={sliderValues.C} onChange={(val) => setSliderValues(d => ({ ...d, C: val }))} isActive={activeRoad === 'C'} disabled={isRunning} />
                  <DensitySlider road="D" value={sliderValues.D} onChange={(val) => setSliderValues(d => ({ ...d, D: val }))} isActive={activeRoad === 'D'} disabled={isRunning} />
               </div>

               <button 
                  onClick={() => {
                     if (isRunning) {
                         setIsRunning(false);
                         setCycleIndex(0);
                         setTimeLeft(-1);
                     } else {
                         setDensities(sliderValues);
                         setIsRunning(true);
                     }
                  }}
                  className={`w-full ${isRunning ? 'bg-[#EB5757] hover:bg-[#C93030]' : 'bg-[#2F80ED] hover:bg-[#1C6DD0]'} text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-md transition-all active:scale-[0.98]`}
               >
                  {isRunning ? 'Stop Simulation' : 'Start Simulation'}
               </button>
            </div>

           {/* AI Traffic Analytics replacing line graph with Signal Allocations */}
           <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col">
               <h3 className="text-sm font-black text-[#0B2A4A] uppercase tracking-wider mb-6 flex items-center gap-2">
                 <BarChart3 className="h-5 w-5 text-[#2F80ED]" /> AI Traffic Analytics
               </h3>
               
               <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
                     <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Total Vehicles</span>
                     <span className="text-2xl font-black text-[#0B2A4A]">{totalDensity.toLocaleString()}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
                     <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Congestion Indicator</span>
                     <div className="flex items-center gap-2 mt-1 py-1 px-3 rounded-full bg-white border border-slate-200 w-max">
                        <div className={`w-2 h-2 rounded-full ${totalDensity > 250 ? 'bg-[#EB5757]' : totalDensity > 150 ? 'bg-amber-400' : 'bg-[#27AE60]'}`} />
                        <span className="text-xs font-bold text-[#0B2A4A]">
                           {totalDensity > 250 ? 'Severe' : totalDensity > 150 ? 'Moderate' : 'Smooth Flow'}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Green Time Allocation List */}
               <div className="flex flex-col gap-3 flex-1 mt-2">
                  <span className="text-slate-500 text-xs font-bold uppercase flex items-center gap-1 mb-1">
                     <Timer className="w-3 h-3 text-[#2F80ED]" /> Allocated Green Time
                  </span>
                  <div className="space-y-2.5">
                     {orderedRoads.map((road) => {
                        const isCurrent = road === activeRoad;
                        const allocatedTime = currentGreenTimes[road as keyof typeof currentGreenTimes];
                        return (
                           <div key={road} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${isCurrent ? 'bg-blue-50/50 border-[#2F80ED]' : 'bg-slate-50 border-slate-100'}`}>
                              <span className={`font-bold text-sm ${isCurrent ? 'text-[#2F80ED]' : 'text-slate-600'}`}>
                                 Road {road}
                              </span>
                              <div className="flex items-center gap-3">
                                 {/* Optional small progress bar representation */}
                                 <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                                    <div 
                                      className="h-full bg-[#2F80ED] rounded-full transition-all" 
                                      style={{ width: `${(allocatedTime / CYCLE_TIME) * 100}%` }} 
                                    />
                                 </div>
                                 <span className={`font-mono text-sm w-8 text-right ${isCurrent ? 'text-[#2F80ED] font-black' : 'text-slate-500 font-bold'}`}>
                                    {allocatedTime}s
                                 </span>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}
