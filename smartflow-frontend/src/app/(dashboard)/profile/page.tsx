'use client';

import { useState } from 'react';

const PREFERENCES = [
  { id: 'aiNotify', label: 'AI Mode Change Notifications', description: 'Alert when system switches between AI and Normal modes', enabled: true },
  { id: 'criticalAlerts', label: 'Critical Congestion Alerts', description: 'Push notifications when any road exceeds 80%', enabled: true },
  { id: 'peakReminders', label: 'Peak Hour Reminders', description: 'Remind before known peak windows', enabled: false },
  { id: 'reportEmail', label: 'Daily Summary Email', description: 'Receive end-of-day traffic report', enabled: false },
];

export default function ProfilePage() {
  const [prefs, setPrefs] = useState(PREFERENCES);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@smartflow.city');

  const togglePref = (id: string) => setPrefs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Your account details and system preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-lg shadow-cyan-500/20">
            {name.charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">{name}</h2>
              <button
                onClick={() => setEditMode(m => !m)}
                className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 px-3 py-1 rounded-lg transition-colors"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-500/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Email</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-500/60"
                  />
                </div>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-16">Email</span>
                  <span className="text-slate-300 text-sm">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-16">Role</span>
                  <span className="text-cyan-400 text-sm font-medium">Traffic Control Admin</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-16">Status</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Notification Preferences</h2>
        <div className="space-y-4">
          {prefs.map(pref => (
            <div key={pref.id} className="flex items-start gap-4 justify-between">
              <div>
                <p className="text-white text-sm font-medium">{pref.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{pref.description}</p>
              </div>
              <button
                onClick={() => togglePref(pref.id)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5 ${pref.enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${pref.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">System Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Version', value: 'v2.4.1' },
            { label: 'Environment', value: 'Production' },
            { label: 'AI Engine', value: 'SmartFlow v3' },
            { label: 'Last Updated', value: 'Apr 4, 2026' },
          ].map(({ label, value }) => (
            <div key={label} className="border-b border-white/5 pb-3">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-slate-300 font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
