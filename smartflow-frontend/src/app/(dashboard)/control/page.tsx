'use client';

import { useState } from 'react';
import DensitySlider from '@/components/DensitySlider';
import SignalIndicator from '@/components/SignalIndicator';
import { DEFAULT_ROADS, buildSignalResults, getActiveRoad, CYCLE_TIME, type RoadData } from '@/utils/trafficLogic';

export default function ControlPage() {
  const [roads, setRoads] = useState<RoadData[]>(DEFAULT_ROADS);
  const [optimized, setOptimized] = useState(false);
  const [signals, setSignals] = useState(buildSignalResults(DEFAULT_ROADS));
  const [activeRoad, setActiveRoad] = useState(getActiveRoad(DEFAULT_ROADS));
  const [lastRun, setLastRun] = useState<string | null>(null);

  const updateDensity = (id: string, value: number) => {
    setRoads((prev) =>
      prev.map((r) => (r.id === id ? { ...r, density: value } : r))
    );
    setOptimized(false);
  };

  const runOptimization = () => {
    const results = buildSignalResults(roads);
    const active = getActiveRoad(roads);
    setSignals(results);
    setActiveRoad(active);
    setOptimized(true);
    setLastRun(new Date().toLocaleTimeString());
  };

  const total = roads.reduce((s, r) => s + r.density, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Traffic Control</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manually set road densities and run AI optimization</p>
        </div>
        {lastRun && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 text-sm">Last run: {lastRun}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
            Set Traffic Density
          </h2>

          <div className="space-y-4 mb-6">
            {roads.map((road) => (
              <DensitySlider
                key={road.id}
                roadName={road.name}
                value={road.density}
                onChange={(val) => updateDensity(road.id, val)}
              />
            ))}
          </div>

          {/* Total Traffic */}
          <div className="bg-slate-800/50 rounded-xl p-3 mb-4 flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total Traffic Load</span>
            <span className="text-white font-bold text-lg">{total} <span className="text-slate-500 text-xs font-normal">/ 400</span></span>
          </div>

          {/* Run Button */}
          <button
            id="run-ai-optimization"
            onClick={runOptimization}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm tracking-wide hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>🤖</span> Run AI Optimization
          </button>
        </div>

        {/* Results */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600" />
            Signal Optimization Results
            {optimized && <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Updated</span>}
          </h2>

          {!optimized ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">🎛️</div>
              <p className="text-slate-400 text-sm">Adjust sliders and click</p>
              <p className="text-cyan-400 font-medium text-sm">Run AI Optimization</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signals.map((sig) => (
                <SignalIndicator
                  key={sig.roadId}
                  roadName={`Road ${sig.roadId}`}
                  greenTime={sig.greenTime}
                  isGreen={sig.isGreen}
                />
              ))}

              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl text-xs text-slate-500">
                <p>Active Green: <span className="text-emerald-400 font-semibold">Road {activeRoad}</span></p>
                <p className="mt-1">Formula: (Road Density / {total}) × {CYCLE_TIME}s</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
