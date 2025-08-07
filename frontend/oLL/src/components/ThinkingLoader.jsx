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
      {/* Box with moving border */}
      <div className="relative w-16 h-12 rounded-lg bg-gray-800/50 border-2 border-transparent overflow-hidden">
        {/* Moving border gradient */}
        <div 
          className="absolute inset-0 rounded-lg p-[2px] animate-[rotateBorder_2s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, #8B5CF6, #EAB308, #EF4444, #8B5CF6)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor'
          }}
        >
          {/* Inner transparent area */}
          <div className="w-full h-full bg-gray-900 rounded-md"></div>
        </div>
      </div>

      {text && (
        <div className="text-purple-400 text-sm font-medium opacity-80 animate-[pulse_2s_ease-in-out_infinite]">
          {text}
        </div>
      )}

      <style jsx>{`

        @keyframes rotateBorder {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ThinkingLoader;
