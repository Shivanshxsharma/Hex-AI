import React from 'react';

const ThinkingLoader = ({ 
  width = 120, 
  height = 60, 
  strokeWidth = 6, 
  text = "AI is thinking...",
  className = "" 
}) => {
  const viewBoxWidth = width;
  const viewBoxHeight = height;
  const centerY = viewBoxHeight / 2;
  
  // Calculate zigzag path with 3 peaks
  const pathData = `M${width * 0.08},${centerY} L${width * 0.25},${height * 0.17} L${width * 0.42},${centerY} L${width * 0.58},${height * 0.17} L${width * 0.75},${centerY} L${width * 0.92},${height * 0.17}`;

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="zigzag-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path
            d={pathData}
            fill="none"
            stroke="url(#zigzag-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="200"
            strokeDashoffset="200"
            className="animate-[drawZigzag_2s_ease-in-out_infinite]"
          />
        </svg>
      </div>
      {text && (
        <div className="text-purple-400 text-sm font-medium opacity-80 animate-[pulse_2s_ease-in-out_infinite]">
          {text}
        </div>
      )}
      
      <style jsx>{`
        @keyframes drawZigzag {
          0% {
            stroke-dashoffset: 200;
            opacity: 0.5;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -200;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ThinkingLoader;
