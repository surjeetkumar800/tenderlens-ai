import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Users, FileText, CheckCircle, AlertTriangle, Loader2, Database, BarChart, PieChart } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Green, Amber, Red

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch analytics", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        <p className="text-slate-500 font-medium">Aggregating AI insights from database...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-red-700">Analytics Error</h3>
        <p className="text-red-500 mt-2 mb-6">Failed to load real-time analytics from the database.</p>
      </div>
    );
  }

  // Check if we have any actual data to show
  const hasData = data.totalBidders > 0;

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border pb-6 gap-4">
        <div>
          <h2 className="dashboard-title flex items-center gap-2 md:gap-3 text-2xl md:text-3xl">
            <div className="bg-primary-light p-2 md:p-2.5 rounded-xl text-primary"><PieChart size={24} className="md:w-7 md:h-7" /></div> Executive Analytics
          </h2>
          <p className="dashboard-subtitle text-sm md:text-base mt-2 flex items-center gap-1.5">
            <Database size={14}/> Live data synchronized from MongoDB backend
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-6 flex flex-col justify-center border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><FileText size={24} /></div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Tenders</div>
          </div>
          <div className="text-4xl font-black text-foreground">{data.totalTenders}</div>
        </div>
        
        <div className="card bg-white p-6 flex flex-col justify-center border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center"><Users size={24} /></div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Bidders Evaluated</div>
          </div>
          <div className="text-4xl font-black text-foreground">{data.totalBidders}</div>
        </div>
        
        <div className="card bg-white p-6 flex flex-col justify-center border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center"><CheckCircle size={24} /></div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Avg Pass Rate</div>
          </div>
          <div className="text-4xl font-black text-foreground">{data.avgPassRate}%</div>
        </div>
        
        <div className="card bg-white p-6 flex flex-col justify-center border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center"><AlertTriangle size={24} /></div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Human Reviews Needed</div>
          </div>
          <div className="text-4xl font-black text-foreground">{data.needsReviewCount}</div>
        </div>
      </div>

      {!hasData ? (
        <div className="cc-empty bg-white shadow-sm border border-border p-12">
          <div className="cc-empty-icon w-20 h-20 bg-primary-light text-primary mx-auto">
            <PieChart size={32} />
          </div>
          <h3 className="text-xl">Not enough data</h3>
          <p className="text-base">Upload a tender and evaluate at least one bidder to generate charts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-white p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2"><BarChart className="text-primary"/> Bidder Status Across Tenders</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}/>
                  <Legend wrapperStyle={{paddingTop: '20px', fontWeight: 600}}/>
                  <Bar dataKey="Eligible" stackId="a" fill="#10b981" radius={[0,0,4,4]} />
                  <Bar dataKey="NeedsReview" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Rejected" stackId="a" fill="#ef4444" radius={[4,4,0,0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card bg-white p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2"><PieChart className="text-accent"/> Overall Bidder Funnel</h3>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={data.pieData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} itemStyle={{fontWeight: 600}}/>
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontWeight: 600}}/>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
