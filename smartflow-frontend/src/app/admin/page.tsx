'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrafficStore } from "@/store/trafficStore";
import type { RoadId } from "@/store/trafficStore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function ControlView() {
  const { manualOverride, selectedOverrideRoad, overrideHistory, setOverride } = useTrafficStore();
  const roads: RoadId[] = ['A', 'B', 'C', 'D'];

  const getTimeAgo = (time: number) => {
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    return `${Math.floor(diff / 60)} min ago`;
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col justify-center space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F]">Manual Override Control</h2>
          <p className="text-slate-500 text-sm mt-1">Directly manage intersection priorities.</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${manualOverride ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
           Control Mode: {manualOverride ? 'MANUAL' : 'AUTO (AI)'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Main Control Panel (2 cols wide) */}
        <div className={`lg:col-span-2 bg-white border rounded-2xl p-8 transition-all shadow-sm flex flex-col ${manualOverride ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'border-slate-200'}`}>
          
          <div className="h-14 mb-8 flex items-center border-b border-slate-100 pb-6">
             {manualOverride ? (
               <div className="flex flex-col">
                 <span className="text-emerald-600 font-bold text-xl flex items-center gap-2">
                   <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                   Manual Priority Active: Road {selectedOverrideRoad}
                 </span>
                 <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider mt-1.5">⚠️ AI optimization is temporarily disabled</span>
               </div>
             ) : (
               <span className="text-slate-400 text-sm font-medium">System is under automated AI control. No overrides active.</span>
             )}
          </div>

          <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-xl">
             <label className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-4 block">Select Road for PRIORITY GREEN</label>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {roads.map(road => {
                  const isSelected = manualOverride && selectedOverrideRoad === road;
                  return (
                    <button 
                      key={road}
                      onClick={() => {
                          if (manualOverride) setOverride(true, road);
                      }}
                      disabled={!manualOverride}
                      className={`py-5 rounded-xl font-bold transition-all border ${
                         !manualOverride 
                           ? 'bg-white text-slate-400 border-slate-200 cursor-not-allowed opacity-80'
                           : isSelected 
                             ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] transform scale-105 z-10'
                             : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100 active:scale-95'
                      }`}
                    >
                      ROAD {road}
                    </button>
                  )
                })}
             </div>
          </div>
          
          <div className="flex gap-4 mt-auto pt-4">
             <button 
               onClick={() => setOverride(true, 'A')}
               disabled={manualOverride}
               className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${
                 !manualOverride ? 'bg-[#0A192F] text-white hover:bg-[#11294F] shadow-md active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
               }`}
             >
               Activate Override
             </button>
             <button 
               onClick={() => setOverride(false)}
               disabled={!manualOverride}
               className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all border ${
                 manualOverride ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-sm active:scale-95' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'
               }`}
             >
               Deactivate Override
             </button>
          </div>
        </div>
        
        {/* Right Info Column */}
        <div className="flex flex-col gap-6">
          
          {/* Signal Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <h3 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-4">Current Signal Status</h3>
             <div className="space-y-3">
               {roads.map(road => {
                 const isGreen = manualOverride ? selectedOverrideRoad === road : road === 'A'; // auto sets A as placeholder green
                 return (
                   <div key={road} className="flex items-center justify-between">
                     <span className="text-sm font-semibold text-slate-600 w-16">Road {road}</span>
                     {!manualOverride ? (
                       <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded">AUTO</span>
                     ) : isGreen ? (
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.2)]">GREEN</span>
                     ) : (
                       <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded border border-rose-200">RED</span>
                     )}
                   </div>
                 )
               })}
             </div>
          </div>
          
          {/* Override History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
             <h3 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-4 flex items-center gap-2">
               <span>🕒</span> Override Activity
             </h3>
             <div className="space-y-4">
                {(overrideHistory || []).map((item, idx) => (
                  <div key={idx} className="flex flex-col border-l-2 border-indigo-200 pl-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{getTimeAgo(item.time)}</span>
                    <span className="text-sm font-medium text-slate-700">{item.action}</span>
                  </div>
                ))}
                {(!overrideHistory || overrideHistory.length === 0) && (
                  <span className="text-sm text-slate-400 italic">No recent overrides.</span>
                )}
             </div>
          </div>
          
          {/* Info Panel */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
             <h3 className="text-xs uppercase tracking-widest text-indigo-800 font-bold mb-3 flex items-center gap-2">
               <span>ℹ️</span> Logic Rules
             </h3>
             <ul className="text-xs text-indigo-700 space-y-2 leading-relaxed">
               <li>• Overrides AI decisions instantly.</li>
               <li>• Only one road stays GREEN.</li>
               <li>• System resets to AI when deactivated.</li>
             </ul>
          </div>
          
        </div>

      </div>
    </div>
  )
}

function AnalyticsView() {
  const { trafficHistory, mode, cycleTime, traffic } = useTrafficStore();
  
  const mostCongestedVal = Math.max(traffic.A, traffic.B, traffic.C, traffic.D);
  const mostCongestedRoad = traffic.A === mostCongestedVal ? 'A' : traffic.B === mostCongestedVal ? 'B' : traffic.C === mostCongestedVal ? 'C' : 'D';
  
  const totalTrafficSum = traffic.A + traffic.B + traffic.C + traffic.D;
  const avgWaitTime = mode === 'NORMAL' 
     ? Math.round(cycleTime / 4) 
     : Math.round(cycleTime * (mostCongestedVal / (totalTrafficSum || 1)));

  const roadData = [
    { name: 'Road A', load: traffic.A },
    { name: 'Road B', load: traffic.B },
    { name: 'Road C', load: traffic.C },
    { name: 'Road D', load: traffic.D },
  ];

  return (
    <div className="flex-1 w-full flex flex-col space-y-8">
      <div className="mb-2 w-full">
        <h2 className="text-2xl font-bold text-[#0A192F]">Traffic Analytics</h2>
        <p className="text-slate-500 text-sm mt-1">Data-driven insights and historical trends.</p>
      </div>

      {/* 1. TRAFFIC OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Peak Hour</span>
           <span className="text-2xl font-bold text-slate-800">6:00 PM</span>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Avg Daily Traffic</span>
           <span className="text-2xl font-bold text-slate-800">14,250</span>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Congestion Freq</span>
           <span className="text-2xl font-bold text-slate-800">12x / day</span>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Avg Wait Time</span>
           <span className="text-2xl font-bold text-slate-800">{avgWaitTime}s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
        
        {/* Main Charts Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           
           {/* 2. TRAFFIC TREND */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full">
             <h3 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-6">Traffic Trend (Live)</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trafficHistory}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dx={-10} domain={[0, 100]} />
                   <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Line type="monotone" dataKey="avg" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Avg Traffic %" />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
           
           {/* 3. ROAD-WISE ANALYSIS */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full">
             <h3 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-6">Road-Wise Load Details</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={roadData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} domain={[0, 100]} />
                   <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="load" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Traffic Load %" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

        </div>

        {/* 4. INSIGHTS PANEL */}
        <div className="flex flex-col gap-6">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
             <h3 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-6 flex items-center gap-2">
               <span>💡</span> Core Insights
             </h3>
             <ul className="space-y-4">
                <li className="flex flex-col border-l-2 border-indigo-200 pl-4 py-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Peak Congestion</span>
                  <span className="text-sm font-semibold text-slate-800">Evenings (17:00 - 19:30)</span>
                </li>
                <li className="flex flex-col border-l-2 border-rose-200 pl-4 py-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Most Congested Road</span>
                  <span className="text-sm font-semibold text-rose-600">Road {mostCongestedRoad} ({mostCongestedVal}%)</span>
                </li>
                <li className="flex flex-col border-l-2 border-emerald-200 pl-4 py-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Current Trend</span>
                  <span className="text-sm font-semibold text-emerald-600">{trafficHistory[trafficHistory.length - 1]?.avg > trafficHistory[0]?.avg ? 'Increasing' : 'Stable Flow'}</span>
                </li>
             </ul>
           </div>
           
           <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
             <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">AI Suggestion</span>
             <p className="text-sm font-bold text-indigo-900 leading-relaxed">
               Consider increasing default cycle wait time to 90s on Road {mostCongestedRoad} during peak hours to clear overflow.
             </p>
           </div>
        </div>

      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { mode, tick, traffic, cycleTime, selectedIntersection, setIntersection, systemHealth } = useTrafficStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      tick();
    }, 3000);
    return () => clearInterval(interval);
  }, [tick]); // mode is intrinsically handled by store

  const navItems = [
    { name: "Dashboard", href: "#", icon: "🧠" },
    { name: "Control", href: "#", icon: "⚙️" },
    { name: "Analytics", href: "#", icon: "📈" },
  ];

  if (!mounted) return null;

  // Derived calculations for Dashboard
  const totalLoad = Math.round((traffic.A + traffic.B + traffic.C + traffic.D) / 4);

  const roadsList = [
    { name: 'Road A', val: traffic.A },
    { name: 'Road B', val: traffic.B },
    { name: 'Road C', val: traffic.C },
    { name: 'Road D', val: traffic.D },
  ];
  
  const sortedRoads = [...roadsList].sort((a, b) => b.val - a.val);
  const mostCongestedRoad = sortedRoads[0];
  const totalTrafficSum = traffic.A + traffic.B + traffic.C + traffic.D;

  const avgWaitTime = mode === 'NORMAL' 
     ? Math.round(cycleTime / 4) 
     : Math.round(cycleTime * (mostCongestedRoad.val / (totalTrafficSum || 1)));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#0A192F] flex flex-col shadow-xl z-20 flex-shrink-0">
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
          <nav className="p-4 space-y-2 mt-4 flex-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.name
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className="text-xl opacity-80">{item.icon}</span>
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10 mt-auto shrink-0">
            <button
              onClick={() => router.push('/login')}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <span className="text-xl opacity-80">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              <span className="font-semibold text-sm tracking-wide">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-8 sm:px-12 flex-shrink-0 z-10 sticky top-0 bg-white/90 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-[#0A192F] tracking-tight">{activeTab}</h1>
          {/* Intersection Selector */}
          <div className="flex items-center gap-3">
             <label className="text-sm font-semibold text-slate-500 hidden sm:block">Location</label>
             <select 
               value={selectedIntersection}
               onChange={(e) => setIntersection(e.target.value)}
               className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none font-medium shadow-sm cursor-pointer transition-colors"
             >
                <option value="Vijay Nagar">Vijay Nagar</option>
                <option value="Palasia">Palasia</option>
                <option value="Bhanwar Kuan">Bhanwar Kuan</option>
             </select>
          </div>
        </header>

        <div className={`p-8 sm:p-12 flex-1 max-w-6xl w-full mx-auto flex flex-col ${activeTab === 'Dashboard' ? 'space-y-10' : ''}`}>
          
          {activeTab === 'Dashboard' && (
            <>
              {/* 1. LIVE SYSTEM STATUS */}
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Live System Status
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Mode</span>
                    <span className={`text-2xl font-bold transition-colors ${mode === 'AI' ? 'text-indigo-600' : 'text-slate-700'}`}>{mode}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Traffic Load</span>
                    <span className="text-2xl font-bold text-slate-800 transition-all">{totalLoad}%</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Intersection</span>
                    <span className="text-xl font-bold text-slate-800 truncate transition-all pt-0.5">{selectedIntersection}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">System Health</span>
                    <span className={`text-2xl font-bold transition-colors ${systemHealth === 'GOOD' ? 'text-emerald-500' : systemHealth === 'WARNING' ? 'text-amber-500' : 'text-rose-500'}`}>{systemHealth}</span>
                  </div>
                </div>
              </section>

              {/* 2. REAL-TIME TRAFFIC SUMMARY */}
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[#0A192F] font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  Real-Time Traffic Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center space-y-5">
                      {roadsList.map(road => (
                        <div key={road.name} className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-600 w-16">{road.name}</span>
                          <div className="flex-1 mx-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ease-in-out ${road.val >= 80 ? 'bg-rose-500' : road.val >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${road.val}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-slate-800 w-10 text-right">{road.val}%</span>
                        </div>
                      ))}
                   </div>

                   <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center gap-6">
                     <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Most Congested</span>
                       <div className="flex items-center gap-3">
                         <span className="text-2xl font-bold text-rose-600">{mostCongestedRoad.name}</span>
                         <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded transition-all">({mostCongestedRoad.val}%)</span>
                       </div>
                     </div>
                     
                     <div className="border-t border-slate-100 pt-6">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Avg Wait Time</span>
                       <div className="flex items-center gap-3">
                         <span className="text-3xl font-bold text-slate-800 transition-all">{avgWaitTime}s</span>
                         <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">PREDICTED</span>
                       </div>
                     </div>
                   </div>
                </div>
              </section>

              {/* MAIN ACTION */}
              <section className="pt-6 pb-12 flex justify-center mt-auto">
                <button
                  onClick={() => router.push('/simulation')}
                  className="group px-10 py-4 bg-[#0A192F] hover:bg-[#11294F] transition-all rounded-xl font-bold shadow-md active:scale-95 text-white flex items-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="text-xl relative z-10">🚀</span>
                  <span className="text-lg tracking-wide relative z-10">Run Live Simulation</span>
                </button>
              </section>
            </>
          )}

          {activeTab === 'Control' && (
            <div className="flex-1 flex items-center justify-center py-10 w-full">
              <ControlView />
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="flex-1 flex items-start justify-center py-4 w-full">
              <AnalyticsView />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
