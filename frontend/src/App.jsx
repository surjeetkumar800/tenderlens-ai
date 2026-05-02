import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TenderUpload from './components/TenderUpload';
import BidderEvaluation from './components/BidderEvaluation';
import Analytics from './components/Analytics';
import AuditLog from './components/AuditLog';
import { FileText, Upload, ShieldCheck, PieChart, ShieldAlert } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function NavLinks() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'text-primary bg-primary-light border-primary' : 'text-muted-foreground hover:text-primary hover:bg-slate-50 border-transparent';

  return (
    <>
      <Link to="/" className={`flex items-center gap-2 font-bold transition-all px-4 py-2.5 rounded-xl border ${isActive('/')}`}>
        <FileText size={18} /> Tenders
      </Link>
      <Link to="/analytics" className={`flex items-center gap-2 font-bold transition-all px-4 py-2.5 rounded-xl border ${isActive('/analytics')}`}>
        <PieChart size={18} /> Analytics
      </Link>
      <Link to="/audit" className={`flex items-center gap-2 font-bold transition-all px-4 py-2.5 rounded-xl border ${isActive('/audit')}`}>
        <ShieldAlert size={18} /> Audit Log
      </Link>
      <Link to="/upload" className="btn-primary ml-4 h-[44px]">
        <Upload size={18} /> New Tender
      </Link>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="font-primary min-h-screen bg-secondary flex flex-col">
        <Toaster position="top-right" />
        <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
          <div className="w-full px-4 md:px-12 mx-auto flex flex-col md:flex-row md:items-center justify-between py-3 md:py-0 md:h-20 gap-3 md:gap-0">
            <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="bg-primary/10 p-1.5 md:p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="text-primary w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight m-0">
                  Tender<span className="text-accent">Lens</span>
                </h1>
                <span className="text-[8px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest block">Explainable AI Auditor</span>
              </div>
            </Link>
            
            <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar flex items-center">
              <nav className="flex gap-2 items-center min-w-max">
                <NavLinks />
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full px-4 md:px-12 mx-auto py-6 md:py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/upload" element={<TenderUpload />} />
            <Route path="/tender/:id" element={<BidderEvaluation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
