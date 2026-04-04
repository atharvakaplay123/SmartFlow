'use client';

import React from 'react';
import { LineChart as RechartsLineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

const efficiencyData = [
  { day: 'Mon', efficiency: 85 },
  { day: 'Tue', efficiency: 87 },
  { day: 'Wed', efficiency: 86 },
  { day: 'Thu', efficiency: 89 },
  { day: 'Fri', efficiency: 88 },
  { day: 'Sat', efficiency: 91 },
  { day: 'Sun', efficiency: 92.4 }
];

export const EfficiencyCard = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full justify-between w-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-4">System Efficiency Trend</h3>
        <div className="text-2xl font-bold text-emerald-600 mb-1">92.4%</div>
        <div className="text-sm text-slate-500 mb-2">Consistent upward trend</div>
      </div>
      <div className="h-32 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={efficiencyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Tooltip 
              contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '11px', padding: '4px 8px' }} 
            />
            <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
