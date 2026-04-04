'use client';

import { useState, useEffect, useCallback } from 'react';
import TrafficCard from '@/components/TrafficCard';
import SignalIndicator from '@/components/SignalIndicator';
import StatCard from '@/components/StatCard';
import TrafficChart, { type TrafficDataPoint } from '@/components/TrafficChart';
import { DEFAULT_ROADS, buildSignalResults, getActiveRoad, CYCLE_TIME, type RoadData } from '@/utils/trafficLogic';

function generateHistoryPoint(roads: RoadData[], label: string): TrafficDataPoint {
  return {
    time: label,
    roadA: roads[0].density,
    roadB: roads[1].density,
    roadC: roads[2].density,
    roadD: roads[3].density,
  };
}

function generateInitialHistory(roads: RoadData[]): TrafficDataPoint[] {
  const now = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const t = new Date(now.getTime() - (9 - i) * 30_000);
    const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return {
      time: label,
      roadA: Math.max(5, roads[0].density + Math.round((Math.random() - 0.5) * 20)),
      roadB: Math.max(5, roads[1].density + Math.round((Math.random() - 0.5) * 20)),
      roadC: Math.max(5, roads[2].density + Math.round((Math.random() - 0.5) * 20)),
      roadD: Math.max(5, roads[3].density + Math.round((Math.random() - 0.5) * 20)),
    };
  });
}

export default function DashboardPage() {
  const [roads, setRoads] = useState<RoadData[]>(DEFAULT_ROADS);
  const [history, setHistory] = useState<TrafficDataPoint[]>(() => generateInitialHistory(DEFAULT_ROADS));
  const [currentTime, setCurrentTime] = useState('');

  // Live clock
  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date().toLocaleTimeString());
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  // Simulate traffic change every 5 s
  const tick = useCallback(() => {
    setRoads((prev) => {
      const updated = prev.map((r) => ({
        ...r,
        density: Math.min(100, Math.max(5, r.density + Math.round((Math.random() - 0.5) * 12))),
      }));

      const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory((h) => [...h.slice(-19), generateHistoryPoint(updated, timeLabel)]);

      return updated;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [tick]);

  const signals = buildSignalResults(roads);
  const activeRoad = getActiveRoad(roads);
  const activeRoadName = `Road ${activeRoad}`;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Traffic Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">AI-powered intersection control — real-time monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0d1326] border border-[#1e2d4d] rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-sm">Live</span>
            <span className="text-white text-sm font-mono">{currentTime}</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Intersection"
          value="Central-01"
          subtitle="Main & Cross Ave"
          icon="🗺️"
          accent="cyan"
        />
        <StatCard
          title="AI Mode"
          value="Active"
          subtitle="Adaptive signal control"
          icon="🤖"
          accent="emerald"
          badge="LIVE"
        />
        <StatCard
          title="Cycle Time"
          value={`${CYCLE_TIME}s`}
          subtitle="Fixed cycle duration"
          icon="⏱️"
          accent="violet"
        />
        <StatCard
          title="Active Green"
          value={activeRoadName}
          subtitle="Currently green signal"
          icon="🟢"
          accent="emerald"
          badge="GREEN"
        />
      </div>

      {/* Traffic Density Panel */}
      <div>
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
          Traffic Density — All Roads
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {roads.map((road) => (
            <TrafficCard
              key={road.id}
              roadName={road.name}
              density={road.density}
              isActive={road.id === activeRoad}
            />
          ))}
        </div>
      </div>

      {/* Signal Status + Green Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal Status */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600" />
            Signal Status
          </h2>
          <div className="space-y-3">
            {signals.map((sig) => (
              <SignalIndicator
                key={sig.roadId}
                roadName={`Road ${sig.roadId}`}
                greenTime={sig.greenTime}
                isGreen={sig.isGreen}
              />
            ))}
          </div>
        </div>

        {/* Green Time Allocation */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-600" />
            Green Time Allocation
          </h2>
          <div className="space-y-4">
            {signals.map((sig) => {
              const pct = Math.round((sig.greenTime / CYCLE_TIME) * 100);
              const colors: Record<string, string> = {
                A: 'from-cyan-500 to-blue-600',
                B: 'from-violet-500 to-purple-600',
                C: 'from-emerald-500 to-teal-600',
                D: 'from-amber-500 to-orange-600',
              };
              const textColors: Record<string, string> = {
                A: 'text-cyan-400',
                B: 'text-violet-400',
                C: 'text-emerald-400',
                D: 'text-amber-400',
              };
              return (
                <div key={sig.roadId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-semibold ${textColors[sig.roadId]}`}>Road {sig.roadId}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">{pct}%</span>
                      <span className={`font-bold text-sm ${sig.isGreen ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {sig.greenTime}s
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colors[sig.roadId]} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-slate-600 text-xs mt-2">
              Formula: (Road Density / Total Density) × {CYCLE_TIME}s
            </p>
          </div>
        </div>
      </div>

      {/* Live Traffic Chart */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-400 to-purple-600" />
          Live Traffic Density Chart
          <span className="ml-auto text-xs text-slate-500">Updated every 5s</span>
        </h2>
        <TrafficChart data={history} />
      </div>
    </div>
  );
}
