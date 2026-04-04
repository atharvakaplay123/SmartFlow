'use client';

import { useState } from 'react';

type AlertSeverity = 'critical' | 'warning' | 'info';

interface Alert {
  id: number;
  severity: AlertSeverity;
  title: string;
  description: string;
  time: string;
  road: string;
  dismissed: boolean;
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, severity: 'critical', title: 'Critical Congestion', description: 'Road B has exceeded 90% density for over 5 minutes.', time: '2 min ago', road: 'Road B', dismissed: false },
  { id: 2, severity: 'warning', title: 'High Traffic Load', description: 'Road D approaching congestion threshold at 74%.', time: '8 min ago', road: 'Road D', dismissed: false },
  { id: 3, severity: 'warning', title: 'Cycle Time Anomaly', description: 'Road A green time is disproportionately short relative to traffic.', time: '15 min ago', road: 'Road A', dismissed: false },
  { id: 4, severity: 'info', title: 'AI Mode Activated', description: 'System switched to AI-controlled signal timing automatically.', time: '22 min ago', road: 'All Roads', dismissed: false },
  { id: 5, severity: 'info', title: 'Traffic Decreasing', description: 'Road C load reduced to 28% — stable flow expected.', time: '35 min ago', road: 'Road C', dismissed: false },
];

const severityConfig: Record<AlertSeverity, { border: string; bg: string; badge: string; dot: string; icon: string }> = {
  critical: { border: 'border-rose-500/40', bg: 'bg-rose-500/8', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', dot: 'bg-rose-400', icon: '🔴' },
  warning:  { border: 'border-amber-500/40', bg: 'bg-amber-500/8', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400', icon: '🟡' },
  info:     { border: 'border-cyan-500/30',  bg: 'bg-cyan-500/5',  badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20', dot: 'bg-cyan-400', icon: '🔵' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');

  const dismiss = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  const dismissAll = () => setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));

  const visible = alerts.filter(a => !a.dismissed && (filter === 'all' || a.severity === filter));
  const counts = { critical: alerts.filter(a => !a.dismissed && a.severity === 'critical').length, warning: alerts.filter(a => !a.dismissed && a.severity === 'warning').length, info: alerts.filter(a => !a.dismissed && a.severity === 'info').length };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Alerts</h1>
          <p className="text-slate-400 text-sm mt-1">{visible.length} active alert{visible.length !== 1 ? 's' : ''}</p>
        </div>
        {visible.length > 0 && (
          <button onClick={dismissAll} className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg transition-colors">
            Dismiss All
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'critical', 'warning', 'info'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${filter === tab ? 'bg-white/10 text-white border-white/20' : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'}`}
          >
            {tab === 'all' ? `All (${counts.critical + counts.warning + counts.info})` : tab === 'critical' ? `Critical (${counts.critical})` : tab === 'warning' ? `Warning (${counts.warning})` : `Info (${counts.info})`}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="bg-[#0d1326]/60 border border-[#1e2d4d] rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-slate-400 font-medium">All clear — no active alerts</p>
          </div>
        ) : (
          visible.map(alert => {
            const style = severityConfig[alert.severity];
            return (
              <div key={alert.id} className={`flex items-start gap-4 p-5 rounded-2xl border ${style.border} ${style.bg} transition-all`}>
                <div className={`w-2.5 h-2.5 rounded-full ${style.dot} mt-1.5 shrink-0 ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{alert.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.badge}`}>{alert.severity}</span>
                    <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">{alert.road}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{alert.description}</p>
                  <p className="text-slate-600 text-xs mt-1">{alert.time}</p>
                </div>
                <button onClick={() => dismiss(alert.id)} className="text-slate-600 hover:text-white transition-colors text-lg shrink-0 leading-none">×</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
