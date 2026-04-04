'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmergencyPage() {
  const router = useRouter();
  
  // Navigation
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "🧠" },
    { name: "Control", href: "/admin", icon: "⚙️" },
    { name: "Analytics", href: "/admin", icon: "📈" },
    { name: "Emergency Override", href: "/emergency", icon: "🚨" },
    { name: "Alerts", href: "/alerts", icon: "🔔" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  type EmergencyStatus = 'DETECTED' | 'IN PROGRESS' | 'PRIORITY GIVEN' | 'COMPLETED' | 'CANCELLED';

  interface EventLogEntry {
    time: string;
    message: string;
  }

  interface TrackerNode {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending';
  }

  interface Emergency {
    id: string;
    type: 'Ambulance' | 'Fire Truck' | 'Police';
    icon: string;
    currentLocation: string;
    destination: string;
    detectedTimeStr: string;
    detectedAt: number; // For simulation timing
    status: EmergencyStatus;
    logs: EventLogEntry[];
    tracker: TrackerNode[];
    speed: number;
    distance: number;
    eta: string;
  }

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Pre-populate 2 active emergencies on mount
  useEffect(() => {
    const now = Date.now();
    
    const emg1: Emergency = {
      id: 'EMG-392',
      type: 'Ambulance',
      icon: '🚑',
      currentLocation: 'Palasia',
      destination: 'City Hospital',
      detectedAt: now - 6000, 
      detectedTimeStr: new Date(now - 6000).toLocaleTimeString('en-US', { hour12: false }),
      status: 'PRIORITY GIVEN',
      logs: [
        { time: new Date(now - 6000).toLocaleTimeString('en-US', { hour12: false }), message: 'Emergency Ambulance detected at Palasia' },
        { time: new Date(now - 3000).toLocaleTimeString('en-US', { hour12: false }), message: 'Status updated to IN PROGRESS' },
        { time: new Date(now - 1000).toLocaleTimeString('en-US', { hour12: false }), message: 'Status updated to PRIORITY GIVEN' }
      ],
      tracker: [
         { id: '1', label: 'Palasia', status: 'completed' },
         { id: '2', label: 'Main Junction', status: 'completed' },
         { id: '3', label: 'Sector 4', status: 'current' },
         { id: '4', label: 'City Hospital', status: 'pending' }
      ],
      speed: 74,
      distance: 8,
      eta: '2m 10s'
    };

    const emg2: Emergency = {
      id: 'EMG-815',
      type: 'Fire Truck',
      icon: '🚒',
      currentLocation: 'Regal Square',
      destination: 'Downtown',
      detectedAt: now - 3000,
      detectedTimeStr: new Date(now - 3000).toLocaleTimeString('en-US', { hour12: false }),
      status: 'IN PROGRESS',
      logs: [
        { time: new Date(now - 3000).toLocaleTimeString('en-US', { hour12: false }), message: 'Emergency Fire Truck detected at Regal Square' },
        { time: new Date(now - 1000).toLocaleTimeString('en-US', { hour12: false }), message: 'Status updated to IN PROGRESS' }
      ],
      tracker: [
         { id: '1', label: 'Regal Square', status: 'completed' },
         { id: '2', label: 'Main Junction', status: 'current' },
         { id: '3', label: 'Sector 4', status: 'pending' },
         { id: '4', label: 'Downtown', status: 'pending' }
      ],
      speed: 62,
      distance: 14,
      eta: '4m 45s'
    };

    setEmergencies([emg1, emg2]);
  }, []);

  // Auto progression effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setEmergencies(prev => {
        let changed = false;
        const updated = prev.map(emg => {
          if (emg.status === 'COMPLETED' || emg.status === 'CANCELLED') return emg;
          
          const elapsedSecs = (now - emg.detectedAt) / 1000;
          let newStatus: EmergencyStatus = emg.status;
          
          if (elapsedSecs >= 9) newStatus = 'COMPLETED';
          else if (elapsedSecs >= 5 && elapsedSecs < 9 && emg.status !== 'PRIORITY GIVEN') newStatus = 'PRIORITY GIVEN';
          else if (elapsedSecs >= 2 && elapsedSecs < 5 && emg.status !== 'IN PROGRESS') newStatus = 'IN PROGRESS';

          if (newStatus !== emg.status) {
            changed = true;
            const newLog = {
              time: new Date().toLocaleTimeString('en-US', { hour12: false }),
              message: `Status updated to ${newStatus}`
            };
            
            // Advance tracker nodes logic for cool UI
            const newTracker = emg.tracker.map((node, i) => {
              if (newStatus === 'COMPLETED') return { ...node, status: 'completed' as const };
              if (newStatus === 'PRIORITY GIVEN' && i < 2) return { ...node, status: 'completed' as const };
              if (newStatus === 'PRIORITY GIVEN' && i === 2) return { ...node, status: 'current' as const };
              if (newStatus === 'IN PROGRESS' && i < 1) return { ...node, status: 'completed' as const };
              if (newStatus === 'IN PROGRESS' && i === 1) return { ...node, status: 'current' as const };
              return { ...node, status: 'pending' as const };
            });

            return { ...emg, status: newStatus, logs: [...emg.logs, newLog], tracker: newTracker };
          }
          return emg;
        });

        // Also update selected emergency if it's open
        if (changed) {
          setSelectedEmergency(currentSelected => {
            if (!currentSelected) return currentSelected;
            const liveMatch = updated.find(e => e.id === currentSelected.id);
            return liveMatch || currentSelected;
          });
        }
        
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const simulateEmergency = () => {
    const types = [
      { t: 'Ambulance', icon: '🚑' },
      { t: 'Fire Truck', icon: '🚒' },
      { t: 'Police', icon: '🚓' }
    ] as const;
    const locations = ['Vijay Nagar', 'Palasia', 'Bhanwar Kuan', 'Regal Square'];
    const destinations = ['City Hospital', 'Fire Station 1', 'Central Jail', 'Downtown'];
    
    const randType = types[Math.floor(Math.random() * types.length)];
    const randLoc = locations[Math.floor(Math.random() * locations.length)];
    const randDest = destinations[Math.floor(Math.random() * destinations.length)];
    
    const idNum = Math.floor(100 + Math.random() * 900);
    
    const now = Date.now();
    
    const newEmg: Emergency = {
      id: `EMG-${idNum}`,
      type: randType.t as any,
      icon: randType.icon,
      currentLocation: randLoc,
      destination: randDest,
      detectedAt: now,
      detectedTimeStr: new Date(now).toLocaleTimeString('en-US', { hour12: false }),
      status: 'DETECTED',
      logs: [
        { time: new Date(now).toLocaleTimeString('en-US', { hour12: false }), message: `Emergency ${randType.t} detected at ${randLoc}` }
      ],
      tracker: [
         { id: '1', label: randLoc, status: 'current' },
         { id: '2', label: 'Main Junction', status: 'pending' },
         { id: '3', label: 'Sector 4', status: 'pending' },
         { id: '4', label: randDest, status: 'pending' }
      ],
      speed: Math.floor(60 + Math.random() * 40),
      distance: 12 + Math.floor(Math.random() * 8),
      eta: '4m 30s'
    };

    setEmergencies(prev => [newEmg, ...prev]);
  };

  const handleCardClick = (emg: Emergency) => {
    setSelectedEmergency(emg);
    setPanelOpen(true);
  };

  const activeCount = emergencies.filter(e => e.status !== 'COMPLETED' && e.status !== 'CANCELLED').length;

  const getStatusColor = (status: EmergencyStatus) => {
    switch (status) {
      case 'DETECTED': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'IN PROGRESS': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'PRIORITY GIVEN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCardStyle = (status: EmergencyStatus) => {
    if (status === 'COMPLETED') return 'bg-emerald-50 border-emerald-200';
    if (status === 'IN PROGRESS') return 'bg-rose-50 border-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
    if (status === 'PRIORITY GIVEN') return 'bg-blue-50 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
    if (status === 'DETECTED') return 'bg-orange-50 border-orange-200';
    return 'bg-white border-slate-200';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#0A192F] flex flex-col shadow-xl z-20 flex-shrink-0 h-screen relative">
        <div className="flex-1 flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
              <svg className="w-5 h-5 text-[#0A192F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wide uppercase text-white">SmartFlow AI</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.name === "Emergency Override";
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl opacity-80">{item.icon}</span>
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-300 transform">
        
        {/* Header Route Info */}
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-8 sm:px-12 flex-shrink-0 sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div>
             <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 mb-1">PRIORITY ROUTING</div>
             <h1 className="text-2xl font-bold text-[#0A192F] tracking-tight">Emergency Override</h1>
          </div>
        </header>

        <div className="p-8 sm:p-12 flex-1 max-w-7xl w-full mx-auto flex flex-col overflow-y-auto w-full">
           
           {/* Top Bar */}
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
             <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800 tracking-wide">EMERGENCIES</h2>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCount > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                  Active Emergencies: {activeCount}
                </div>
             </div>
             
             <button 
               onClick={simulateEmergency}
               className="bg-[#0A192F] hover:bg-[#11294F] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
             >
               <span className="text-base">+</span> Simulate Emergency
             </button>
           </div>

           {/* Emergency Cards Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
             {emergencies.length === 0 && (
               <div className="col-span-1 lg:col-span-2 py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                 <span className="text-4xl mb-4 block">🚔</span>
                 <h3 className="text-lg font-bold text-slate-400 mb-2">No Active Emergencies</h3>
                 <p className="text-slate-400 text-sm">Everything is running smoothly. Click simulate to trigger an event.</p>
               </div>
             )}

             {emergencies.map(emg => (
               <div 
                 key={emg.id} 
                 onClick={() => handleCardClick(emg)}
                 className={`border rounded-2xl p-6 cursor-pointer transform hover:scale-[1.02] transition-all hover:shadow-lg ${getCardStyle(emg.status)} flex justify-between`}
               >
                 {/* Left Side */}
                 <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-slate-100">
                       {emg.icon}
                     </div>
                     <div>
                       <div className="font-bold text-[#0A192F] text-base">{emg.id}</div>
                       <div className="text-xs font-semibold text-slate-500 uppercase">{emg.type}</div>
                     </div>
                   </div>
                   
                   <div className="flex flex-col gap-2 mt-2">
                     <div className="flex items-center gap-2 text-sm text-slate-600 font-medium font-sans">
                       <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">📍</span>
                       <span className="w-24 text-slate-400 text-xs font-bold uppercase tracking-wide">Location</span>
                       <span className="truncate">{emg.currentLocation}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-600 font-medium font-sans">
                       <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">🏁</span>
                       <span className="w-24 text-slate-400 text-xs font-bold uppercase tracking-wide">Destination</span>
                       <span className="truncate">{emg.destination}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-600 font-medium font-sans">
                       <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">⏱️</span>
                       <span className="w-24 text-slate-400 text-xs font-bold uppercase tracking-wide">Detected</span>
                       <span className="truncate">{emg.detectedTimeStr}</span>
                     </div>
                   </div>
                 </div>

                 {/* Right Side */}
                 <div className="flex flex-col items-end">
                   <div className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase border border-opacity-50 shadow-sm ${getStatusColor(emg.status)}`}>
                     {emg.status}
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </main>

      {/* ── SIDE PANEL ── */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-in-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedEmergency && (
          <div className="h-full flex flex-col font-sans">
             
             {/* Panel Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-3">
                 <div className="text-2xl">{selectedEmergency.icon}</div>
                 <div>
                   <h2 className="font-bold text-lg text-[#0A192F]">{selectedEmergency.id}</h2>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{selectedEmergency.type} Override</p>
                 </div>
               </div>
               <button 
                 onClick={() => setPanelOpen(false)}
                 className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
               >
                 ✖
               </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* 1. Status Info */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                   <div className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-3">Live Status</div>
                   <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold shadow-sm ${getStatusColor(selectedEmergency.status)}`}>
                     {selectedEmergency.status === 'DETECTED' && '⏳ Waiting for AI Response'}
                     {selectedEmergency.status === 'IN PROGRESS' && '🚨 Live System Priority'}
                     {selectedEmergency.status === 'PRIORITY GIVEN' && '🟢 Preempting Signals'}
                     {selectedEmergency.status === 'COMPLETED' && '✅ Incident Summary'}
                   </div>
                </div>

                {/* 2. Route Tracker */}
                <div>
                   <div className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-5 flex items-center gap-2">
                     📍 Live Route Tracker
                   </div>
                   <div className="relative pl-4 space-y-6">
                     {/* Line connecting nodes */}
                     <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-slate-200 -z-10"></div>
                     
                     {selectedEmergency.tracker.map((node, idx) => (
                       <div key={node.id} className="flex gap-4 items-start relative z-10">
                          <div className={`w-5 h-5 rounded-full border-2 bg-white flex-shrink-0 mt-0.5 shadow-sm transition-colors ${
                              node.status === 'completed' ? 'border-emerald-500 bg-emerald-100' :
                              node.status === 'current' ? 'border-blue-500 bg-blue-100 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                              'border-slate-300'
                          }`}></div>
                          
                          <div className={`flex flex-col ${
                             node.status === 'current' ? 'text-blue-700' :
                             node.status === 'completed' ? 'text-emerald-700' :
                             'text-slate-500'
                          }`}>
                            <span className="text-sm font-bold">{node.label}</span>
                            {node.status === 'current' && (
                              <span className="text-xs font-semibold mt-1 flex items-center gap-1 animate-pulse">
                                Vehicle reaching node {selectedEmergency.icon}
                              </span>
                            )}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* 3. Control Actions */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                   <div className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Active Control Rules</div>
                   <div className="space-y-3 font-sans">
                     <div className="flex justify-between items-center text-sm font-semibold">
                       <span className="text-slate-600">AI Network Optimization</span>
                       <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded">ACTIVE</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-semibold">
                       <span className="text-slate-600">Admin Control Node</span>
                       <span className="text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded">STANDBY</span>
                     </div>
                   </div>
                </div>

                {/* 4. Live Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Speed</span>
                    <span className="text-xl font-bold text-slate-800">{selectedEmergency.status === 'COMPLETED' ? '0' : selectedEmergency.speed} km/h</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Distance</span>
                    <span className="text-xl font-bold text-slate-800">{selectedEmergency.distance} km</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl col-span-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Arrival (ETA)</span>
                    <span className="text-lg font-bold text-emerald-600">{selectedEmergency.eta}</span>
                  </div>
                </div>

                {/* 5. Event Log */}
                <div>
                   <div className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-4 flex items-center gap-2">
                     📋 System Log
                   </div>
                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 font-mono text-xs max-h-48 overflow-y-auto">
                     {selectedEmergency.logs.map((log, idx) => (
                       <div key={idx} className="flex gap-3 text-slate-600">
                         <span className="text-indigo-400 font-bold shrink-0">[{log.time}]</span>
                         <span>{log.message}</span>
                       </div>
                     ))}
                   </div>
                </div>
             </div>

             {/* 6. Control Center */}
             <div className="p-6 border-t border-slate-200 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Admin Overrides</div>
                <div className="flex gap-3">
                  <button 
                    disabled={selectedEmergency.status === 'COMPLETED'}
                    className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
                  >
                    Force GREEN
                  </button>
                  <button 
                    disabled={selectedEmergency.status === 'COMPLETED'}
                    onClick={() => {
                       setEmergencies(prev => prev.map(e => e.id === selectedEmergency.id ? { ...e, status: 'CANCELLED' } : e));
                       setPanelOpen(false);
                    }}
                    className="flex-1 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
             </div>

          </div>
        )}
      </div>

      {/* Overlay when panel open */}
      <div 
        className={`fixed inset-0 bg-[#0A192F]/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setPanelOpen(false)}
      ></div>

    </div>
  );
}
