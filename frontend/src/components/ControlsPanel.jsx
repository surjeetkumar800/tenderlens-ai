import React from 'react';
import { Play, Pause, RotateCcw, Weight } from 'lucide-react';

const ControlsPanel = ({
  gravity, setGravity,
  objectType, setObjectType,
  isRunning, setIsRunning,
  resetSimulation, setZeroGravity,
  position, velocity
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Controls */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <Weight size={20} className="text-blue-400" /> Controls
        </h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-slate-300 font-medium">Gravity (m/s²)</label>
            <span className="text-blue-400 font-mono">{gravity.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="-10" 
            max="10" 
            step="0.1" 
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>-10 (Anti-Gravity)</span>
            <span>0</span>
            <span>+10 (Gravity)</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-300 font-medium text-sm">Object Type</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setObjectType('ball')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${objectType === 'ball' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Ball
            </button>
            <button 
              onClick={() => setObjectType('cube')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${objectType === 'cube' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Cube
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white transition-colors`}
          >
            {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button 
            onClick={resetSimulation}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
        
        <button 
          onClick={setZeroGravity}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold transition-colors"
        >
          Zero Gravity Mode
        </button>
      </div>

      {/* Real-time Stats */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Live Telemetry</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Position Y</div>
            <div className="text-2xl font-mono text-emerald-400">{((400 - position.y) / 50).toFixed(2)} m</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Velocity Y</div>
            <div className="text-2xl font-mono text-blue-400">{velocity.y.toFixed(2)} m/s</div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 col-span-2">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Acceleration</div>
            <div className="text-2xl font-mono text-purple-400">{gravity.toFixed(2)} m/s²</div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ControlsPanel;
