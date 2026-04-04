"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // POST request to your authentication endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/admin-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        setLoading(false);
        // Assuming successful login, redirect. Change to /admin if needed.
        router.push("/admin");
      } else {
        setLoading(false);
        const errorText = await response.text();
        console.error("Authentication failed. Server responded with:", errorText);
        // Typical Postman Mock Error: mockRequestNotFoundError
      }
    } catch (error) {
      setLoading(false);
      console.error("Network error during login", error);
    }
  };

  const handleChange = (field: string) => (e: { target: { value: any; }; }) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <>
      <style>{`
        .page-bg {
          background: radial-gradient(circle at left, #0F172A 0%, #1E293B 40%, #334155 70%, #F8FAFC 100%);
        }
        .left-panel-custom {
          flex: 1;
          position: relative;
          padding: 60px;
          color: white;
          background: transparent;
        }
        .left-panel-custom::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(56,189,248,0.25), transparent);
          filter: blur(100px);
          z-index: 0;
        }
        .left-panel-custom::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.02), transparent);
        }
        .heading-gradient {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          background: linear-gradient(135deg, #38BDF8, #2563EB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 2rem;
        }
        .logo-custom {
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 5rem;
        }
        .logo-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(to bottom right, #2563EB, #06b6d4);
        }
        .input-icon {
          color: #2563EB;
          font-size: 18px;
          opacity: 0.9;
        }
        .login-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          padding: 40px;
          width: 100%;
          max-width: 28rem;
          position: relative;
          z-index: 10;
        }
        .submit-btn {
          background: linear-gradient(135deg, #2563EB, #38BDF8);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(37,99,235,0.4);
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(37,99,235,0.5);
        }
      `}</style>
      <div className="flex min-h-screen h-screen overflow-hidden page-bg font-sans">
        {/* ── LEFT PANEL: Branding & Features ── */}
        <div className="hidden lg:flex left-panel-custom overflow-hidden">
          <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col justify-center h-full">
            {/* Logo */}
            <div className="logo-custom">
              <div className="logo-icon shadow-xl shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white tracking-widest uppercase">SmartFlow</span>
            </div>

            <h1 className="heading-gradient">
              AI-Powered <br />
              Traffic Intelligence
            </h1>
          </div>
        </div>

        {/* ── RIGHT PANEL: Login Form ── */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="login-card">

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold tracking-wide uppercase mb-6 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Secure Access
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Administrator Login</h2>
            <p className="text-slate-500 text-sm">Sign in with your SmartFlow credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email / Admin ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="input-icon w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="admin@smartflow.ai"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="input-icon w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login Securely
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">© 2026 SmartFlow AI</span>
            <div className="flex items-center gap-1.5 opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">Systems Operational</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
