import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CanvasArea = ({ 
  gravity, objectType, isRunning, 
  position, setPosition, velocity, setVelocity,
  time, setTime, velocityData, setVelocityData, onHitBottom
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  const updatePhysics = (deltaTime) => {
    const dt = deltaTime / 1000;
    const scale = 50; 
    
    const newVelY = velocity.y + (gravity * dt);
    const newPosY = position.y + (newVelY * dt * scale);
    
    const canvas = canvasRef.current;
    const objectSize = 20; 
    const groundLevel = canvas.height - objectSize;
    const ceilingLevel = objectSize;

    if (newPosY >= groundLevel && gravity > 0) {
      setPosition({ x: position.x, y: groundLevel });
      setVelocity({ x: velocity.x, y: 0 });
      if (isRunning) onHitBottom({ x: velocity.x, y: newVelY });
      return false; 
    } else if (newPosY <= ceilingLevel && gravity < 0) {
      setPosition({ x: position.x, y: ceilingLevel });
      setVelocity({ x: velocity.x, y: 0 });
      if (isRunning) onHitBottom({ x: velocity.x, y: newVelY });
      return false; 
    }

    setVelocity({ x: velocity.x, y: newVelY });
    setPosition({ x: position.x, y: newPosY });
    setTime(prev => prev + dt);
    
    if (Math.floor(time * 10) > Math.floor((time - dt) * 10)) {
      setVelocityData(prev => [...prev, { t: time.toFixed(1), v: newVelY.toFixed(2) }]);
    }

    return true; 
  };

  const animate = (timeNow) => {
    if (previousTimeRef.current !== undefined && isRunning) {
      const deltaTime = timeNow - previousTimeRef.current;
      updatePhysics(deltaTime);
    }
    previousTimeRef.current = timeNow;
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, gravity, position, velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#1e293b'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#334155'; 
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    ctx.fillStyle = '#3b82f6'; 
    if (objectType === 'ball') {
      ctx.beginPath();
      ctx.arc(position.x, position.y, 20, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(position.x - 20, position.y - 20, 40, 40);
    }

  }, [position, objectType]);

  const chartData = {
    labels: velocityData.map(d => d.t),
    datasets: [
      {
        label: 'Velocity Y (m/s)',
        data: velocityData.map(d => d.v),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="bg-slate-900 rounded-lg shadow-inner max-w-full"
        />
      </div>
      
      {velocityData.length > 0 && (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 h-64">
          <Line 
            data={chartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#fff' } } },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
              }
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
