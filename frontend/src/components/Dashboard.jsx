import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FileText, Users, ArrowRight, Upload, Calendar, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tenders')
      .then(res => {
        setTenders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border pb-6 gap-4">
        <div>
          <h2 className="dashboard-title flex items-center gap-2 md:gap-3 text-2xl md:text-3xl">
            <div className="bg-primary-light p-2 md:p-2.5 rounded-xl text-primary"><FileText size={24} className="md:w-7 md:h-7" /></div> Active Tenders
          </h2>
          <p className="dashboard-subtitle text-sm md:text-base mt-2">Manage and evaluate incoming bids using AI.</p>
        </div>
        <Link to="/upload" className="btn-primary w-full sm:w-auto h-[48px] px-6 text-base shadow-lg shadow-accent/20 flex justify-center">
          <Upload size={20} /> Publish Tender
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-primary w-14 h-14" /></div>
      ) : tenders.length === 0 ? (
        <div className="cc-empty bg-white shadow-sm border border-border">
          <div className="cc-empty-icon w-20 h-20 bg-primary-light text-primary mx-auto">
            <FileText size={32} />
          </div>
          <h3 className="text-xl">No Active Tenders</h3>
          <p className="text-base">Publish your first tender to start accepting bids.</p>
          <Link to="/upload" className="btn-primary h-[46px] mt-4">
            Create First Tender
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tenders.map(tender => (
            <div key={tender._id} className="card bg-white p-7 flex flex-col justify-between h-full min-h-[350px] group border-2 border-transparent hover:border-primary/20 shadow-md hover:shadow-xl transition-all">
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <span className="badge badge-info bg-primary-light text-primary font-bold px-3 py-1.5 border border-primary/20">
                    {tender.criteria.length} Criteria
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">{tender.title}</h3>
                <p className="text-sm text-muted-foreground font-bold flex items-center gap-2 mb-6">
                  <Calendar size={16} className="text-primary/60"/> {new Date(tender.uploadDate).toLocaleDateString()}
                </p>
                
                <div className="mb-6">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Required Capabilities</div>
                  <div className="flex flex-wrap gap-2">
                    {tender.criteria.slice(0, 3).map((c, i) => (
                      <span key={i} className="badge bg-secondary text-foreground border border-border px-2.5 py-1">
                        {c.category}
                      </span>
                    ))}
                    {tender.criteria.length > 3 && <span className="badge bg-slate-100 text-muted-foreground border border-border">+{tender.criteria.length - 3}</span>}
                  </div>
                </div>
              </div>
              
              <Link to={`/tender/${tender._id}`} className="btn-secondary w-full h-[46px] group-hover:bg-primary group-hover:text-white transition-all">
                <Users size={18} /> Evaluate Bidders <ArrowRight size={18} className="ml-auto" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
