'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
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

  // User State
  const [user] = useState({
    name: 'Admin User',
    email: 'admin@smartflow.city',
    initial: 'A',
    department: 'Traffic Control',
    lastLogin: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    deviceCount: 2
  });

  // Toggles State
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [prefs, setPrefs] = useState({
    darkMode: false,
    notifications: true,
    autoAI: true,
    emailAlerts: false,
    emergencyAlerts: true,
    liveSync: true
  });

  const [mounted, setMounted] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  React.useEffect(() => {
    // Debug: Log user state and route
    console.log("[Profile] Current Route: /profile");
    console.log("[Profile] Loaded User State:", user);
    
    setMounted(true);
    
    // Fix auth check: Do not redirect before user state is loaded
    // Use loading check before redirect
    const checkUserSession = () => {
      // Allow access if user exists
      if (user) {
         setIsLoadingAuth(false);
      } else {
         // Only redirect AFTER checking user properly
         console.warn("[Profile] No active user state found, falling back to login.");
         router.push('/login');
      }
    };
    
    // Simulating checking auth safely without false immediate redirects
    const timer = setTimeout(checkUserSession, 150);
    return () => clearTimeout(timer);
  }, [user, router]);

  const handlePrefToggle = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  // Prevent false redirects via a safe loading block before full mount
  if (!mounted || isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A192F]">
         <div className="flex items-center gap-3 text-white">
           <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <span className="font-semibold tracking-wide">Loading Profile State...</span>
         </div>
      </div>
    );
  }

  const ToggleSwitch = ({ label, enabled, onChange }: { label: string, enabled: boolean, onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <button 
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#0A192F] flex flex-col shadow-xl z-20 flex-shrink-0 relative h-screen">
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
              const isActive = item.name === "Profile";
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
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-8 sm:px-12 flex-shrink-0 sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm">
          <div>
             <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 mb-1">ADMINISTRATOR</div>
             <h1 className="text-2xl font-bold text-[#0A192F] tracking-tight">Profile & Preferences</h1>
          </div>
        </header>

        <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col p-8 sm:p-12 space-y-8">
           
           {/* Info Strip (Badges) */}
           <div className="flex flex-wrap gap-4 items-center">
             <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#0A192F] text-white shadow-sm flex items-center gap-2">
               <span>👤</span> Administrator
             </div>
             <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Server Online
             </div>
             <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span> System Active
             </div>
             <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm flex items-center gap-2">
               <span>⚡</span> SmartFlow Core
             </div>
           </div>

           {/* Top Grid: Profile Info & Security */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* SECTION 1: PROFILE INFO */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-sm uppercase tracking-widest text-[#0A192F] font-bold">Profile Info</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-5 mb-8">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/30">
                        {user.initial}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0A192F]">{user.name}</h3>
                        <p className="text-slate-500 text-sm font-medium mt-0.5">{user.email}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500 font-semibold">Name</span>
                        <span className="text-sm font-bold text-slate-800">{user.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500 font-semibold">Email</span>
                        <span className="text-sm font-bold text-slate-800">{user.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500 font-semibold">Department</span>
                        <span className="text-sm font-bold text-slate-800">{user.department}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-500 font-semibold">Status</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shadow-sm border border-emerald-100">
                          Active
                        </span>
                      </div>
                   </div>
                </div>
              </section>

              {/* SECTION 2: SECURITY */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-sm uppercase tracking-widest text-[#0A192F] font-bold">Security</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                   <div className="space-y-4 mb-8">
                     <ToggleSwitch label="Two-Factor Authentication (2FA)" enabled={tfaEnabled} onChange={() => setTfaEnabled(!tfaEnabled)} />
                     
                     <div className="pt-4 space-y-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Login</span>
                             <span className="text-sm font-bold text-slate-700">{user.lastLogin}</span>
                          </div>
                          <span className="text-xl">🕒</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Device Info</span>
                             <span className="text-sm font-bold text-slate-700">{user.deviceCount} Active Sessions</span>
                          </div>
                          <span className="text-xl">💻</span>
                        </div>
                     </div>
                   </div>

                   <div className="flex gap-3 mt-auto">
                     <button className="flex-1 py-3 px-4 bg-[#0A192F] text-white text-sm font-bold rounded-xl hover:bg-[#11294F] shadow-sm transition-colors active:scale-95">
                       Change Password
                     </button>
                     <button className="flex-1 py-3 px-4 bg-white text-slate-700 border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-colors active:scale-95">
                       Manage Sessions
                     </button>
                   </div>
                </div>
              </section>
           </div>

           {/* SECTION 3: SYSTEM PREFERENCES */}
           <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm uppercase tracking-widest text-[#0A192F] font-bold">System Preferences</h2>
             </div>
             <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  <div className="space-y-1">
                    <ToggleSwitch label="Dark Mode Interface" enabled={prefs.darkMode} onChange={() => handlePrefToggle('darkMode')} />
                    <ToggleSwitch label="Push Notifications" enabled={prefs.notifications} onChange={() => handlePrefToggle('notifications')} />
                    <ToggleSwitch label="Auto AI Optimization" enabled={prefs.autoAI} onChange={() => handlePrefToggle('autoAI')} />
                  </div>
                  <div className="space-y-1">
                    <ToggleSwitch label="Email Alerts" enabled={prefs.emailAlerts} onChange={() => handlePrefToggle('emailAlerts')} />
                    <ToggleSwitch label="Emergency Event Alerts" enabled={prefs.emergencyAlerts} onChange={() => handlePrefToggle('emergencyAlerts')} />
                    <ToggleSwitch label="Live Data Sync" enabled={prefs.liveSync} onChange={() => handlePrefToggle('liveSync')} />
                  </div>
                </div>
             </div>
           </section>

           {/* SECTION 4: SYSTEM INFO */}
           <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm uppercase tracking-widest text-[#0A192F] font-bold">System Info</h2>
             </div>
             <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">System Version</span>
                    <span className="text-sm font-bold text-slate-800">SmartFlow v3.4.1</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">AI Engine</span>
                    <span className="text-sm font-bold text-indigo-600">Nexus Core Active</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Server Status</span>
                    <div>
                      <span className="inline-flex text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded uppercase tracking-wider items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">City Mode</span>
                    <span className="text-sm font-bold text-slate-800">Standard Flow</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Sync</span>
                    <span className="text-sm font-bold text-slate-800">Just now</span>
                  </div>

                </div>
             </div>
           </section>

           <div className="pb-10"></div> {/* Bottom padding */}
        </div>
      </main>
    </div>
  );
}
