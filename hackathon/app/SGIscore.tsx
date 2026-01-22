"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { ShieldAlert, Info, TrendingUp } from 'lucide-react';

// Data as per written in the submission DOC
const HARDCODED_SGI_DATA = [
  { state: "Delhi", sgiScore: 76.7 },
  { state: "Chhattisgarh", sgiScore: 73.0 },
  { state: "Maharashtra", sgiScore: 72.6 },
  { state: "Chandigarh", sgiScore: 64.3 },
  { state: "Manipur", sgiScore: 63.9 },
  { state: "Andhra Pradesh", sgiScore: 61.8 },
  { state: "Madhya Pradesh", sgiScore: 57.8 },
  { state: "Haryana", sgiScore: 54.8 },
  { state: "Tamil Nadu", sgiScore: 54.5 },
  { state: "Uttarakhand", sgiScore: 54.2 },
  { state: "Mizoram", sgiScore: 53.4 },
  { state: "Rajasthan", sgiScore: 48.3 },
  { state: "Tripura", sgiScore: 48.2 },
  { state: "Uttar Pradesh", sgiScore: 46.8 },
  { state: "Punjab", sgiScore: 46.4 },
  { state: "Telangana", sgiScore: 46.4 },
  { state: "Bihar", sgiScore: 46.0 },
  { state: "Jharkhand", sgiScore: 44.5 },
  { state: "Kerala", sgiScore: 44.0 },
  { state: "Jammu and Kashmir", sgiScore: 43.7 },
  { state: "Gujarat", sgiScore: 43.6 },
  { state: "Lakshadweep", sgiScore: 43.5 },
  { state: "Odisha", sgiScore: 41.4 },
  { state: "DNH and Daman Diu", sgiScore: 41.0 },
  { state: "Himachal Pradesh", sgiScore: 39.8 },
  { state: "West Bengal", sgiScore: 39.0 },
  { state: "Karnataka", sgiScore: 37.8 },
  { state: "Puducherry", sgiScore: 35.3 },
  { state: "Andaman and Nicobar Islands", sgiScore: 33.5 },
  { state: "Goa", sgiScore: 31.5 },
  { state: "Assam", sgiScore: 29.4 },
  { state: "Sikkim", sgiScore: 21.9 },
  { state: "Arunachal Pradesh", sgiScore: 20.5 },
  { state: "Ladakh", sgiScore: 20.0 },
  { state: "Meghalaya", sgiScore: 18.4 },
  { state: "Nagaland", sgiScore: 17.4 }
];


const getBarColor = (score: number) => {
  if (score > 70) return '#74c476'; 
  if (score > 60) return '#a1d99b'; 
  if (score > 50) return '#c7e9c0'; 
  if (score > 45) return '#ffffcc'; 
  if (score > 35) return '#fed976';
  if (score > 25) return '#feb24c';
  return '#f03b20';
};

export default function SGIGraphComponent() {

  const chartData = [...HARDCODED_SGI_DATA].sort((a, b) => b.sgiScore - a.sgiScore);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="text-emerald-400" size={24} />
          Aadhaar Service Gap Index by State
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          (Identifies regions needing infrastructure improvements)
        </p>
      </div>

      <div className="h-[800px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 40, bottom: 20, left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              stroke="#94a3b8" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="state" 
              type="category" 
              stroke="#94a3b8" 
              fontSize={11} 
              width={120}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: '#334155', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569', 
                borderRadius: '8px',
                color: '#fff'
              }} 
                 itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
            />
            
            {/* Red Median Threshold Line */}
            <ReferenceLine x={50} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} />

            <Bar dataKey="sgiScore" radius={[0, 4, 4, 0]} barSize={15}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.sgiScore)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-center text-xs text-slate-500 border-t border-slate-700 pt-4">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#f03b20] rounded-sm"></div>
            <span>Underserved (SGI &lt; 25)</span>
        </div>
        <span>Service Gap Index (0 = Underserved, 100 = Best Served)</span>
      </div>
    </div>
  );
}