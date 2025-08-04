import React, { useState, useEffect } from 'react';

// Base Loader Component
const BaseLoader = ({ 
  width = 150, 
  height = 80, 
  strokeWidth = 8, 
  text = "Loading...",
  className = "",
  children 
}) => {
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="transition-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="25%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="75%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {children}
        </svg>
      </div>
      
      {text && (
        <div className="text-cyan-400 text-sm font-medium opacity-80 animate-[textPulse_2s_ease-in-out_infinite]">
          {text}
        </div>
      )}
    </div>
  );
};

// Wave Loader
export const WaveLoader = (props) => {
  const { width = 150, height = 80, strokeWidth = 8 } = props;
  const centerY = height / 2;
  const wavePathData = `M${width * 0.05},${centerY} Q${width * 0.2},${height * 0.15} ${width * 0.35},${centerY} T${width * 0.65},${centerY} T${width * 0.95},${centerY}`;
  
  return (
    <BaseLoader {...props}>
      <path
        d={wavePathData}
        fill="none"
        stroke="url(#transition-gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="300"
        strokeDashoffset="300"
        className="animate-[drawWave_2.5s_ease-in-out_infinite]"
      />
      <style jsx>{`
        @keyframes drawWave {
          0% { stroke-dashoffset: 300; opacity: 0.4; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -300; opacity: 0.4; }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </BaseLoader>
  );
};

// Pulse Loader
export const PulseLoader = (props) => {
  const { width = 150, height = 80, strokeWidth = 8 } = props;
  const centerX = width / 2;
  const centerY = height / 2;
  const pulseRadius = Math.min(width, height) * 0.15;
  
  return (
    <BaseLoader {...props}>
      <circle
        cx={centerX}
        cy={centerY}
        r={pulseRadius}
        fill="none"
        stroke="url(#transition-gradient)"
        strokeWidth={strokeWidth}
        className="animate-[pulsing_2s_ease-in-out_infinite]"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={pulseRadius * 1.5}
        fill="none"
        stroke="url(#transition-gradient)"
        strokeWidth={strokeWidth / 2}
        opacity="0.6"
        className="animate-[pulsing_2s_ease-in-out_infinite] [animation-delay:0.5s]"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={pulseRadius * 2}
        fill="none"
        stroke="url(#transition-gradient)"
        strokeWidth={strokeWidth / 3}
        opacity="0.3"
        className="animate-[pulsing_2s_ease-in-out_infinite] [animation-delay:1s]"
      />
      <style jsx>{`
        @keyframes pulsing {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </BaseLoader>
  );
};

// Spiral Loader
export const SpiralLoader = (props) => {
  const { width = 150, height = 80, strokeWidth = 8 } = props;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.15;
  const spiralPathData = `M${centerX},${centerY} m-${radius * 2},0 a${radius * 2},${radius * 2} 0 1,1 ${radius * 4},0 a${radius * 1.5},${radius * 1.5} 0 1,1 -${radius * 3},0 a${radius},${radius} 0 1,1 ${radius * 2},0`;
  
  return (
    <BaseLoader {...props}>
      <g className="animate-[spiralRotate_3s_ease-in-out_infinite]" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
        <path
          d={spiralPathData}
          fill="none"
          stroke="url(#transition-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="200"
          strokeDashoffset="200"
          className="animate-[drawSpiral_3s_ease-in-out_infinite]"
        />
      </g>
      <style jsx>{`
        @keyframes drawSpiral {
          0% { stroke-dashoffset: 200; opacity: 0.4; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -200; opacity: 0.4; }
        }
        @keyframes spiralRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </BaseLoader>
  );
};

// Dots Loader
export const DotsLoader = (props) => {
  const { width = 150, height = 80, strokeWidth = 8 } = props;
  const centerY = height / 2;
  
  return (
    <BaseLoader {...props}>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={width * (0.15 + i * 0.175)}
          cy={centerY}
          r={strokeWidth}
          fill="url(#transition-gradient)"
          className="animate-[dotBounce_1.5s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <style jsx>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          40% { transform: translateY(-15px) scale(1.3); opacity: 1; }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </BaseLoader>
  );
};

// Zigzag Loader (Original from user's code)
export const ZigzagLoader = ({ 
  width = 120, 
  height = 60, 
  strokeWidth = 6, 
  text = "AI is thinking...",
  className = "" 
}) => {
  const viewBoxWidth = width;
  const viewBoxHeight = height;
  const centerY = viewBoxHeight / 2;
  
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
          0% { stroke-dashoffset: 200; opacity: 0.5; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -200; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// Bars Loader
export const BarsLoader = (props) => {
  const { width = 150, height = 80, strokeWidth = 8 } = props;
  const barWidth = width / 8;
  const centerY = height / 2;
  
  return (
    <BaseLoader {...props}>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={width * (0.1 + i * 0.2)}
          y={centerY - 15}
          width={barWidth}
          height={30}
          fill="url(#transition-gradient)"
          className="animate-[barStretch_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <style jsx>{`
        @keyframes barStretch {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </BaseLoader>
  );
};

// Ring Loader
export const RingLoader = (props) => {
  const { width = 150, height = 80, strokeWidth = 8 } = props;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.25;
  
  return (
    <BaseLoader {...props}>
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="url(#transition-gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="157"
        strokeDashoffset="157"
        className="animate-[drawRing_2s_ease-in-out_infinite]"
        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
      />
      <style jsx>{`
        @keyframes drawRing {
          0% { 
            stroke-dashoffset: 157; 
            transform: rotate(0deg); 
            opacity: 0.4; 
          }
          50% { 
            stroke-dashoffset: 0; 
            transform: rotate(180deg); 
            opacity: 1; 
          }
          100% { 
            stroke-dashoffset: -157; 
            transform: rotate(360deg); 
            opacity: 0.4; 
          }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </BaseLoader>
  );
};

// Demo Component
const LoadersDemo = () => {
  const [currentLoader, setCurrentLoader] = useState(0);
  
  const loaders = [
    { component: WaveLoader, name: 'Wave', props: { text: 'Wave loading...' } },
    { component: PulseLoader, name: 'Pulse', props: { text: 'Pulse loading...' } },
    { component: SpiralLoader, name: 'Spiral', props: { text: 'Spiral loading...' } },
    { component: DotsLoader, name: 'Dots', props: { text: 'Dots loading...' } },
    { component: ZigzagLoader, name: 'Zigzag', props: { text: 'Zigzag loading...', width: 150, height: 80, strokeWidth: 8 } },
    { component: BarsLoader, name: 'Bars', props: { text: 'Bars loading...' } },
    { component: RingLoader, name: 'Ring', props: { text: 'Ring loading...' } }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoader(prev => (prev + 1) % loaders.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const CurrentLoaderComponent = loaders[currentLoader].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Page Transition Loaders Collection
        </h1>
        <p className="text-slate-300 text-lg">
          7 Different animated loaders - All exported separately
        </p>
      </div>
      
      {/* Main loader display */}
      <div className="mb-16 p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="mb-4 text-center">
          <span className="text-white font-semibold text-lg">
            {loaders[currentLoader].name} Loader
          </span>
        </div>
        <CurrentLoaderComponent
          {...loaders[currentLoader].props}
          width={180}
          height={100}
          strokeWidth={10}
        />
      </div>
      
      {/* Loader selector */}
      <div className="flex gap-2 mb-12 flex-wrap justify-center max-w-4xl">
        {loaders.map((loader, index) => (
          <button
            key={loader.name}
            onClick={() => setCurrentLoader(index)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
              currentLoader === index
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {loader.name}
          </button>
        ))}
      </div>
      
      {/* All loaders showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
        {loaders.map((loader, index) => {
          const LoaderComponent = loader.component;
          return (
            <div key={loader.name} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3 text-center text-sm">
                {loader.name} Loader
              </h3>
              <LoaderComponent
                {...loader.props}
                width={120}
                height={60}
                strokeWidth={6}
              />
            </div>
          );
        })}
      </div>
      
      {/* Usage info */}
      <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 max-w-4xl">
        <h3 className="text-white font-semibold mb-3">Import Usage:</h3>
        <div className="space-y-2">
          <code className="text-cyan-300 text-xs block bg-black/50 p-3 rounded-lg">
            {`import { WaveLoader, PulseLoader, SpiralLoader, DotsLoader, ZigzagLoader, BarsLoader, RingLoader } from './LoadersFile';`}
          </code>
          <code className="text-cyan-300 text-xs block bg-black/50 p-3 rounded-lg">
            {`<WaveLoader text="Loading..." width={150} height={80} strokeWidth={8} />`}
          </code>
        </div>
      </div>
    </div>
  );
};

export default LoadersDemo;