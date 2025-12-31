
import React, { useMemo } from 'react';
import { SpeedometerProps, ReliabilityLevel } from '../types';

const Speedometer: React.FC<SpeedometerProps> = ({ 
  value, 
  title = "TRUST INDICATOR", 
  subtitle = "For further details, including scoring criteria check out the 'Details' tab.",
  className = "" 
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  // Угол поворота стрелки: от -90 (0%) до +90 (100%)
  const needleRotation = (normalizedValue / 100) * 180 - 90;

  const level = useMemo(() => {
    if (normalizedValue < 33) return ReliabilityLevel.RELIABLE;
    if (normalizedValue < 66) return ReliabilityLevel.FUZZY;
    return ReliabilityLevel.UNRELIABLE;
  }, [normalizedValue]);

  const ticks = useMemo(() => {
    const tickCount = 61; 
    return Array.from({ length: tickCount }).map((_, i) => {
      const angle = (i / (tickCount - 1)) * 180 - 180;
      return { angle };
    });
  }, []);

  /**
   * Геометрия:
   * outerRadius: радиус центра цветных дуг.
   * strokeWidth: толщина цветных дуг.
   * gap: чистый отступ между внутренним краем дуги и краем градиента.
   */
  const outerRadius = 185;
  const strokeWidth = 14;
  const gap = 15; 
  const gradientRadius = outerRadius - (strokeWidth / 2) - gap;
  
  const startX = 200 - gradientRadius;
  const endX = 200 + gradientRadius;

  return (
    <div className={`flex flex-col items-center bg-white p-14 rounded-[3.5rem] shadow-2xl border border-gray-50 ${className}`}>
      {/* Контейнер спидометра */}
      <div className="relative w-full max-w-[550px] aspect-[2/1] overflow-visible">
        
        {/* Текстовые метки ПРИБЛИЖЕНЫ к дугам максимально близко */}
        <div className="absolute inset-0 flex pointer-events-none select-none font-sans">
           <span className="absolute left-[-10%] top-[52%] text-[13px] font-bold text-gray-800 tracking-tight">Reliable</span>
           <span className="absolute left-1/2 -translate-x-1/2 top-[-15%] text-[13px] font-bold text-gray-800 tracking-tight">Fuzzy</span>
           <span className="absolute right-[-14%] top-[52%] text-[13px] font-bold text-gray-800 tracking-tight">Unreliable</span>
        </div>

        <svg viewBox="0 0 400 220" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Градиент заливки полукруга */}
            <radialGradient id="innerGreenGradient" cx="50%" cy="100%" r="100%">
              <stop offset="0%" stopColor="#e8f5e9" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#81c784" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4caf50" stopOpacity="0.85" />
            </radialGradient>
            
            <filter id="needleGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Фоновая заливка градиентом */}
          <path
            d={`M ${startX},200 A ${gradientRadius},${gradientRadius} 0 0,1 ${endX},200 Z`}
            fill="url(#innerGreenGradient)"
            className="transition-all duration-700"
          />

          {/* Внешние цветные сегменты */}
          {/* Зеленый */}
          <path 
            d={`M ${200 - outerRadius},200 A ${outerRadius},${outerRadius} 0 0,1 110,40`} 
            fill="none" 
            stroke="#27ae60" 
            strokeWidth={strokeWidth} 
            strokeLinecap="butt" 
          />
          {/* Желтый */}
          <path 
            d={`M 125,32 A ${outerRadius},${outerRadius} 0 0,1 275,32`} 
            fill="none" 
            stroke="#f1c40f" 
            strokeWidth={strokeWidth} 
            strokeLinecap="butt" 
          />
          {/* Красный */}
          <path 
            d={`M 290,40 A ${outerRadius},${outerRadius} 0 0,1 ${200 + outerRadius},200`} 
            fill="none" 
            stroke="#c0392b" 
            strokeWidth={strokeWidth} 
            strokeLinecap="butt" 
          />

          {/* Деления (Ticks) на градиенте */}
          <g transform="translate(200, 200)">
            {ticks.map((tick, i) => (
              <line
                key={i}
                x1={gradientRadius - 8} 
                y1={0}
                x2={gradientRadius}     
                y2={0}
                transform={`rotate(${tick.angle})`}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            ))}
          </g>

          {/* Стрелка */}
          <g 
            transform={`translate(200, 200) rotate(${needleRotation})`} 
            style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <path
              d="M -3.5,0 L 0,-185 L 3.5,0 Z"
              fill="#1e293b"
              filter="url(#needleGlow)"
            />
          </g>

          {/* Центральный узел */}
          <circle cx="200" cy="200" r="18" fill="#1e293b" />
          <circle cx="200" cy="200" r="7" fill="#475569" />
        </svg>
      </div>

      {/* Индикация значения */}
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-3">
           <div className={`w-4 h-4 rounded-full animate-pulse shadow-sm ${
            level === ReliabilityLevel.RELIABLE ? 'bg-green-500 shadow-green-200' :
            level === ReliabilityLevel.FUZZY ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-500 shadow-red-200'
          }`} />
           <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{normalizedValue}%</span>
        </div>
        <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{level} Reliability Score</p>
        
        <div className="max-w-[340px] pt-8 border-t border-slate-100 mt-8">
           <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
             {subtitle.split('\'').map((part, i) => 
               i % 2 === 1 ? <span key={i} className="text-indigo-500 cursor-pointer font-bold hover:text-indigo-600 transition-colors underline decoration-indigo-200 underline-offset-4">{part}</span> : part
             )}
           </p>
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
