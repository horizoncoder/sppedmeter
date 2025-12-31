
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
   * ГЕОМЕТРИЯ:
   * CX, CY: Центр вращения спидометра
   * outerRadius: радиус цветных полосок (поднят выше)
   * mainArcRadius: радиус основной градиентной области
   */
  const CX = 200;
  const CY = 220; // Центр смещен вниз для освобождения места сверху
  const outerRadius = 210; // Подняли линии выше (увеличили радиус)
  const strokeWidth = 8;
  const gapBetweenArcs = 15;
  const mainArcRadius = outerRadius - gapBetweenArcs;
  const mainArcInnerRadius = 70; 

  // Координаты для основной дуги
  const x1 = CX - mainArcRadius;
  const x2 = CX + mainArcRadius;
  const ix1 = CX - mainArcInnerRadius;
  const ix2 = CX + mainArcInnerRadius;

  return (
    <div className={`flex flex-col items-center bg-white p-14 rounded-[4rem] shadow-2xl border border-gray-100 ${className}`}>
      {/* Контейнер спидометра */}
      <div className="relative w-full max-w-[550px] aspect-[2/1] overflow-visible">
        
        {/* Текстовые метки: смещены выше вслед за линиями */}
        <div className="absolute inset-0 flex pointer-events-none select-none font-sans">
           <span className="absolute left-[-8%] top-[62%] text-[13px] font-bold text-gray-800 tracking-tight">Reliable</span>
           <span className="absolute left-1/2 -translate-x-1/2 top-[-22%] text-[13px] font-bold text-gray-800 tracking-tight">Fuzzy</span>
           <span className="absolute right-[-12%] top-[62%] text-[13px] font-bold text-gray-800 tracking-tight">Unreliable</span>
        </div>

        <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="ringGradient" cx="50%" cy="100%" r="100%">
              <stop offset="0%" stopColor="#81c784" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#66bb6a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4caf50" stopOpacity="0.8" />
            </radialGradient>
            
            <filter id="needleGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Основная залитая область */}
          <path
            d={`
              M ${x1},${CY} 
              A ${mainArcRadius},${mainArcRadius} 0 0,1 ${x2},${CY} 
              L ${ix2},${CY} 
              A ${mainArcInnerRadius},${mainArcInnerRadius} 0 0,0 ${ix1},${CY} 
              Z
            `}
            fill="url(#ringGradient)"
            className="transition-all duration-700"
          />

          {/* Внешние цветные линии (подняты выше за счет увеличенного outerRadius) */}
          {/* Зеленая (0-33%) */}
          <path 
            d={`M ${CX - outerRadius},${CY} A ${outerRadius},${outerRadius} 0 0,1 110,40`} 
            fill="none" 
            stroke="#27ae60" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />
          {/* Желтая (33-66%) */}
          <path 
            d={`M 125,32 A ${outerRadius},${outerRadius} 0 0,1 275,32`} 
            fill="none" 
            stroke="#f1c40f" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />
          {/* Красная (66-100%) */}
          <path 
            d={`M 290,40 A ${outerRadius},${outerRadius} 0 0,1 ${CX + outerRadius},${CY}`} 
            fill="none" 
            stroke="#c0392b" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />

          {/* Деления (Ticks) */}
          <g transform={`translate(${CX}, ${CY})`}>
            {ticks.map((tick, i) => (
              <line
                key={i}
                x1={mainArcRadius - 8} 
                y1={0}
                x2={mainArcRadius}     
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
            transform={`translate(${CX}, ${CY}) rotate(${needleRotation})`} 
            style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <path
              d="M -3.5,-15 L 0,-205 L 3.5,-15 Z"
              fill="#1e293b"
              filter="url(#needleGlow)"
            />
          </g>

          {/* Центральный узел */}
          <circle cx={CX} cy={CY} r="18" fill="#1e293b" />
          <circle cx={CX} cy={CY} r="7" fill="#475569" />
        </svg>
      </div>

      {/* Индикация значения */}
      <div className="mt-20 text-center">
        <div className="flex items-center justify-center gap-3">
           <div className={`w-4 h-4 rounded-full animate-pulse shadow-sm ${
            level === ReliabilityLevel.RELIABLE ? 'bg-green-500 shadow-green-200' :
            level === ReliabilityLevel.FUZZY ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-500 shadow-red-200'
          }`} />
           <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{normalizedValue}%</span>
        </div>
        <p className="mt-3 text-sm font-bold text-slate-400 uppercase tracking-[0.25em]">{level} Score</p>
        
        <div className="max-w-[340px] pt-8 border-t border-slate-100 mt-10">
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
