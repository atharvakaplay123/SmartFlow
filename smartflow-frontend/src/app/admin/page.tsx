"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const navItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Control", icon: "🚦" },
    { name: "Analytics", icon: "📈" },
    { name: "Alerts", icon: "🚨" },
    { name: "Profile", icon: "👤" },
  ];

  const handleLogout = () => {
    // Basic logout logic
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between shadow-xl z-20 flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-wide uppercase">SmartFlow</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.name
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 sm:px-12 flex-shrink-0 z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        </header>

        {/* Content Area */}
        <div className="p-8 sm:p-12 flex-1">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                🚦
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Active Signals</p>
                <h3 className="text-2xl font-bold text-slate-800">142</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                🚗
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Traffic Load</p>
                <h3 className="text-2xl font-bold text-slate-800">High</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl">
                🤖
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">AI Status</p>
                <h3 className="text-2xl font-bold text-green-600">Optimal</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
                🚨
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Alerts</p>
                <h3 className="text-2xl font-bold text-red-600">3</h3>
              </div>
            </div>

          </div>

          {/* Placeholder for future content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-400 mb-2">Content area for {activeTab}</p>
              <p className="text-sm text-slate-500">Ready for future features to be implemented.</p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
