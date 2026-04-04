'use client';

import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trafficData = [
  { time: '06:00', density: 25 },
  { time: '08:00', density: 85 },
  { time: '10:00', density: 45 },
  { time: '12:00', density: 50 },
  { time: '14:00', density: 40 },
  { time: '16:00', density: 65 },
  { time: '18:00', density: 80 },
  { time: '20:00', density: 55 },
  { time: '22:00', density: 30 }
];

export const ChartArea = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full w-full">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Traffic Density Over Time</h3>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} 
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} isAnimationActive={false} />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
