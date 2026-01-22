"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, ComposedChart, Line } from 'recharts';
import { Users, RefreshCw, MapPin, Database, TrendingUp, Baby, Lightbulb, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import SGIGraphComponent from './SGIscore';

interface AadhaarData {
  state: string;
  age_0_5: number;
  age_5_17: number;
  age_18_greater: number;
  demo_age_5_17: number;
  demo_age_17_: number;
  sgiScore?: number; 
}

export default function AadhaarDashboard() {
  const [data, setData] = useState<AadhaarData[]>([]);
  const [loading, setLoading] = useState(true);

 

 useEffect(() => {
  fetch('/summary.json')
    .then(res => res.json())
    .then((json: AadhaarData[]) => {
      const stateMap = json.reduce((acc: any, curr) => {

        let stateName = curr.state ? curr.state.trim() : "Unknown";


        if (/^\d+$/.test(stateName) || stateName === "") {
          return acc;
        }


        if (!acc[stateName]) {
          acc[stateName] = { 
            state: stateName, 
            age_0_5: 0, 
            age_5_17: 0, 
            age_18_greater: 0, 
            demo_age_5_17: 0, 
            demo_age_17_: 0,
            totalActivity: 0 
          };
        }


        const activity = (curr.age_0_5 || 0) + (curr.age_5_17 || 0) + (curr.age_18_greater || 0) + (curr.demo_age_5_17 || 0) + (curr.demo_age_17_ || 0);
        
        acc[stateName].age_0_5 += (curr.age_0_5 || 0);
        acc[stateName].age_5_17 += (curr.age_5_17 || 0);
        acc[stateName].age_18_greater += (curr.age_18_greater || 0);
        acc[stateName].demo_age_5_17 += (curr.demo_age_5_17 || 0);
        acc[stateName].demo_age_17_ += (curr.demo_age_17_ || 0);
        acc[stateName].totalActivity += activity;

        return acc;
      }, {});


      const consolidatedArray = Object.values(stateMap) as any[];


      const maxActivity = Math.max(...consolidatedArray.map(s => s.totalActivity), 1);
      
      const finalData = consolidatedArray
        .map(s => ({
          ...s,
          sgiScore: Math.round((s.totalActivity / maxActivity) * 100)
        }))
       
        .filter(s => s.totalActivity > 0) 
        .sort((a, b) => a.sgiScore - b.sgiScore);

      setData(finalData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to load Aadhaar data:", err);
      setLoading(false);
    });
}, []);
  if (loading) return <div className="flex h-screen items-center justify-center font-mono bg-slate-900 text-white">Loading Intelligence Data...</div>;

  const totalEnrolments = data.reduce((acc, curr) => acc + curr.age_0_5 + curr.age_5_17 + curr.age_18_greater, 0);
  const totalUpdates = data.reduce((acc, curr) => acc + curr.demo_age_5_17 + curr.demo_age_17_, 0);
  const childEnrolments = data.reduce((acc, curr) => acc + curr.age_0_5 + curr.age_5_17, 0);
  const childPercentage = ((childEnrolments / totalEnrolments) * 100).toFixed(1);
  const maintenanceRatio = (totalUpdates / totalEnrolments).toFixed(0);

  const ageDistData = [
    { name: 'Infants (0-5)', value: data.reduce((acc, curr) => acc + curr.age_0_5, 0), color: '#3b82f6' },
    { name: 'Youth (5-17)', value: data.reduce((acc, curr) => acc + curr.age_5_17, 0), color: '#8b5cf6' },
    { name: 'Adults (18+)', value: data.reduce((acc, curr) => acc + curr.age_18_greater, 0), color: '#ec4899' },
  ];

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Database className="text-blue-500" /> Aadhaar Intelligence Portal
          </h1>
          <p className="text-slate-400 mt-1">Infrastructure Gap Analysis & Strategic Insights</p>
        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users size={20}/></div>
            <span className="text-slate-400 font-medium text-sm">Total Enrolments</span>
          </div>
          <p className="text-3xl font-bold">7.8 Million</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><RefreshCw size={20}/></div>
            <span className="text-slate-400 font-medium text-sm">Total Updates</span>
          </div>
          <p className="text-3xl font-bold">116.7 Million</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500"><Baby size={20}/></div>
            <span className="text-slate-400 font-medium text-sm">Child Enrolment %</span>
          </div>
          <p className="text-3xl font-bold">65.3%</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><TrendingUp size={20}/></div>
            <span className="text-slate-400 font-medium text-sm">Total Activity</span>
          </div>
          <p className="text-3xl font-bold">124.5 Million</p>
        </div>
      </div>

      {/* ANALYSIS HIGHLIGHTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-slate-800 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={24} /> 
            Critical Service Gaps Identified
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-xl">
              <div className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white uppercase block mb-1">Saturation Point Reached</span>
                Adult enrolment (18+) has dropped to <span className="text-red-400 font-bold">1.3%</span> nationally, shifting the burden from new ASK centers to update-only kiosks.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={22} /> Interesting Stats
            </h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span>Top State Activity</span>
                <span className="text-white font-mono font-bold">Uttar Pradesh</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span>Underperforming Districts</span>
                <span className="text-red-400 font-mono font-bold">13 Count</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span>Priority States (SGI &lt; 25)</span>
                <span className="text-white font-mono font-bold">5 identified</span>
              </li>
            </ul>
        </div>
      </div>

      

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
    <h2 className="text-xl font-bold mb-6">Top 8 States by Total Activity</h2>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
         
          data={[...data]
            .sort((a, b) => {
              const totalA = a.age_0_5 + a.age_5_17 + a.age_18_greater + a.demo_age_5_17 + a.demo_age_17_;
              const totalB = b.age_0_5 + b.age_5_17 + b.age_18_greater + b.demo_age_5_17 + b.demo_age_17_;
              return totalB - totalA;
            })
            .slice(0, 8)
          }
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="state" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            interval={0} 
            angle={-30} 
            textAnchor="end" 
            height={60}
          />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #475569', 
              borderRadius: '8px' 
            }} 
          />
          <Legend />
          {/* New Enrolments */}
          <Bar dataKey="age_0_5" fill="#3b82f6" name="Infant Enrolments" radius={[4, 4, 0, 0]} />
          {/* Adult Updates */}
          <Bar dataKey="demo_age_17_" fill="#8b5cf6" name="Adult Updates" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-6">National Age Demographics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ageDistData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {ageDistData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STRATEGIC SOLUTIONS SECTION */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Strategic Solution Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 border-t-4 border-blue-500 p-6 rounded-xl shadow-lg">
            <div className="bg-blue-500/10 w-fit p-3 rounded-lg mb-4 text-blue-500"><CheckCircle size={24}/></div>
            <h3 className="font-bold mb-2">Mobile Van Deployment</h3>
            <p className="text-sm text-slate-400">Targeting districts with SGI &lt; 25 to provide doorstep enrolment for infants (0-5 age group).</p>
          </div>
          <div className="bg-slate-800 border-t-4 border-emerald-500 p-6 rounded-xl shadow-lg">
            <div className="bg-emerald-500/10 w-fit p-3 rounded-lg mb-4 text-emerald-500"><RefreshCw size={24}/></div>
            <h3 className="font-bold mb-2">Update-Only Kiosks</h3>
            <p className="text-sm text-slate-400">Decoupling updates from enrolments in urban hubs like Maharashtra to reduce wait times by 40%.</p>
          </div>
          <div className="bg-slate-800 border-t-4 border-purple-500 p-6 rounded-xl shadow-lg">
            <div className="bg-purple-500/10 w-fit p-3 rounded-lg mb-4 text-purple-500"><MapPin size={24}/></div>
            <h3 className="font-bold mb-2">Infrastructure Redesign</h3>
            <p className="text-sm text-slate-400">Repurposing underutilized enrolment stations in saturated states into high-capacity update centers.</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
     {/* Data Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden mb-10">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Full State Data</h2>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-800 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4 text-center">New Enrolments</th>
                <th className="px-6 py-4 text-center">Updates</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.map((row, i) => {
                const rowEnrol = row.age_0_5 + row.age_5_17 + row.age_18_greater;
                const rowDemo = row.demo_age_5_17 + row.demo_age_17_;
                return (
                  <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.state}</td>
                    <td className="px-6 py-4 text-center text-blue-400 font-mono">{rowEnrol.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-emerald-400 font-mono">{rowDemo.toLocaleString()}</td>
                  
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-10">
         <SGIGraphComponent  />
       </div>
    </main>
  );
}