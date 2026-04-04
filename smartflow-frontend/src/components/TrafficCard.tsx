'use client';

interface TrafficCardProps {
  roadName: string;
  density: number;
  isActive?: boolean;
}

const ROAD_COLORS: Record<string, string> = {
  'Road A': 'from-cyan-500 to-blue-600',
  'Road B': 'from-violet-500 to-purple-600',
  'Road C': 'from-emerald-500 to-teal-600',
  'Road D': 'from-amber-500 to-orange-600',
};

const ROAD_BG: Record<string, string> = {
  'Road A': 'bg-cyan-500/10 border-cyan-500/30',
  'Road B': 'bg-violet-500/10 border-violet-500/30',
  'Road C': 'bg-emerald-500/10 border-emerald-500/30',
  'Road D': 'bg-amber-500/10 border-amber-500/30',
};

const ROAD_TEXT: Record<string, string> = {
  'Road A': 'text-cyan-400',
  'Road B': 'text-violet-400',
  'Road C': 'text-emerald-400',
  'Road D': 'text-amber-400',
};

export default function TrafficCard({ roadName, density, isActive = false }: TrafficCardProps) {
  const gradient = ROAD_COLORS[roadName] ?? 'from-cyan-500 to-blue-600';
  const bg = ROAD_BG[roadName] ?? 'bg-cyan-500/10 border-cyan-500/30';
  const textColor = ROAD_TEXT[roadName] ?? 'text-cyan-400';

  const congestionLabel =
    density >= 80 ? 'Critical' : density >= 60 ? 'High' : density >= 40 ? 'Moderate' : 'Low';
  const congestionColor =
    density >= 80 ? 'text-rose-400 bg-rose-500/10' : density >= 60 ? 'text-amber-400 bg-amber-500/10' : density >= 40 ? 'text-yellow-400 bg-yellow-500/10' : 'text-emerald-400 bg-emerald-500/10';

  return (
    <div
      className={`relative bg-[#0d1326]/80 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${
        isActive ? `${bg} ring-1 ring-inset ring-current shadow-lg` : 'border-[#1e2d4d] hover:border-slate-600'
      }`}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${gradient}`} />
          <span className={`font-bold text-sm ${textColor}`}>{roadName}</span>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${congestionColor}`}>
            {congestionLabel}
          </span>
        </div>
      </div>

      {/* Density Value */}
      <div className="mb-3">
        <span className={`text-3xl font-extrabold ${textColor}`}>{density}</span>
        <span className="text-slate-500 text-sm ml-1">/ 100</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
          style={{ width: `${density}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-slate-600 text-xs">0</span>
        <span className="text-slate-500 text-xs">{density}% density</span>
        <span className="text-slate-600 text-xs">100</span>
      </div>
    </div>
  );
}
