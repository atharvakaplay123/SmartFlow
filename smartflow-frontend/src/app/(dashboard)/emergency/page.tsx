'use client';

import { useState } from 'react';
import SignalIndicator from '@/components/SignalIndicator';
import { DEFAULT_ROADS, calculateGreenTimes, type RoadData } from '@/utils/trafficLogic';

type EmergencyRoad = RoadData['id'] | null;

export default function EmergencyPage() {
  const [active, setActive] = useState(false);
  const [forcedRoad, setForcedRoad] = useState<EmergencyRoad>(null);
  const [log, setLog] = useState<{ time: string; msg: string }[]>([]);

  const roads = DEFAULT_ROADS;
  const greenTimes = calculateGreenTimes(roads);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog(prev => [{ time, msg }, ...prev].slice(0, 6));
  };

  const handleActivate = (road: RoadData['id']) => {
    setActive(true);
    setForcedRoad(road);
    addLog(`Emergency override activated → Road ${road} set to GREEN`);
  };

  const handleDeactivate = () => {
    addLog(`Emergency override deactivated → Returning to AI control`);
    setActive(false);
    setForcedRoad(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🚨</span>
            <h1 className="text-2xl font-bold text-white">Emergency Override</h1>
          </div>
          <p className="text-slate-400 text-sm">Force priority GREEN on any road for emergency vehicles</p>
        </div>
        {active && (
          <div className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-widest animate-pulse">
            Emergency Active
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Road Selection */}
        <div className="bg-[#0d1326]/80 border border-[#1e2d4d] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Select Emergency Road</h2>
          <div className="grid grid-cols-2 gap-3">
            {roads.map(road => (
              <button
                key={road.id}
                onClick={() => handleActivate(road.id)}
                disabled={active && forcedRoad === road.id}
                className={`py-5 rounded-xl font-bold transition-all border text-sm ${
                  forcedRoad === road.id && active
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/10 cursor-default'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-500 active:scale-95'
                }`}
              >
                🚨 {road.name}
              </button>
            ))}
          </div>

          {active && (
            <button
              onClick={handleDeactivate}
              className="w-full mt-2 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all text-sm active:scale-95"
            >
              ✕ Deactivate Override
            </button>
          )}
        </div>

        {/* Signal Status */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Current Signal State</h2>
          {roads.map(road => (
            <SignalIndicator
              key={road.id}
              roadName={road.name}
              greenTime={greenTimes[road.id]}
              isGreen={active ? road.id === forcedRoad : false}
            />
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-[#0d1326]/80 border border-[#1e2d4d] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🕒 Activity Log</h2>
        {log.length === 0 ? (
          <p className="text-slate-600 text-sm italic">No emergency events recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {log.map((entry, i) => (
              <div key={i} className="flex gap-4 border-l-2 border-rose-500/30 pl-4">
                <span className="text-slate-500 text-xs shrink-0 pt-0.5">{entry.time}</span>
                <span className="text-slate-300 text-sm">{entry.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
