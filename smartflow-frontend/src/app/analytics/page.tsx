'use client';

import React from 'react';
import { FaRegClock, FaCar, FaCheckCircle, FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { StatCard } from '@/components/analytics/StatCard';
import { ChartArea } from '@/components/analytics/ChartArea';
import { EfficiencyCard } from '@/components/analytics/EfficiencyCard';
import { ChartBar } from '@/components/analytics/ChartBar';
import { ChartPie } from '@/components/analytics/ChartPie';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-y-auto h-full p-8 md:p-10 bg-slate-100 relative z-10 w-full min-h-screen">
      
      {/* 1. Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-slate-500 mb-1">INSIGHTS</div>
          <h1 className="text-xl font-bold text-slate-900">Network Analytics</h1>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-sm shadow-slate-200/50">
            Last 24 hours
          </span>
        </div>
      </header>

      {/* 2. KPI ROW */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <StatCard
          title="Avg Daily Traffic"
          value="2,847"
          trendValue="12%"
          trend="up"
          subtext="vs last week"
          icon={<FaCar size={20} />}
          stripColor="blue"
        />
        <StatCard
          title="Peak Traffic Hour"
          value="8–9 AM"
          trendValue="85%"
          trend="up"
          subtext="density level"
          icon={<FaRegClock size={20} />}
          stripColor="amber"
        />
        <StatCard
          title="AI Optimization Success"
          value="94.2%"
          trendValue="3.5%"
          trend="up"
          subtext="improvement"
          icon={<FaCheckCircle size={20} />}
          stripColor="green"
        />
      </div>

      {/* 3. MAIN GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-6 items-stretch">
        <div className="lg:col-span-2 min-h-[350px]">
          <ChartArea />
        </div>
        <div className="lg:col-span-1 min-h-[350px]">
          <EfficiencyCard />
        </div>
      </div>

      {/* 4. BOTTOM GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-stretch pb-10">
        
        {/* A. Bar Chart */}
        <div className="min-h-[300px]">
          <ChartBar />
        </div>

        {/* B. Pie Chart */}
        <div className="min-h-[300px]">
          <ChartPie />
        </div>

        {/* C. Comparison Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full min-h-[300px]">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Before vs After AI</h3>
          
          <div className="flex items-center justify-between mb-auto mt-4 px-2">
            
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Without AI</div>
              <div className="flex items-center text-3xl font-bold text-rose-500">
                <FaRegClock size={20} className="mr-2 opacity-80" />
                14 <span className="text-base font-semibold text-rose-400 ml-1">min</span>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
              <FaArrowRight size={18} className="text-slate-400" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">With AI</div>
              <div className="flex items-center text-3xl font-bold text-emerald-500">
                <FaRegClock size={20} className="mr-2 opacity-80" />
                6 <span className="text-base font-semibold text-emerald-400 ml-1">min</span>
              </div>
            </div>

          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-50">
            <span className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 py-2.5 rounded-lg border border-emerald-100">
              <FaArrowDown size={14} /> 57% average delay reduction
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
