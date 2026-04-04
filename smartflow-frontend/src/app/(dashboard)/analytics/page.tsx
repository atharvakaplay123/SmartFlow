'use client';

import { useState, useEffect } from 'react';
import TrafficChart from '@/components/TrafficChart';
import StatCard from '@/components/StatCard';
import {
  DEFAULT_ROADS,
  getMostCongestedRoad,
  getCongestionScore,
  type RoadData,
} from '@/utils/trafficLogic';
import type { TrafficDataPoint } from '@/components/TrafficChart';

function drift(v: number) {
  return Math.max(5, Math.min(99, v + Math.floor((Math.random() - 0.5) * 16)));
}

const HOURS = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM'];
function genHourlyData(): TrafficDataPoint[] {
  let a = 30, b = 40, c = 25, d = 35;
  return HOURS.map(h => {
    a = drift(a); b = drift(b); c = drift(c); d = drift(d);
    return { time: h, roadA: a, roadB: b, roadC: c, roadD: d };
  });
}

export default function AnalyticsPage() {
  const [roads, setRoads] = useState<RoadData[]>(DEFAULT_ROADS);
  const [hourlyData] = useState<TrafficDataPoint[]>(genHourlyData);
  const [liveHistory, setLiveHistory] = useState<TrafficDataPoint[]>([]);

  useEffect(() => {
    const snap = (): TrafficDataPoint => {
      const now = new Date();
      return {
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
        roadA: roads.find(r => r.id === 'A')?.density ?? 0,
        roadB: roads.find(r => r.id === 'B')?.density ?? 0,
        roadC: roads.find(r => r.id === 'C')?.density ?? 0,
        roadD: roads.find(r => r.id === 'D')?.density ?? 0,
      };
    };
    setLiveHistory([snap()]);
    const id = setInterval(() => {
      setRoads(prev => {
        const updated = prev.map(r => ({ ...r, density: drift(r.density) }));
        setLiveHistory(h => [...h.slice(-9), snap()]);
        return updated;
      });
    }, 3000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const congestion = getCongestionScore(roads);
  const mostCongested = getMostCongestedRoad(roads);
  const avgWait = Math.round(120 * (mostCongested.density / roads.reduce((s, r) => s + r.density, 0)));

  const roadBarData = roads.map(r => ({ label: r.name, value: r.density }));

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Traffic Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Historical patterns and real-time insights</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Peak Hour" value="6:00 PM" icon="⏰" accent="amber" />
        <StatCard title="Avg Daily Traffic" value="14,250" subtitle="vehicles/day" icon="🚗" accent="cyan" />
        <StatCard title="Congestion Freq" value="12×/day" subtitle="High load events" icon="📈" accent="violet" />
        <StatCard title="Avg Wait Time" value={`${avgWait}s`} subtitle="Predicted" icon="⏱️" accent={avgWait > 40 ? 'rose' : 'emerald'} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hourly trend */}
        <div className="xl:col-span-2 bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Hourly Traffic Pattern</h2>
          <TrafficChart data={hourlyData} />
        </div>

        {/* Road bar breakdown */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Road-Wise Load</h2>
          <div className="space-y-4">
            {roadBarData.map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-slate-400 font-medium">{label}</span>
                  <span className="text-xs text-slate-300 font-bold">{value}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${value >= 80 ? 'bg-rose-500' : value >= 60 ? 'bg-amber-400' : value >= 40 ? 'bg-cyan-400' : 'bg-emerald-400'}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live trend */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Live Trend (Last 10 Ticks)</h2>
        <TrafficChart data={liveHistory} />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0d1326]/80 border border-[#1e2d4d] rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Peak Congestion</span>
          <p className="text-white font-semibold">Evenings: 17:00 – 19:30</p>
          <p className="text-slate-500 text-xs mt-1">Consistent across all roads</p>
        </div>
        <div className="bg-[#0d1326]/80 border border-rose-500/20 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Most Congested Road</span>
          <p className="text-rose-400 font-bold text-lg">{mostCongested.name}</p>
          <p className="text-slate-500 text-xs mt-1">{mostCongested.density}% current density</p>
        </div>
        <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-2xl p-5">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block mb-2">🤖 AI Suggestion</span>
          <p className="text-indigo-200 text-sm font-medium leading-relaxed">
            Increase cycle time on {mostCongested.name} during peak hours to reduce avg wait below 30s.
          </p>
        </div>
      </div>
    </div>
  );
}
