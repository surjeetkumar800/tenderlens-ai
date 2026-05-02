import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CanvasArea from './CanvasArea';
import ControlsPanel from './ControlsPanel';
import HistoryPanel from './HistoryPanel';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const SimulationDashboard = () => {
  // Simulation State
  const [gravity, setGravity] = useState(9.8);
  const [objectType, setObjectType] = useState('ball');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  
  // Physics State
  const [position, setPosition] = useState({ x: 400, y: 100 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  
  // History
  const [history, setHistory] = useState([]);
  
  // Chart Data
  const [velocityData, setVelocityData] = useState([]);

  // Fetch History on Mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleSaveSimulation = async (finalVelocity) => {
    try {
      await axios.post(`${API_URL}/simulate`, {
        gravity,
        objectType,
        duration: time,
        result: {
          finalVelocityY: finalVelocity.y,
          finalPositionY: position.y
        }
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to save simulation:", err);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setPosition({ x: 400, y: 100 }); // reset to top center
    setVelocity({ x: 0, y: 0 });
    setVelocityData([]);
  };

  const setZeroGravity = () => {
    setGravity(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CanvasArea 
          gravity={gravity}
          objectType={objectType}
          isRunning={isRunning}
          position={position}
          setPosition={setPosition}
          velocity={velocity}
          setVelocity={setVelocity}
          time={time}
          setTime={setTime}
          velocityData={velocityData}
          setVelocityData={setVelocityData}
          onHitBottom={handleSaveSimulation}
        />
        
        <ControlsPanel 
          gravity={gravity}
          setGravity={setGravity}
          objectType={objectType}
          setObjectType={setObjectType}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          resetSimulation={resetSimulation}
          setZeroGravity={setZeroGravity}
          position={position}
          velocity={velocity}
        />
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <HistoryPanel history={history} onReplay={(sim) => {
          setGravity(sim.gravity);
          setObjectType(sim.objectType);
          resetSimulation();
        }} />
      </div>
    </div>
  );
};

export default SimulationDashboard;
