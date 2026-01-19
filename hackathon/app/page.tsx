"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, RefreshCw, MapPin, Database } from 'lucide-react';
// ... other imports

// 1. Define the structure of your data
interface AadhaarData {
  state: string;
  age_0_5: number;
  age_5_17: number;
  age_18_greater: number;
  demo_age_5_17: number;
  demo_age_17_: number;
}

export default function AadhaarDashboard() {
  // 2. Tell useState to expect an array of AadhaarData
  const [data, setData] = useState<AadhaarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/summary.json')
      .then(res => res.json())
      .then((json: AadhaarData[]) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-mono bg-slate-900 text-white">Loading...</div>;

  // Now TypeScript knows exactly what 'curr' is!
  const totalEnrolments = data.reduce((acc, curr) => 
    acc + curr.age_0_5 + curr.age_5_17 + curr.age_18_greater, 0
  );

  const totalUpdates = data.reduce((acc, curr) => 
    acc + curr.demo_age_5_17 + curr.demo_age_17_, 0
  );

  // ... rest of your component

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Database className="text-blue-500" /> Aadhaar Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Multi-source CSV Data Aggregation Engine</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-sm font-mono text-emerald-400">
          Status: Live Connection to summary.json
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users size={24}/></div>
            <span className="text-slate-400 font-medium">Total New Enrolments</span>
          </div>
          <p className="text-4xl font-bold">{totalEnrolments.toLocaleString()}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><RefreshCw size={24}/></div>
            <span className="text-slate-400 font-medium">Demographic Updates</span>
          </div>
          <p className="text-4xl font-bold">{totalUpdates.toLocaleString()}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><MapPin size={24}/></div>
            <span className="text-slate-400 font-medium">States Tracked</span>
          </div>
          <p className="text-4xl font-bold">{data.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Enrolment Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-6">New Enrolments by State (Top 8)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <Bar dataKey="age_0_5" fill="#3b82f6" name="Kids (0-5)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="age_18_greater" fill="#8b5cf6" name="Adults (18+)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Updates Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">State-wise Data Breakdown</h2>
          </div>
          <div className="overflow-x-auto h-[320px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">State</th>
                  <th className="px-6 py-4">New Enrolments</th>
                  <th className="px-6 py-4">Demo Updates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data.map((row: any, i) => (
                  <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.state}</td>
                    <td className="px-6 py-4 text-blue-400 font-mono">{(row.age_0_5 + row.age_5_17 + row.age_18_greater).toLocaleString()}</td>
                    <td className="px-6 py-4 text-emerald-400 font-mono">{(row.demo_age_5_17 + row.demo_age_17_).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}