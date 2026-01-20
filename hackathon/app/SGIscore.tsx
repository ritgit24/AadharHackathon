"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, ReferenceLine, Label 
} from 'recharts';
import { ShieldAlert, Info, TrendingUp } from 'lucide-react';

interface SGIProps {
  data: {
    state: string;
    sgiScore?: number;
  }[];
}

export default function SGIGraphComponent({ data }: SGIProps) {
  const chartData = [...data]
    .map(item => ({
      ...item,
      displayScore: item.sgiScore ?? 0 
    }))
    .filter(item => item.displayScore > 0)
    .sort((a, b) => a.displayScore - b.displayScore);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="text-red-400" size={24} />
          Service Gap Index (SGI) - Active States
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Showing states with active infrastructure gaps. <span className="text-red-400 font-bold">Priority threshold: 25</span>.
        </p>
      </div>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, bottom: 120, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="state" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              angle={-90} 
              textAnchor="end"
              interval={0} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              label={{ value: 'SGI Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              cursor={{ fill: 'white', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569', 
                borderRadius: '8px'
              }} 
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
            />
            
            <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2}>
              <Label 
                value="PRIORITY GAP" 
                position="top" 
                fill="#ef4444" 
                fontSize={10} 
                fontWeight="bold"
              />
            </ReferenceLine>

            <Bar dataKey="displayScore" name="SGI Score" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.displayScore < 25 ? '#ef4444' : '#3b82f6'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
          <Info size={18} className="text-blue-400 mt-1 shrink-0" />
          <p className="text-xs text-slate-400">
            <span className="text-white font-semibold">Clean View:</span> States with their SGI scores have been shown in this analysis.
          </p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
          <TrendingUp size={18} className="text-emerald-400 mt-1 shrink-0" />
          <p className="text-xs text-slate-400">
            <span className="text-white font-semibold">Goal:</span> Elevate all active states above the 25-point threshold.
          </p>
        </div>
      </div>
    </div>
  );
}