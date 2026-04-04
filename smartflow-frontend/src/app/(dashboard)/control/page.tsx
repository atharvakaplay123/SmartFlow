'use client';

import { useState } from 'react';
import DensitySlider from '@/components/DensitySlider';
import SignalIndicator from '@/components/SignalIndicator';
import {
  DEFAULT_ROADS,
  buildSignalResults,
  calculateGreenTimes,
  type RoadData,
} from '@/utils/trafficLogic';

export default function ControlPage() {
  const [roads, setRoads] = useState<RoadData[]>(DEFAULT_ROADS);
  const [manualOverride, setManualOverride] = useState<string | null>(null);

  const signals = manualOverride
    ? roads.map(r => ({
        roadId: r.id,
        greenTime: calculateGreenTimes(roads)[r.id],
        isGreen: r.id === manualOverride,
      }))
    : buildSignalResults(roads);

  const handleDensityChange = (id: RoadData['id'], value: number) => {
    setRoads(prev => prev.map(r => r.id === id ? { ...r, density: value } : r));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Signal Control</h1>
          <p className="text-slate-400 text-sm mt-1">Adjust traffic density and manage signal priorities</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${manualOverride ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
          {manualOverride ? `Manual: Road ${manualOverride}` : 'AI Controlled'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Density Control */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Traffic Density</h2>
          {roads.map(road => (
            <DensitySlider
              key={road.id}
              roadName={road.name}
              value={road.density}
              onChange={(val) => handleDensityChange(road.id, val)}
            />
          ))}
        </div>

        {/* Signal Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Signal Status</h2>
            {manualOverride && (
              <button
                onClick={() => setManualOverride(null)}
                className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 px-3 py-1 rounded-lg transition-colors"
              >
                Return to AI
              </button>
            )}
          </div>
          {signals.map((sig, i) => (
            <div
              key={sig.roadId}
              onClick={() => setManualOverride(prev => prev === sig.roadId ? null : sig.roadId)}
              className="cursor-pointer"
            >
              <SignalIndicator
                roadName={roads[i].name}
                greenTime={sig.greenTime}
                isGreen={sig.isGreen}
              />
            </div>
          ))}
          <p className="text-slate-600 text-xs pt-2">Click a signal to force manual override.</p>
        </div>
      </div>
    </div>
  );
}
