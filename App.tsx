
import React, { useState, useEffect, useRef } from 'react';
import Speedometer from './components/Speedometer';

const App: React.FC = () => {
  const [value, setValue] = useState(25);
  const [isAuto, setIsAuto] = useState(false);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  // Плавная анимация через requestAnimationFrame для демонстрации
  const animate = (time: number) => {
    if (startTimeRef.current === null) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    
    // Синусоидальное движение от 10 до 90 каждые 6 секунд
    const newValue = Math.round(50 + 40 * Math.sin(elapsed / 1000));
    setValue(newValue);
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isAuto) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAuto]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value, 10));
    setIsAuto(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-xl space-y-10">
        
        {/* Speedometer Component */}
        <Speedometer value={value} />

        {/* Control Center */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Precision Control</h2>
                <p className="text-sm text-slate-400 font-medium">Test needle fluid dynamics</p>
              </div>
              <button 
                onClick={() => setIsAuto(!isAuto)}
                className={`relative overflow-hidden group px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isAuto 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300'
                }`}
              >
                <span className="relative z-10">{isAuto ? 'Stop Scanning' : 'Start Smooth Scan'}</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Manual Input</label>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800 tabular-nums">{value}</span>
                  <span className="text-sm font-bold text-slate-300">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={value} 
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[12, 50, 88].map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setValue(v);
                    setIsAuto(false);
                  }}
                  className="py-3 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 rounded-xl border border-slate-100 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 active:scale-95"
                >
                  Set {v}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Engineered for smoothness • 60 FPS Animation
        </p>
      </div>
    </div>
  );
};

export default App;
