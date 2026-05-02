import React from 'react';
import { History, PlayCircle } from 'lucide-react';

const HistoryPanel = ({ history, onReplay }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 mb-6">
        <History size={20} className="text-indigo-400" /> 
        Simulation History
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[600px]">
        {history.length === 0 ? (
          <p className="text-slate-500 text-center mt-10">No history available yet.</p>
        ) : (
          history.map((sim, index) => (
            <div key={sim._id || index} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="inline-block px-2 py-1 bg-slate-800 text-xs rounded text-slate-300 font-medium capitalize">
                    {sim.objectType}
                  </span>
                </div>
                <button 
                  onClick={() => onReplay(sim)}
                  className="text-slate-400 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Replay this setting"
                >
                  <PlayCircle size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <div className="text-slate-500 text-xs">Gravity</div>
                  <div className="font-mono text-slate-200">{sim.gravity} m/s²</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Duration</div>
                  <div className="font-mono text-slate-200">{sim.duration.toFixed(2)} s</div>
                </div>
                <div className="col-span-2 mt-2">
                  <div className="text-slate-500 text-xs">Final Velocity</div>
                  <div className="font-mono text-blue-400">
                    {sim.result && sim.result.finalVelocityY !== undefined ? sim.result.finalVelocityY.toFixed(2) : '0.00'} m/s
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
