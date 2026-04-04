'use client';

import { useState } from 'react';

type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  road?: string;
  read: boolean;
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', title: 'High Congestion Detected', message: 'Road B has exceeded 80% density threshold. AI is re-routing traffic.', severity: 'critical', time: '11:45:22', road: 'Road B', read: false },
  { id: '2', title: 'AI Optimization Executed', message: 'Signal cycle updated. Road B now receives extended green time (54s).', severity: 'success', time: '11:44:58', road: 'Road B', read: false },
  { id: '3', title: 'Emergency Override Activated', message: 'Ambulance override triggered on Road A. All other roads set to RED.', severity: 'critical', time: '11:30:11', road: 'Road A', read: true },
  { id: '4', title: 'Emergency Override Cleared', message: 'Road A emergency cleared. Normal signal cycle resumed.', severity: 'info', time: '11:32:05', road: 'Road A', read: true },
  { id: '5', title: 'Moderate Congestion Warning', message: 'Road D density increased to 65%. Monitor for escalation.', severity: 'warning', time: '11:15:00', road: 'Road D', read: true },
  { id: '6', title: 'System Startup', message: 'SmartFlow AI Traffic Control System initialized successfully.', severity: 'info', time: '10:00:00', read: true },
];

const SEVERITY_STYLES: Record<AlertSeverity, { border: string; badge: string; icon: string; bg: string }> = {
  critical: { border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-400', icon: '🔴', bg: 'bg-rose-500/5' },
  warning:  { border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-400', icon: '🟡', bg: 'bg-amber-500/5' },
  success:  { border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400', icon: '🟢', bg: 'bg-emerald-500/5' },
  info:     { border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400', icon: '🔵', bg: 'bg-blue-500/5' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');

  const markRead = (id: string) => setAlerts((a) => a.map((x) => (x.id === id ? { ...x, read: true } : x)));
  const markAllRead = () => setAlerts((a) => a.map((x) => ({ ...x, read: true })));

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Alerts
            {unread > 0 && (
              <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-medium">
                {unread} unread
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">System alerts and traffic event notifications</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'critical', 'warning', 'success', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/60 text-slate-400 border border-[#1e2d4d] hover:border-slate-500'
            }`}
          >
            {f === 'all' ? `All (${alerts.length})` : f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const s = SEVERITY_STYLES[alert.severity];
          return (
            <div
              key={alert.id}
              className={`relative flex gap-4 p-4 rounded-xl border ${s.border} ${s.bg} transition-all duration-200 ${!alert.read ? 'ring-1 ring-inset ring-current/20' : 'opacity-70'}`}
            >
              {!alert.read && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-400" />
              )}
              <span className="text-lg flex-shrink-0 mt-0.5">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white text-sm font-semibold">{alert.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge}`}>{alert.severity}</span>
                  {alert.road && (
                    <span className="text-xs text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full">{alert.road}</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{alert.message}</p>
                <p className="text-slate-600 text-xs mt-2 font-mono">{alert.time}</p>
              </div>
              {!alert.read && (
                <button
                  onClick={() => markRead(alert.id)}
                  className="flex-shrink-0 text-xs text-slate-500 hover:text-slate-300 self-start mt-0.5 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-600 text-sm">No alerts for this filter.</div>
        )}
      </div>
    </div>
  );
}
