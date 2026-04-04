'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AlertsPage() {
  const router = useRouter();

  // Navigation matching sidebar
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "🧠" },
    { name: "Control", href: "/admin", icon: "⚙️" },
    { name: "Analytics", href: "/admin", icon: "📈" },
    { name: "Emergency Override", href: "/emergency", icon: "🚨" },
    { name: "Alerts", href: "/alerts", icon: "🔔" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  type Severity = 'CRITICAL' | 'WARNING' | 'INFO';
  type Impact = 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  type AlertType = 'Congestion' | 'Emergency' | 'System';
  type Status = 'Active' | 'Resolved';

  interface InternalAlert {
    id: string;
    title: string;
    type: AlertType;
    severity: Severity;
    impact: Impact;
    detectedAt: number;
    timestampStr: string;
    description: string;
    aiAction: string;
    aiExplanation: string;
    junction: string;
    status: Status;
  }

  const [alerts, setAlerts] = useState<InternalAlert[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [selectedAlert, setSelectedAlert] = useState<InternalAlert | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Generate an initial dummy list
  useEffect(() => {
    const now = Date.now();
    setAlerts([
      {
        id: 'ALT-101',
        title: 'Emergency vehicle detected',
        type: 'Emergency',
        severity: 'CRITICAL',
        impact: 'HIGH IMPACT',
        detectedAt: now - 3000,
        timestampStr: new Date(now - 3000).toLocaleTimeString('en-US', { hour12: false }),
        description: 'An ambulance requires immediate clearance at Sector 4.',
        aiAction: 'Green corridor activated ✅',
        aiExplanation: 'AI pre-empted standard cycles along Route 4 to minimize vehicle delay.',
        junction: 'Sector 4 Intersection',
        status: 'Active'
      },
      {
        id: 'ALT-102',
        title: 'Unexpected traffic buildup',
        type: 'Congestion',
        severity: 'WARNING',
        impact: 'MEDIUM IMPACT',
        detectedAt: now - 60000,
        timestampStr: new Date(now - 60000).toLocaleTimeString('en-US', { hour12: false }),
        description: 'Traffic density spike (85%) detected on Palasia Road.',
        aiAction: 'Cycle time extended by 15s ⏱️',
        aiExplanation: 'Extended main road green interval to clear overflow and prevent cascading delays.',
        junction: 'Palasia Square',
        status: 'Resolved'
      }
    ]);
  }, []);

  // Blinking dot interval
  useEffect(() => {
    const int = setInterval(() => {
      setPulseAnimation((prev) => !prev);
    }, 1000);
    return () => clearInterval(int);
  }, []);

  // Simulator interval (every 8s)
  useEffect(() => {
    const simInterval = setInterval(() => {
      const now = Date.now();

      setAlerts((prev) => {
        // Auto resolve older alerts (older than 20s for demo purposes)
        const updated = prev.map((alt) => {
          if (alt.status === 'Active' && now - alt.detectedAt > 20000) {
            return { ...alt, status: 'Resolved' as Status };
          }
          return alt;
        });

        // Add random new alert
        const types: { t: AlertType, s: Severity, m: Impact, i: string, a: string, e: string, j: string }[] = [
          { t: 'Congestion', s: 'WARNING', m: 'MEDIUM IMPACT', i: 'Heavy bottleneck formed', a: 'Adjusted offset timings ⏱️', e: 'AI synchronized offsets to improve downstream flow.', j: 'Vijay Nagar' },
          { t: 'System', s: 'INFO', m: 'LOW IMPACT', i: 'Camera feed latency detected', a: 'Switched back-up sensor 🔄', e: 'System fell back to radar-based detection without interruption.', j: 'Regal Square' },
          { t: 'Emergency', s: 'CRITICAL', m: 'HIGH IMPACT', i: 'Fire truck in rapid transit', a: 'Force green enabled ✅', e: 'AI locked opposing traffic lights to RED.', j: 'Bhanwar Kuan' }
        ];

        const rnd = types[Math.floor(Math.random() * types.length)];
        const newAlt: InternalAlert = {
          id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
          title: rnd.i,
          type: rnd.t,
          severity: rnd.s,
          impact: rnd.m,
          detectedAt: now,
          timestampStr: new Date(now).toLocaleTimeString('en-US', { hour12: false }),
          description: `Auto-generated event: ${rnd.i} near ${rnd.j}.`,
          aiAction: rnd.a,
          aiExplanation: rnd.e,
          junction: rnd.j,
          status: 'Active'
        };

        return [newAlt, ...updated];
      });
    }, 8000);

    return () => clearInterval(simInterval);
  }, []);

  // Filtering
  const filteredAlerts = alerts.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return a.severity === 'CRITICAL';
    if (filter === 'Congestion') return a.type === 'Congestion';
    if (filter === 'Emergency') return a.type === 'Emergency';
    if (filter === 'System') return a.type === 'System';
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'Active').length;

  const handleCardClick = (alt: InternalAlert) => {
    setSelectedAlert(alt);
    setPanelOpen(true);
  };

  const getSeverityColors = (sev: Severity) => {
    if (sev === 'CRITICAL') return 'bg-rose-100 text-rose-700 border-rose-200';
    if (sev === 'WARNING') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getSeverityDot = (sev: Severity) => {
    if (sev === 'CRITICAL') return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
    if (sev === 'WARNING') return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
    return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]';
  };

  const getIcon = (sev: Severity) => {
    if (sev === 'CRITICAL') return '🚨';
    if (sev === 'WARNING') return '⚠️';
    return 'ℹ️';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#0A192F] flex flex-col shadow-xl z-20 flex-shrink-0 h-screen relative">
        <div className="flex-1 flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
              <svg className="w-5 h-5 text-[#0A192F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wide uppercase text-white">SmartFlow AI</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.name === "Alerts";
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl opacity-80">{item.icon}</span>
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-8 sm:px-12 flex-shrink-0 sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm">
          <div>
             <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A192F]/60 mb-1">EVENTS</div>
             <h1 className="text-2xl font-bold text-[#0A192F] tracking-tight">System Alerts</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                   <div className={`w-2.5 h-2.5 rounded-full bg-rose-500 transition-opacity duration-300 ${pulseAnimation ? 'opacity-100 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'opacity-40'}`}></div>
                   LIVE
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="text-sm font-semibold text-slate-500">
                  <span className="text-rose-600 font-bold">{activeCount}</span> Active Alerts
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col overflow-y-auto w-full p-8 sm:p-12 relative">
           
           {/* Filter Bar */}
           <div className="flex flex-wrap items-center gap-3 mb-10">
             {['All', 'Critical', 'Congestion', 'Emergency', 'System'].map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                   filter === f 
                     ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-md' 
                     : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>

           {/* Timeline Container */}
           <div className="relative pl-8 pb-12 w-full">
             {/* Vertical Line */}
             <div className="absolute left-[39px] top-4 bottom-0 w-[2px] bg-slate-200 -z-10 rounded-full"></div>

             {filteredAlerts.length === 0 && (
                 <div className="py-16 text-center text-slate-400 font-semibold border-2 border-dashed border-slate-200 rounded-2xl ml-6">
                   No alerts match the selected filter.
                 </div>
             )}

             <div className="space-y-6">
               {filteredAlerts.map(alt => {
                 const isResolved = alt.status === 'Resolved';
                 
                 return (
                   <div key={alt.id} className="relative flex items-start gap-8 group">
                      {/* Timeline Dot */}
                      <div className="relative mt-5">
                         <div className={`w-4 h-4 rounded-full border-2 border-white relative z-10 ${isResolved ? 'bg-slate-300' : getSeverityDot(alt.severity)}`}></div>
                         {!isResolved && <div className={`absolute top-0 left-0 w-full h-full rounded-full animate-ping opacity-50 ${getSeverityDot(alt.severity)}`}></div>}
                      </div>
                      
                      {/* Alert Card */}
                      <div 
                        onClick={() => handleCardClick(alt)}
                        className={`flex-1 border rounded-2xl p-6 cursor-pointer transition-all ${
                          isResolved 
                            ? 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100 hover:shadow' 
                            : 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                      >
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className={`text-lg font-bold ${isResolved ? 'text-slate-600' : 'text-[#0A192F]'}`}>
                                {alt.title}
                              </h3>
                              <div className="flex gap-2">
                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-md border ${isResolved ? 'bg-slate-100 text-slate-500 border-slate-200' : getSeverityColors(alt.severity)}`}>
                                  {alt.severity}
                                </span>
                                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                                  {alt.impact}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-slate-400 shrink-0 tabular-nums">
                              {alt.timestampStr}
                            </div>
                         </div>
                         
                         <p className="text-slate-600 text-sm mb-4">
                           {alt.description}
                         </p>
                         
                         <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-[#0A192F]">AI Action:</span>
                             <span className={`text-sm font-semibold ${isResolved ? 'text-slate-500' : 'text-indigo-600'}`}>{alt.aiAction}</span>
                           </div>
                           {isResolved && (
                             <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded">
                               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                               Resolved by AI
                             </span>
                           )}
                         </div>
                      </div>
                   </div>
                 )
               })}
             </div>

           </div>
        </div>
      </main>

      {/* ── SIDE PANEL ── */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-in-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedAlert && (
          <div className="h-full flex flex-col font-sans">
             
             {/* Panel Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
               <div className="flex items-start gap-4">
                 <div className="text-3xl mt-1">{getIcon(selectedAlert.severity)}</div>
                 <div>
                   <h2 className="font-bold text-xl text-[#0A192F]">{selectedAlert.title}</h2>
                   <div className="flex gap-2 mt-2">
                     <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${getSeverityColors(selectedAlert.severity)}`}>
                       {selectedAlert.severity}
                     </span>
                     <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${
                         selectedAlert.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'
                     }`}>
                       {selectedAlert.status}
                     </span>
                   </div>
                 </div>
               </div>
               <button 
                 onClick={() => setPanelOpen(false)}
                 className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors shrink-0"
               >
                 ✖
               </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Details */}
                <div>
                   <div className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-3">Event Details</div>
                   <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-sm text-slate-600 leading-relaxed">
                     {selectedAlert.description}
                     <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">📍</span>
                        <span className="font-bold text-slate-700">Affected Junction:</span>
                        <span className="font-semibold text-slate-800">{selectedAlert.junction}</span>
                     </div>
                   </div>
                </div>

                {/* AI Explanation */}
                <div>
                   <div className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-3">AI Explanation</div>
                   <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm text-sm text-indigo-900 leading-relaxed">
                     <div className="font-bold text-indigo-700 mb-2">Automated Action Taken:</div>
                     {selectedAlert.aiExplanation}
                   </div>
                </div>
                
                {/* Metrics Context */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Impact</span>
                    <span className="text-sm font-bold text-slate-800">{selectedAlert.impact}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">System Type</span>
                    <span className="text-sm font-bold text-slate-800">{selectedAlert.type}</span>
                  </div>
                </div>

             </div>

             {/* Footer Button */}
             <div className="p-6 border-t border-slate-200 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={() => router.push('/admin')} // '/admin' handles 'Control' internally or they can switch tabs
                  className="w-full bg-[#0A192F] hover:bg-[#11294F] text-white py-4 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  Go to Control Panel <span className="text-lg">⚙️</span>
                </button>
             </div>

          </div>
        )}
      </div>

      {/* Overlay when panel open */}
      <div 
        className={`fixed inset-0 bg-[#0A192F]/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setPanelOpen(false)}
      ></div>

    </div>
  );
}
