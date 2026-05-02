import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TenderUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a tender document");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      await axios.post('http://localhost:5000/api/tender/upload', formData);
      toast.success('Tender uploaded and analyzed successfully!');
      setFile(null);
      setTimeout(() => window.location.href = '/', 1500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload tender');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-foreground mb-4">Publish New Tender</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Upload the official tender document. Our AI will automatically analyze it and extract all mandatory eligibility criteria.</p>
      </div>

      <div className="card bg-white p-10 w-full max-w-3xl shadow-xl border-border">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center shadow-inner">
            <FileText className="text-primary w-10 h-10" />
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-8">
          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center bg-secondary/50 hover:bg-secondary transition-colors relative group">
            <UploadCloud className="mx-auto h-16 w-16 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <div className="flex text-lg text-foreground justify-center">
              <label className="relative cursor-pointer rounded-md font-bold text-primary hover:text-primary-hover focus-within:outline-none">
                <span>Upload a file</span>
                <input 
                  type="file" 
                  className="sr-only" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <p className="pl-2 font-medium">or drag and drop</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-medium">PDF, DOC, DOCX up to 50MB</p>
            
            {file && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-border shadow-sm text-sm font-bold text-success">
                <ShieldCheck size={18} />
                {file.name} selected
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={!file || loading}
            className="btn-primary w-full h-[56px] text-lg rounded-xl shadow-lg shadow-accent/20 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={24}/> Extracting Criteria...</>
            ) : (
              <>Start AI Extraction <ArrowRight size={24} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenderUpload;
