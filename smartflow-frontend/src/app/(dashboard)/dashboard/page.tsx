'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import TrafficCard from '@/components/TrafficCard';
import TrafficChart from '@/components/TrafficChart';
import {
  DEFAULT_ROADS,
  buildSignalResults,
  getCongestionScore,
  getMostCongestedRoad,
  calculateGreenTimes,
  type RoadData,
  type RoadId,
} from '@/utils/trafficLogic';
import type { TrafficDataPoint } from '@/components/TrafficChart';

function generateHistoryPoint(roads: RoadData[]): TrafficDataPoint {
  const now = new Date();
  return {
    time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
    roadA: roads.find(r => r.id === 'A')?.density ?? 0,
    roadB: roads.find(r => r.id === 'B')?.density ?? 0,
    roadC: roads.find(r => r.id === 'C')?.density ?? 0,
    roadD: roads.find(r => r.id === 'D')?.density ?? 0,
  };
}

function randomDrift(value: number): number {
  const change = Math.floor((Math.random() - 0.5) * 16);
  return Math.max(5, Math.min(99, value + change));
}

export default function DashboardPage() {
  const [roads, setRoads] = useState<RoadData[]>(DEFAULT_ROADS);
  const [history, setHistory] = useState<TrafficDataPoint[]>([generateHistoryPoint(DEFAULT_ROADS)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoads(prev => {
        const updated = prev.map(r => ({ ...r, density: randomDrift(r.density) }));
        setHistory(h => [...h.slice(-9), generateHistoryPoint(updated)]);
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const signals = buildSignalResults(roads);
  const congestionScore = getCongestionScore(roads);
  const mostCongested = getMostCongestedRoad(roads);
  const greenTimes = calculateGreenTimes(roads);
  const activeRoadId: RoadId = signals.find(s => s.isGreen)?.roadId ?? 'A';

  const modeLabel = congestionScore > 55 ? 'AI MODE' : 'NORMAL';
  const cycleTotal = Object.values(greenTimes).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Traffic Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Live intersection overview · Updates every 3s</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="AI Mode"
          value={modeLabel}
          subtitle="Based on avg load"
          icon="🧠"
          accent={modeLabel === 'AI MODE' ? 'violet' : 'cyan'}
          badge="Live"
        />
        <StatCard
          title="Congestion Score"
          value={`${congestionScore}%`}
          subtitle="Average across roads"
          icon="🚦"
          accent={congestionScore >= 80 ? 'rose' : congestionScore >= 50 ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Most Congested"
          value={mostCongested.name}
          subtitle={`${mostCongested.density}% density`}
          icon="⚠️"
          accent="rose"
        />
        <StatCard
          title="Cycle Time"
          value={`${cycleTotal}s`}
          subtitle="Total signal cycle"
          icon="🔄"
          accent="cyan"
        />
      </div>

      {/* Road Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {roads.map(road => (
          <TrafficCard
            key={road.id}
            roadName={road.name}
            density={road.density}
            isActive={road.id === activeRoadId}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Live Traffic Trend</h2>
        <TrafficChart data={history} />
      </div>
    </div>
  );
}
