import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Clock, User, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/audit`)
      .then(res => {
        if(Array.isArray(res.data)) setLogs(res.data);
        else setLogs([]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getActionColor = (action) => {
    if (!action) return 'bg-slate-100 text-slate-800 border-slate-200';
    if (action === 'HUMAN_OVERRIDE') return 'bg-warning/10 text-warning border-warning/20';
    if (action === 'BIDDER_EVALUATED') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-success/10 text-success border-success/20';
  };

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-primary w-14 h-14" /></div>;

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border pb-6 gap-4">
        <div>
          <h2 className="dashboard-title flex items-center gap-2 md:gap-3 text-2xl md:text-3xl">
            <div className="bg-primary-light p-2 md:p-2.5 rounded-xl text-primary"><ShieldCheck size={24} className="md:w-7 md:h-7" /></div> Compliance & Audit Trail
          </h2>
          <p className="dashboard-subtitle text-sm md:text-base mt-2">Immutable log of all AI evaluations and human interventions.</p>
        </div>
      </div>

      <div className="card bg-white p-0 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary border-b border-border text-[11px] uppercase font-black text-muted-foreground tracking-widest">
                <th className="p-5 w-48">Timestamp</th>
                <th className="p-5">Action Event</th>
                <th className="p-5 w-1/4">Entity</th>
                <th className="p-5 w-1/3">Details / Justification</th>
                <th className="p-5">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-muted-foreground font-medium text-lg">
                    No audit logs found. Try evaluating a bidder or overriding a status.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Clock size={16} className="text-muted-foreground" />
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`badge ${getActionColor(log.action)}`}>
                        {log.action ? log.action.replace('_', ' ') : 'UNKNOWN ACTION'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="text-sm">
                        <span className="font-bold text-foreground block mb-1">{log.entityName || 'Unknown Entity'}</span>
                        <span className="badge bg-secondary text-muted-foreground">{log.entityType || 'Entity'}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm font-medium text-foreground bg-secondary p-3.5 rounded-xl border border-border leading-relaxed">
                        {log.details || 'No details recorded.'}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center">
                          <User size={14} />
                        </div>
                        {log.user || 'System'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
