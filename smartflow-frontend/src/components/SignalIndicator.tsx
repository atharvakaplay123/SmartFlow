'use client';

interface SignalIndicatorProps {
  roadName: string;
  greenTime: number;
  isGreen: boolean;
}

export default function SignalIndicator({ roadName, greenTime, isGreen }: SignalIndicatorProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
        isGreen
          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
          : 'bg-[#0d1326]/60 border-[#1e2d4d]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Signal Light */}
        <div className="flex flex-col gap-1 items-center">
          <div
            className={`w-4 h-4 rounded-full transition-all duration-500 ${
              isGreen
                ? 'bg-emerald-400 shadow-lg shadow-emerald-400/60 animate-pulse'
                : 'bg-slate-700'
            }`}
          />
          <div
            className={`w-4 h-4 rounded-full transition-all duration-500 ${
              !isGreen
                ? 'bg-rose-400 shadow-lg shadow-rose-400/60'
                : 'bg-slate-700'
            }`}
          />
        </div>

        <div>
          <p className="text-white text-sm font-semibold">{roadName}</p>
          <p className={`text-xs font-medium ${isGreen ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isGreen ? '🟢 GREEN' : '🔴 RED'}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`text-lg font-bold ${isGreen ? 'text-emerald-400' : 'text-slate-500'}`}>
          {greenTime}s
        </p>
        <p className="text-slate-500 text-xs">green time</p>
      </div>
    </div>
  );
}
