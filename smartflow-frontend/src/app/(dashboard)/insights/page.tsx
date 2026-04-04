import StatCard from '@/components/StatCard';
import { DEFAULT_ROADS, getMostCongestedRoad, calculateTotalTraffic } from '@/utils/trafficLogic';

const INSIGHTS = [
  {
    title: 'Total Traffic Processed',
    value: '2.4M',
    subtitle: 'Vehicles since deployment',
    icon: '🚗',
    accent: 'cyan' as const,
    badge: '+12%',
  },
  {
    title: 'Avg Wait Time Reduction',
    value: '38%',
    subtitle: 'vs. fixed-cycle signals',
    icon: '⏳',
    accent: 'emerald' as const,
    badge: 'Improved',
  },
  {
    title: 'AI Optimizations Run',
    value: '18,540',
    subtitle: 'Signal updates today',
    icon: '🤖',
    accent: 'violet' as const,
  },
  {
    title: 'Fuel Savings Estimate',
    value: '14 tons',
    subtitle: 'CO₂ reduction this month',
    icon: '🌱',
    accent: 'emerald' as const,
    badge: 'Eco',
  },
  {
    title: 'Emergency Responses',
    value: '7',
    subtitle: 'Override activations today',
    icon: '🚨',
    accent: 'rose' as const,
  },
  {
    title: 'Signal Uptime',
    value: '99.98%',
    subtitle: 'System availability',
    icon: '✅',
    accent: 'emerald' as const,
    badge: 'Stable',
  },
];

const PEAK_HOURS = ['07:30–09:00', '12:00–13:30', '17:30–19:30'];

export default function InsightsPage() {
  const mostCongested = getMostCongestedRoad(DEFAULT_ROADS);
  const totalTraffic = calculateTotalTraffic(DEFAULT_ROADS);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Insights</h1>
        <p className="text-slate-400 text-sm mt-0.5">System-wide performance and traffic intelligence summary</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {INSIGHTS.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Today's Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Most Congested */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Most Congested Road Today</p>
          <p className="text-3xl font-extrabold text-rose-400">{mostCongested.name}</p>
          <p className="text-slate-500 text-sm mt-1">Density: {mostCongested.density} / 100</p>
          <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500" style={{ width: `${mostCongested.density}%` }} />
          </div>
        </div>

        {/* Current Load */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Current Traffic Load</p>
          <p className="text-3xl font-extrabold text-amber-400">{totalTraffic}<span className="text-base text-slate-500 font-normal"> / 400</span></p>
          <p className="text-slate-500 text-sm mt-1">Across 4 monitored roads</p>
          <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${(totalTraffic / 400) * 100}%` }} />
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Peak Traffic Hours</p>
          <div className="space-y-2">
            {PEAK_HOURS.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm font-mono">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Road-level table */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
          Road-Level Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4d]">
                {['Road', 'Density', 'Status', 'Avg Wait Reduction', 'Daily Vehicles'].map((h) => (
                  <th key={h} className="text-left text-slate-500 text-xs uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEFAULT_ROADS.map((road) => {
                const status = road.density >= 80 ? 'Critical' : road.density >= 60 ? 'High' : road.density >= 40 ? 'Moderate' : 'Low';
                const statusColor = road.density >= 80 ? 'text-rose-400' : road.density >= 60 ? 'text-amber-400' : road.density >= 40 ? 'text-yellow-400' : 'text-emerald-400';
                return (
                  <tr key={road.id} className="border-b border-[#1e2d4d]/50 last:border-0">
                    <td className="py-3 pr-4 text-white font-semibold">{road.name}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${road.density}%` }} />
                        </div>
                        <span className="text-slate-300">{road.density}</span>
                      </div>
                    </td>
                    <td className={`py-3 pr-4 ${statusColor} font-medium`}>{status}</td>
                    <td className="py-3 pr-4 text-emerald-400">↓ {Math.round(30 + road.density * 0.1)}%</td>
                    <td className="py-3 text-slate-300">{(Math.round(road.density * 520 + 10000)).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
