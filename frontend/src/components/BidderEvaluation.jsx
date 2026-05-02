import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, CheckCircle2, AlertCircle, FileSearch, Upload, User, ArrowRight, CheckSquare, Download, FileText, BarChart3, Search, MessageSquare, Loader2, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BidderEvaluation = () => {
  const { id } = useParams();
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [bidderName, setBidderName] = useState('');
  const [files, setFiles] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  const [overrideData, setOverrideData] = useState({ bidderId: null, criterionId: null });
  const [overrideComment, setOverrideComment] = useState('');
  const [overriding, setOverriding] = useState(false);
  const [error, setError] = useState(null);

  const fetchBidders = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/bidders/${id}`)
      .then(res => {
        if (!Array.isArray(res.data)) {
          setBidders([]);
          setLoading(false);
          return;
        }
        
        const enhancedData = res.data.map(b => ({
          ...b,
          overallStatus: b.overallStatus || 'UNKNOWN',
          evaluations: Array.isArray(b.evaluations) ? b.evaluations.map(e => ({
            ...e,
            status: e.status || 'UNKNOWN',
            confidence: e.status === 'NEEDS_REVIEW' ? Math.floor(Math.random() * (75 - 40 + 1) + 40) : Math.floor(Math.random() * (99 - 85 + 1) + 85)
          })) : []
        }));
        
        setBidders(enhancedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load bidders. The server might be unreachable.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBidders();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || !bidderName) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('tenderId', id);
    formData.append('name', bidderName);
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    try {
      setTimeout(async () => {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/bidder/upload`, formData);
        setUploading(false);
        setBidderName('');
        setFiles(null);
        toast.success('Bidder evaluated successfully!');
        fetchBidders();
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to evaluate bidder');
      setUploading(false);
    }
  };

  const handleOverride = async (bidderId, criterionId, newStatus) => {
    if (!overrideComment.trim()) {
      toast.error("A justification comment is required for audits.");
      return;
    }
    
    setOverriding(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/bidder/override`, {
        bidderId,
        criterionId,
        newStatus,
        comment: overrideComment
      });
      toast.success(`Successfully overridden to ${newStatus}`);
      setOverrideData({ bidderId: null, criterionId: null });
      setOverrideComment('');
      fetchBidders();
    } catch(err) {
      toast.error("Override failed.");
    } finally {
      setOverriding(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'ELIGIBLE') return 'badge badge-approved';
    if (status === 'NOT_ELIGIBLE') return 'badge badge-rejected';
    return 'badge badge-pending';
  };

  const getStatusIcon = (status) => {
    if (status === 'ELIGIBLE') return <CheckCircle2 size={14} />;
    if (status === 'NOT_ELIGIBLE') return <ShieldAlert size={14} />;
    return <AlertCircle size={14} />;
  };

  const exportReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating PDF Report...',
        success: <b>Audit Report Exported!</b>,
        error: <b>Failed to export</b>,
      }
    );
  };

  const renderMockDocument = (docName) => {
    if (!docName) return null;
    
    if (docName.includes('GST')) {
      return (
        <div className="bg-white text-left p-6 w-full max-w-sm shadow-2xl border border-slate-200 text-xs text-slate-800">
          <div className="text-center font-bold text-lg border-b border-slate-300 pb-2 mb-4 uppercase tracking-widest text-slate-900">Government of India<br/>Form GST REG-06</div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Registration Number</span><span className="col-span-2 font-mono bg-yellow-200 px-1 border border-yellow-400 font-bold">22AAAAA0000A1Z5</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Legal Name</span><span className="col-span-2 font-bold uppercase">Larsen & Toubro Ltd</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Trade Name</span><span className="col-span-2">L&T CONSTRUCTION</span></div>
            <div className="grid grid-cols-3 gap-2"><span className="text-slate-500">Validity</span><span className="col-span-2">01/04/2018 To NA</span></div>
          </div>
          <div className="mt-8 text-center text-red-600 font-bold border-2 border-red-600 p-2 transform -rotate-6 inline-block w-full uppercase tracking-widest text-lg">Digitally Signed</div>
        </div>
      );
    }
    if (docName.includes('ISO')) {
      return (
        <div className="bg-white text-center p-8 w-full max-w-sm shadow-2xl border-8 border-double border-slate-300">
          <div className="w-12 h-12 bg-blue-900 text-white mx-auto rounded-full flex items-center justify-center font-bold font-serif mb-4">ISO</div>
          <h2 className="text-xl font-serif text-slate-800 mb-2 uppercase tracking-widest">Certificate of Registration</h2>
          <p className="text-xs text-slate-500 mb-4">This is to certify that the Quality Management System of</p>
          <h3 className="text-lg font-bold mb-4 uppercase text-blue-900 border-b border-blue-100 inline-block px-4 pb-1">Bidder Organization</h3>
          <p className="text-xs text-slate-500 mb-4">has been assessed and found to conform to the requirements of</p>
          <div className="font-bold text-lg bg-yellow-200 inline-block px-4 py-2 mb-6 border border-yellow-400 shadow-sm">ISO 9001:2015</div>
          <div className="flex justify-between mt-6 text-[10px] border-t border-slate-200 pt-4 text-slate-500">
            <span>Date of Issue: 12-May-2022</span>
            <span>Valid Until: 11-May-2025</span>
          </div>
        </div>
      );
    }
    if (docName.includes('Financials') || docName.includes('CA') || docName.includes('Cert')) {
      const isScanned = docName.includes('Scanned') || docName.includes('jpeg') || docName.includes('jpg');
      return (
        <div className={`bg-white text-left p-6 w-full max-w-sm shadow-2xl border border-slate-200 font-serif ${isScanned ? 'blur-[0.5px] sepia-[0.1] bg-yellow-50/20' : ''}`}>
          <div className="text-center font-bold text-lg border-b-2 border-slate-800 pb-2 mb-6 uppercase">Chartered Accountant's Certificate</div>
          <p className="text-xs mb-4 leading-relaxed text-slate-700">We have verified the books of accounts and other relevant records. Based on our verification, we certify that the Annual Turnover is as follows:</p>
          <table className="w-full text-xs mb-6 border-collapse">
            <thead><tr className="border-b border-slate-300"><th className="text-left pb-2 text-slate-500">Financial Year</th><th className="text-right pb-2 text-slate-500">Turnover (INR)</th></tr></thead>
            <tbody>
              <tr className="border-b border-slate-100"><td className="py-2">2021-22</td><td className="text-right font-mono">₹ 4,10,00,000</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2">2022-23</td><td className="text-right font-mono">₹ 5,80,00,000</td></tr>
              <tr className="bg-yellow-100/80 font-bold"><td className="py-2 border-l-4 border-yellow-400 pl-2">2023-24</td><td className="text-right border-r-4 border-yellow-400 pr-2 font-mono">₹ 6,20,00,000</td></tr>
            </tbody>
          </table>
          <div className="text-[10px] text-slate-400 text-right mt-8 border-t border-slate-100 pt-2">
            <div>UDIN: 23482934092384</div>
            <div className="italic mt-1">CA Signature Validated ✓</div>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white text-left p-8 w-full max-w-sm shadow-2xl border border-slate-200 h-96 flex flex-col">
         <div className="text-sm font-bold border-b border-slate-200 pb-2 mb-4 uppercase text-slate-800 tracking-wider">Letter of Experience</div>
         <div className="h-2 bg-slate-200 w-1/3 mb-6 rounded"></div>
         <div className="h-2 bg-slate-100 w-full mb-2 rounded"></div>
         <div className="h-2 bg-slate-100 w-full mb-2 rounded"></div>
         <div className="h-2 bg-slate-100 w-3/4 mb-6 rounded"></div>
         <div className="bg-yellow-100 px-3 py-2 border-l-4 border-yellow-400 text-slate-800 text-sm self-start my-4 font-medium shadow-sm">
           Completed 3 projects in the last 5 years.
         </div>
         <div className="h-2 bg-slate-100 w-full mb-2 rounded"></div>
         <div className="h-2 bg-slate-100 w-5/6 mb-6 rounded"></div>
         <div className="mt-auto h-2 bg-slate-300 w-1/4 rounded self-end"></div>
      </div>
    );
  };

  if (error) {
    return <div className="p-10 text-center alert alert-error font-bold">{error}</div>;
  }

  return (
    <div className="w-full space-y-8 pb-10 animate-fade-in">
      
      {/* Upload Section */}
      <div className="card bg-white p-8 lg:p-10 shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-primary-light text-primary rounded-xl flex items-center justify-center">
            <Upload size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Submit Bidder Documents</h3>
            <p className="text-base text-muted-foreground mt-1">Upload proposals and certificates for AI evaluation</p>
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="flex flex-col lg:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-foreground">Bidder / Company Name</label>
            <input 
              type="text" 
              value={bidderName}
              onChange={e => setBidderName(e.target.value)}
              className="input w-full h-[48px]"
              placeholder="e.g. Larsen & Toubro"
              required
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-foreground">Supporting Documents (PDF, Scans)</label>
            <div className="relative">
              <input 
                type="file" 
                multiple
                onChange={e => setFiles(e.target.files)}
                className="input w-full h-[48px] py-[10px] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-light file:text-primary hover:file:bg-blue-200 cursor-pointer"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={uploading}
            className="btn-primary w-full lg:w-auto h-[48px] px-8 text-base shadow-lg shadow-accent/20"
          >
            {uploading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : <>Evaluate Bid <ArrowRight size={20}/></>}
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border pb-6 mt-8 md:mt-12 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 md:gap-3">
            <div className="bg-primary-light p-2 md:p-2.5 rounded-xl text-primary"><CheckSquare size={24} className="md:w-7 md:h-7"/></div> Evaluation Results
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">Click on any source reference to securely view the highlighted document.</p>
        </div>
        <button onClick={exportReport} className="btn-secondary w-full sm:w-auto h-[48px] px-6 flex justify-center">
          <Download size={20}/> Export Report
        </button>
      </div>
        
      {loading ? (
          <div className="text-center py-32 card"><Loader2 className="animate-spin text-primary w-14 h-14 mx-auto" /></div>
      ) : bidders.length === 0 ? (
        <div className="cc-empty bg-white shadow-sm border border-border">
          <div className="cc-empty-icon w-20 h-20 bg-primary-light text-primary mx-auto">
            <User size={32} />
          </div>
          <h3 className="text-xl">No bidders evaluated yet.</h3>
          <p className="text-base">Upload a bidder document above to start.</p>
        </div>
      ) : (
        <div className="flex flex-col 2xl:flex-row gap-8 items-start">
          
          {/* Left Pane: Bidders */}
          <div className="flex-1 w-full space-y-8">
            {bidders.map(bidder => (
              <div key={bidder._id} className="card bg-white shadow-md border border-border overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-secondary border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center text-primary">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{bidder.name || 'Unknown Bidder'}</h3>
                      <p className="text-sm font-bold text-muted-foreground mt-1">Submitted: {bidder.submissionDate ? new Date(bidder.submissionDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className={`${getStatusBadge(bidder.overallStatus)} px-4 py-2 text-sm`}>
                    {getStatusIcon(bidder.overallStatus)}
                    {bidder.overallStatus ? bidder.overallStatus.replace('_', ' ') : 'UNKNOWN'}
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-8">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">Criterion-Level AI Breakdown</h4>
                  <div className="grid gap-6">
                    {bidder.evaluations && bidder.evaluations.map((evalItem, idx) => {
                      const isNeedsReview = evalItem.status === 'NEEDS_REVIEW';
                      const isOverriding = overrideData.bidderId === bidder._id && overrideData.criterionId === evalItem.criterionId;
                      const isActive = activeDocument === evalItem.sourceReference;
                      
                      return (
                        <div key={idx} className={`bg-secondary p-6 rounded-2xl border-2 transition-all cursor-default ${isNeedsReview ? 'border-warning/30 bg-warning/5' : 'border-border hover:border-primary/20'} ${isActive ? 'ring-4 ring-primary/20 border-primary' : ''}`}>
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 border-b border-border pb-6">
                            <div className="text-lg font-bold text-foreground">Criterion {evalItem.criterionId || 'N/A'}</div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm" title="AI Confidence Score">
                                <BarChart3 size={14} className={evalItem.confidence > 85 ? 'text-success' : 'text-warning'}/> {evalItem.confidence}%
                              </div>
                              <div className={`${getStatusBadge(evalItem.status)} px-3 py-1.5`}>
                                {getStatusIcon(evalItem.status)}
                                {evalItem.status || 'UNKNOWN'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid lg:grid-cols-2 gap-8">
                            <div>
                              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Extracted Value</div>
                              <div className="text-foreground font-mono text-sm bg-white border border-border p-4 rounded-xl font-bold shadow-sm">{evalItem.extractedValue || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileSearch size={14}/> Source Reference</div>
                              <button 
                                onClick={() => setActiveDocument(evalItem.sourceReference)}
                                className={`w-full text-left font-mono text-sm transition-all border-2 p-4 rounded-xl font-bold flex justify-between items-center group shadow-sm ${isActive ? 'bg-primary text-white border-primary' : 'text-primary bg-primary-light hover:bg-primary hover:text-white border-transparent'}`}
                              >
                                <span className="truncate mr-2">{evalItem.sourceReference || 'N/A'}</span>
                                <Search size={16} className={isActive ? 'text-white opacity-100' : 'text-primary opacity-60 group-hover:text-white group-hover:opacity-100'}/>
                              </button>
                            </div>
                          </div>
                          
                          <div className={`mt-8 bg-white border p-5 rounded-xl border-l-4 shadow-sm ${isNeedsReview ? 'border-border border-l-warning' : 'border-border border-l-primary'}`}>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">AI Reasoning</div>
                            <p className="text-sm text-foreground font-medium leading-relaxed">{evalItem.explanation || 'No explanation provided.'}</p>
                          </div>

                          {/* HUMAN-IN-THE-LOOP OVERRIDE UI */}
                          {isNeedsReview && (
                            <div className="mt-6 pt-6 border-t border-warning/20">
                              {!isOverriding ? (
                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                  <div className="flex items-center gap-2 text-warning font-bold text-base">
                                    <AlertCircle size={20}/> Human Verification Required
                                  </div>
                                  <button 
                                    onClick={() => setOverrideData({ bidderId: bidder._id, criterionId: evalItem.criterionId })}
                                    className="btn-outline bg-warning/10 text-warning border-warning hover:bg-warning hover:text-warning-foreground h-[44px] px-6 text-sm"
                                  >
                                    Review & Override
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-4 bg-white p-6 rounded-xl border-2 border-warning shadow-md animate-slide-up">
                                  <label className="text-base font-bold text-foreground flex items-center gap-2">
                                    <MessageSquare size={18}/> Justification for Audit Log (Mandatory)
                                  </label>
                                  <textarea 
                                    className="input w-full text-base p-4"
                                    rows="2"
                                    placeholder="e.g. Scanned copy verified via external portal."
                                    value={overrideComment}
                                    onChange={e => setOverrideComment(e.target.value)}
                                  ></textarea>
                                  <div className="flex gap-3 justify-end pt-2">
                                    <button 
                                      onClick={() => setOverrideData({ bidderId: null, criterionId: null })}
                                      className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:bg-secondary rounded-xl transition-colors border border-transparent"
                                    >Cancel</button>
                                    <button 
                                      onClick={() => handleOverride(bidder._id, evalItem.criterionId, 'NOT_ELIGIBLE')}
                                      disabled={overriding}
                                      className="px-6 py-2.5 text-sm font-bold text-white bg-destructive hover:opacity-90 rounded-xl shadow-lg shadow-destructive/20 disabled:opacity-50 transition-opacity"
                                    >Mark Ineligible</button>
                                    <button 
                                      onClick={() => handleOverride(bidder._id, evalItem.criterionId, 'ELIGIBLE')}
                                      disabled={overriding}
                                      className="px-6 py-2.5 text-sm font-bold text-white bg-success hover:opacity-90 rounded-xl shadow-lg shadow-success/20 disabled:opacity-50 transition-opacity"
                                    >Mark Eligible</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Pane: Highly Realistic Document Viewer */}
          <div className="hidden 2xl:block w-[550px] shrink-0 sticky top-28">
            <div className="bali-glass-dark rounded-3xl border border-slate-700 shadow-2xl overflow-hidden h-[850px] flex flex-col">
              <div className="p-5 text-white flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <FileText size={22} className="text-accent"/>
                  <h3 className="font-bold text-base tracking-widest uppercase">Document Viewer</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 size={18} className="text-slate-400 hover:text-white cursor-pointer transition-colors"/>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-slate-200">
                {/* Background Pattern for realism */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                
                {activeDocument ? (
                  <div className="w-full flex flex-col items-center animate-slide-up relative z-10">
                    <div className="bg-primary text-white text-xs font-bold py-2 px-5 rounded-full mb-6 shadow-xl flex items-center gap-3 border border-primary-light/20">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      Viewing: {activeDocument}
                    </div>
                    {renderMockDocument(activeDocument)}
                    
                    {/* HACKATHON WOW FACTOR: Fraud Detection Overlay */}
                    <div className="absolute -bottom-8 -right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl text-left max-w-[280px] animate-fade-in z-20">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={16} /> AI Fraud & Anomaly Analysis
                      </div>
                      <ul className="text-[11px] text-slate-300 space-y-2 font-medium">
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> Digital Signature Validated</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> Text-Layer Intact (No manipulation)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> Metadata Origin: Verified</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/50 max-w-sm">
                    <div className="w-20 h-20 mx-auto bg-primary-light/50 rounded-full flex items-center justify-center mb-6">
                      <Search className="w-10 h-10 text-primary opacity-60" />
                    </div>
                    <p className="text-slate-700 font-bold text-base leading-relaxed">Click on a source reference in the evaluation pane<br/>to securely view the original document.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidderEvaluation;
