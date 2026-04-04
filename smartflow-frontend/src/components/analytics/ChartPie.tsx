'use client';

import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const pieData = [
  { name: 'Road A (Main)', value: 40, fill: '#3b82f6' },
  { name: 'Road B (East)', value: 25, fill: '#14b8a6' },
  { name: 'Road C (West)', value: 20, fill: '#8b5cf6' },
  { name: 'Road D (North)', value: 15, fill: '#f97316' },
];

export const ChartPie = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full w-full">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Traffic Distribution</h3>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
              label={({ cx, cy, midAngle = 0, innerRadius, outerRadius, percent = 0 }: any) => {
                const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
                const x = Number(cx) + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = Number(cy) + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="600">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
            <Legend 
              verticalAlign="bottom" 
              content={(props) => {
                const { payload } = props;
                return (
                  <ul className="list-none p-0 m-0 flex flex-wrap justify-center gap-4 text-[11px] font-semibold text-slate-500 pt-4">
                    {payload?.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
