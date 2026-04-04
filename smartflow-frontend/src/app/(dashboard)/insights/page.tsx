'use client';

const INSIGHTS = [
  {
    category: 'Peak Hours',
    icon: '⏰',
    accent: 'amber',
    items: [
      { label: 'Morning Rush', value: '8:00 – 9:30 AM', detail: 'Roads A & B hit 75%+ density' },
      { label: 'Evening Peak', value: '5:30 – 7:30 PM', detail: 'All roads above 65% load' },
      { label: 'Quietest Period', value: '11 PM – 5 AM', detail: 'Average load below 20%' },
    ],
  },
  {
    category: 'Road Behaviour',
    icon: '🛣️',
    accent: 'cyan',
    items: [
      { label: 'Highest Avg Load', value: 'Road B', detail: '62% daily average' },
      { label: 'Most Stable Road', value: 'Road C', detail: 'Low variance throughout day' },
      { label: 'Fastest to Clear', value: 'Road D', detail: 'Avg 18s to below threshold' },
    ],
  },
  {
    category: 'Signal Efficiency',
    icon: '🚦',
    accent: 'emerald',
    items: [
      { label: 'AI Cycle Savings', value: '23%', detail: 'vs. fixed-time signals' },
      { label: 'Avg Cycle Duration', value: '108s', detail: 'Under normal conditions' },
      { label: 'Override Events', value: '3 today', detail: 'Manual + emergency combined' },
    ],
  },
  {
    category: 'AI Recommendations',
    icon: '🤖',
    accent: 'violet',
    items: [
      { label: 'Road B Evening', value: 'Extend green', detail: 'Add 15s during 5–8 PM window' },
      { label: 'Road C Off-Peak', value: 'Reduce cycle', detail: 'Drop to 60s cycle past 10 PM' },
      { label: 'Road A Morning', value: 'Pre-empt loading', detail: 'Activate AI mode from 7:45 AM' },
    ],
  },
];

const accentMap: Record<string, { border: string; label: string; text: string }> = {
  amber:   { border: 'border-amber-500/30',   label: 'bg-amber-500/15 text-amber-300',   text: 'text-amber-400' },
  cyan:    { border: 'border-cyan-500/30',    label: 'bg-cyan-500/15 text-cyan-300',     text: 'text-cyan-400' },
  emerald: { border: 'border-emerald-500/30', label: 'bg-emerald-500/15 text-emerald-300', text: 'text-emerald-400' },
  violet:  { border: 'border-violet-500/30',  label: 'bg-violet-500/15 text-violet-300',  text: 'text-violet-400' },
};

export default function InsightsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">All Insights</h1>
        <p className="text-slate-400 text-sm mt-1">Patterns, behaviours and AI-generated recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INSIGHTS.map(section => {
          const style = accentMap[section.accent];
          return (
            <div key={section.category} className={`bg-[#0d1326]/80 backdrop-blur-xl border ${style.border} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">{section.icon}</span>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${style.text}`}>{section.category}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">{item.label}</p>
                      <p className="text-slate-500 text-xs">{item.detail}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${style.label}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-violet-900/30 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="text-white font-bold mb-2">Overall System Insight</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              SmartFlow AI is performing at <span className="text-cyan-400 font-semibold">87% efficiency</span>. 
              Focus on extending AI cycle control during evening peaks on Road B and implementing predictive pre-emptive loading on Road A mornings 
              to push efficiency above 93%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
