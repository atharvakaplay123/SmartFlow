'use client';

import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const congestionData = [
  { hour: '6AM', congestion: 20 },
  { hour: '8AM', congestion: 85 },
  { hour: '10AM', congestion: 35 },
  { hour: '12PM', congestion: 40 },
  { hour: '2PM', congestion: 30 },
  { hour: '4PM', congestion: 55 },
  { hour: '6PM', congestion: 80 },
  { hour: '8PM', congestion: 45 },
];

export const ChartBar = () => {
  const highestCongestion = Math.max(...congestionData.map(d => d.congestion));

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full w-full">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Peak Congestion Hours</h3>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={congestionData} margin={{ top: 15, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} 
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="congestion" radius={[6, 6, 0, 0]} isAnimationActive={false} label={{ position: 'top', fill: '#64748b', fontSize: 11, fontWeight: 600 }}>
              {congestionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.congestion === highestCongestion ? '#1d4ed8' : '#3b82f6'} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
