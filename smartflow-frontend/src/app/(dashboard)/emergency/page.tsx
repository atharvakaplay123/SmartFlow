'use client';

import { useState } from 'react';
import type { RoadId } from '@/utils/trafficLogic';

const ROADS: { id: RoadId; name: string; location: string }[] = [
  { id: 'A', name: 'Road A', location: 'North Corridor' },
  { id: 'B', name: 'Road B', location: 'East Highway' },
  { id: 'C', name: 'Road C', location: 'South Junction' },
  { id: 'D', name: 'Road D', location: 'West Boulevard' },
];

type EmergencyType = 'ambulance' | 'fire' | 'police' | 'vip';

const EMERGENCY_TYPES: { id: EmergencyType; label: string; icon: string; color: string }[] = [
  { id: 'ambulance', label: 'Ambulance', icon: '🚑', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  { id: 'fire', label: 'Fire Truck', icon: '🚒', color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
  { id: 'police', label: 'Police', icon: '🚔', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  { id: 'vip', label: 'VIP Convoy', icon: '🚗', color: 'text-violet-400 border-violet-500/40 bg-violet-500/10' },
];

export default function EmergencyPage() {
  const [selectedRoad, setSelectedRoad] = useState<RoadId | ''>('');
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('ambulance');
  const [isActive, setIsActive] = useState(false);
  const [log, setLog] = useState<{ time: string; road: string; type: string }[]>([]);

  const activate = () => {
    if (!selectedRoad) return;
    const road = ROADS.find((r) => r.id === selectedRoad)!;
    const type = EMERGENCY_TYPES.find((t) => t.id === emergencyType)!;
    setIsActive(true);
    setLog((prev) => [
      { time: new Date().toLocaleTimeString(), road: road.name, type: type.label },
      ...prev.slice(0, 9),
    ]);
  };

  const deactivate = () => {
    setIsActive(false);
    setSelectedRoad('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Emergency Override</h1>
          <p className="text-slate-400 text-sm mt-0.5">Grant immediate green signal to an emergency vehicle</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/40 rounded-xl px-4 py-2 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-rose-400 text-sm font-semibold">EMERGENCY ACTIVE</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Panel */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5 space-y-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-rose-400 to-orange-600" />
            Configure Emergency
          </h2>

          {/* Emergency Type */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Emergency Type</label>
            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEmergencyType(t.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    emergencyType === t.id ? t.color : 'border-[#1e2d4d] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Road Selection */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Select Road</label>
            <select
              id="emergency-road-select"
              value={selectedRoad}
              onChange={(e) => setSelectedRoad(e.target.value as RoadId)}
              className="w-full bg-slate-800/80 border border-[#1e2d4d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-colors"
            >
              <option value="">— Select a road —</option>
              {ROADS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          {!isActive ? (
            <button
              id="activate-emergency"
              onClick={activate}
              disabled={!selectedRoad}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold text-sm tracking-wide hover:from-rose-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-rose-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              🚨 Activate Emergency Override
            </button>
          ) : (
            <button
              id="deactivate-emergency"
              onClick={deactivate}
              className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              ✅ Deactivate Override
            </button>
          )}
        </div>

        {/* Signal Map */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
            Signal Status
          </h2>
          <div className="space-y-3">
            {ROADS.map((road) => {
              const isGreen = isActive && road.id === selectedRoad;
              const isRed = isActive && road.id !== selectedRoad;
              return (
                <div
                  key={road.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    isGreen
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : isRed
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-[#0d1326]/60 border-[#1e2d4d]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <div className={`w-4 h-4 rounded-full transition-all duration-500 ${isGreen ? 'bg-emerald-400 shadow-lg shadow-emerald-400/60 animate-pulse' : 'bg-slate-700'}`} />
                      <div className={`w-4 h-4 rounded-full transition-all duration-500 ${isRed ? 'bg-rose-400 shadow-lg shadow-rose-400/60' : 'bg-slate-700'}`} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{road.name}</p>
                      <p className="text-slate-500 text-xs">{road.location}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isGreen ? 'bg-emerald-500/20 text-emerald-400' :
                    isRed ? 'bg-rose-500/20 text-rose-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {isGreen ? '🟢 GREEN' : isRed ? '🔴 RED' : '⚫ STANDBY'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-600" />
          Override Log
        </h2>
        {log.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No emergency overrides yet.</p>
        ) : (
          <div className="space-y-2">
            {log.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-2 border-b border-[#1e2d4d] last:border-0">
                <span className="text-slate-500 font-mono text-xs w-20 flex-shrink-0">{entry.time}</span>
                <span className="text-rose-400">🚨</span>
                <span className="text-white">{entry.type} override on <span className="text-cyan-400 font-semibold">{entry.road}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
