'use client';

interface DensitySliderProps {
  roadName: string;
  value: number;
  onChange: (value: number) => void;
}

const ROAD_ACCENT: Record<string, string> = {
  'Road A': 'accent-cyan-400',
  'Road B': 'accent-violet-400',
  'Road C': 'accent-emerald-400',
  'Road D': 'accent-amber-400',
};

const ROAD_GRADIENT: Record<string, string> = {
  'Road A': 'from-cyan-500 to-blue-600',
  'Road B': 'from-violet-500 to-purple-600',
  'Road C': 'from-emerald-500 to-teal-600',
  'Road D': 'from-amber-500 to-orange-600',
};

const ROAD_TEXT: Record<string, string> = {
  'Road A': 'text-cyan-400',
  'Road B': 'text-violet-400',
  'Road C': 'text-emerald-400',
  'Road D': 'text-amber-400',
};

export default function DensitySlider({ roadName, value, onChange }: DensitySliderProps) {
  const gradient = ROAD_GRADIENT[roadName] ?? 'from-cyan-500 to-blue-600';
  const textColor = ROAD_TEXT[roadName] ?? 'text-cyan-400';
  const accentClass = ROAD_ACCENT[roadName] ?? 'accent-cyan-400';

  const congestion =
    value >= 80 ? { label: 'Critical', color: 'text-rose-400' } :
    value >= 60 ? { label: 'High', color: 'text-amber-400' } :
    value >= 40 ? { label: 'Moderate', color: 'text-yellow-400' } :
    { label: 'Low', color: 'text-emerald-400' };

  return (
    <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${gradient}`} />
          <span className={`font-bold text-sm ${textColor}`}>{roadName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${congestion.color}`}>{congestion.label}</span>
          <span className={`text-2xl font-extrabold ${textColor}`}>{value}</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${accentClass} bg-slate-800`}
        style={{
          background: `linear-gradient(to right, var(--tw-gradient-from) 0%, var(--tw-gradient-to) ${value}%, #1e293b ${value}%, #1e293b 100%)`,
        }}
      />
      <div className="flex justify-between mt-1.5">
        <span className="text-slate-600 text-xs">0</span>
        <span className="text-slate-600 text-xs">100</span>
      </div>
    </div>
  );
}
