'use client';

import React from 'react';

const colorStyles: Record<string, { strip: string; icon: string }> = {
  blue: { strip: 'bg-blue-500', icon: 'text-blue-600 bg-blue-50' },
  amber: { strip: 'bg-amber-500', icon: 'text-amber-600 bg-amber-50' },
  green: { strip: 'bg-emerald-500', icon: 'text-emerald-600 bg-emerald-50' },
};

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  trendValue: string;
  trend: 'up' | 'down';
  stripColor: 'blue' | 'amber' | 'green';
}

export const StatCard = ({ title, value, subtext, icon, trendValue, trend, stripColor }: StatCardProps) => {
  const styles = colorStyles[stripColor] || colorStyles.blue;
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${styles.strip}`}></div>
      <div className="flex justify-between items-start mb-6 mt-1">
        <div>
          <div className="text-2xl font-bold text-slate-900 leading-tight mb-1">{value}</div>
          <div className="text-sm text-slate-500">{title}</div>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${styles.icon}`}>
          {icon}
        </div>
      </div>
      <div className="text-sm mt-auto flex items-center gap-1.5 break-words">
        <span className={trend === 'up' ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </span>
        <span className="text-slate-500">{subtext}</span>
      </div>
    </div>
  );
};
