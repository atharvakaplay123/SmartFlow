'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts';
import StatCard from '@/components/StatCard';
import { DEFAULT_ROADS, buildSignalResults, getCongestionScore, getMostCongestedRoad, CYCLE_TIME } from '@/utils/trafficLogic';

const barData = DEFAULT_ROADS.map((r) => ({ road: r.name, density: r.density }));

const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24'];

const trendData = Array.from({ length: 12 }, (_, i) => {
  const hour = (i + 8) % 24;
  return {
    time: `${hour.toString().padStart(2, '0')}:00`,
    roadA: Math.round(30 + Math.sin(i * 0.6) * 25 + Math.random() * 10),
    roadB: Math.round(45 + Math.cos(i * 0.5) * 20 + Math.random() * 10),
    roadC: Math.round(25 + Math.sin(i * 0.8) * 15 + Math.random() * 10),
    roadD: Math.round(55 + Math.cos(i * 0.4) * 25 + Math.random() * 10),
  };
});

export default function AnalyticsPage() {
  const signals = useMemo(() => buildSignalResults(DEFAULT_ROADS), []);
  const congestion = getCongestionScore(DEFAULT_ROADS);
  const mostCongested = getMostCongestedRoad(DEFAULT_ROADS);
  const avgGreenTime = Math.round(signals.reduce((s, r) => s + r.greenTime, 0) / signals.length);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-0.5">Traffic performance metrics and trend analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Signal Time" value={`${avgGreenTime}s`} subtitle="Per road average" icon="⏱️" accent="cyan" />
        <StatCard title="Congestion Score" value={`${congestion}/100`} subtitle="Network-wide load" icon="📈" accent="amber" badge={congestion > 60 ? 'High' : 'Normal'} />
        <StatCard title="Most Congested" value={mostCongested.name} subtitle={`${mostCongested.density} density`} icon="🚦" accent="rose" />
        <StatCard title="Cycle Efficiency" value={`${Math.round((1 - congestion / 100) * 100)}%`} subtitle="Signal optimization" icon="✅" accent="emerald" />
      </div>

      {/* Bar + Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
            Traffic Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" />
              <XAxis dataKey="road" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1326', border: '1px solid #1e2d4d', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Bar dataKey="density" radius={[6, 6, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Signal Time Table */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-400 to-purple-600" />
            Signal Time Breakdown
          </h2>
          <div className="space-y-3">
            {signals.map((sig, i) => {
              const pct = Math.round((sig.greenTime / CYCLE_TIME) * 100);
              return (
                <div key={sig.roadId}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 text-sm font-medium" style={{ color: COLORS[i] }}>Road {sig.roadId}</span>
                    <span className="text-slate-400 text-sm">{sig.greenTime}s ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: COLORS[i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-slate-800/40 rounded-xl">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Cycle Time</span>
              <span className="text-white font-bold">{CYCLE_TIME}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-600" />
          Traffic Trend — Hourly Overview
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#0d1326', border: '1px solid #1e2d4d', borderRadius: '12px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {['roadA', 'roadB', 'roadC', 'roadD'].map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} name={`Road ${String.fromCharCode(65 + i)}`} stroke={COLORS[i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
