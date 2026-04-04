'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  accent?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';
  badge?: string;
}

const accentStyles: Record<string, { border: string; icon: string; text: string; badge: string }> = {
  cyan:    { border: 'border-cyan-500/30',   icon: 'bg-cyan-500/15 text-cyan-400',    text: 'text-cyan-400',    badge: 'bg-cyan-500/20 text-cyan-300' },
  emerald: { border: 'border-emerald-500/30', icon: 'bg-emerald-500/15 text-emerald-400', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  amber:   { border: 'border-amber-500/30',   icon: 'bg-amber-500/15 text-amber-400',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300' },
  rose:    { border: 'border-rose-500/30',    icon: 'bg-rose-500/15 text-rose-400',     text: 'text-rose-400',    badge: 'bg-rose-500/20 text-rose-300' },
  violet:  { border: 'border-violet-500/30',  icon: 'bg-violet-500/15 text-violet-400', text: 'text-violet-400',  badge: 'bg-violet-500/20 text-violet-300' },
};

export default function StatCard({ title, value, subtitle, icon, accent = 'cyan', badge }: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={`relative bg-[#0d1326]/80 backdrop-blur-xl border ${styles.border} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group`}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-2xl font-bold ${styles.text} truncate`}>{value}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>{badge}</span>
          )}
          {icon && (
            <div className={`w-10 h-10 rounded-xl ${styles.icon} flex items-center justify-center text-xl`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
