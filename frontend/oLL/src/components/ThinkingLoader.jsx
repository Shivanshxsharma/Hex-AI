import React from 'react';

const ThinkingLoader = ({
  text = "Thinking...",
  className = ""
}) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative px-6 py-3 bg-[#2e2e2e] backdrop-blur-sm rounded-2xl border border-gray-800/50">
        {/* Animated border segments */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {/* Top segment */}
          <div 
            className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
            style={{
              width: '0%',
              animation: 'drawTop 2s ease-in-out infinite'
            }}
          />
          {/* Right segment */}
          <div 
            className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full"
            style={{
              height: '0%',
              animation: 'drawRight 2s ease-in-out infinite 0.5s'
            }}
          />
          {/* Bottom segment */}
          <div 
            className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-cyan-500 to-emerald-500 rounded-full"
            style={{
              width: '0%',
              animation: 'drawBottom 2s ease-in-out infinite 1s'
            }}
          />
          {/* Left segment */}
          <div 
            className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-emerald-500 to-violet-500 rounded-full"
            style={{
              height: '0%',
              animation: 'drawLeft 2s ease-in-out infinite 1.5s'
            }}
          />
        </div>
        
        {/* Text with subtle glow */}
        <div className="relative text-gray-300 text-sm font-light tracking-wide">
          <span className="animate-pulse">{text}</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes drawTop {
          0%, 25% { width: 0%; opacity: 0.3; }
          12.5% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0.1; }
        }
        
        @keyframes drawRight {
          0%, 25% { height: 0%; opacity: 0.3; }
          12.5% { height: 100%; opacity: 1; }
          100% { height: 100%; opacity: 0.1; }
        }
        
        @keyframes drawBottom {
          0%, 25% { width: 0%; opacity: 0.3; }
          12.5% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0.1; }
        }
        
        @keyframes drawLeft {
          0%, 25% { height: 0%; opacity: 0.3; }
          12.5% { height: 100%; opacity: 1; }
          100% { height: 100%; opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default ThinkingLoader;
