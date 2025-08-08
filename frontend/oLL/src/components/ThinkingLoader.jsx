export default function ThinkingLoader({ size = 20, color = "#000", className = "" }) {
  const keyframes = `
    @keyframes pulse-animation {
      100% { box-shadow: 0 0 0 ${size * 1.5}px transparent }
    }
  `;

  const loaderStyle = {
    width: `${size}px`,
    aspectRatio: "1",
    borderRadius: "50%",
    background: color,
    boxShadow: `0 0 0 0 ${color}4`,
    animation: "pulse-animation 1s infinite",
  };

  return (
    <div className={className}>
      <style>{keyframes}</style>
      <div style={loaderStyle} />
    </div>
  );
}

// Example usage with different configurations
function PulseLoaderDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-8">
      <div className="text-center">
        <h2 className="text-black text-2xl mb-4">Default Pulse Loader</h2>
        <PulseLoader />
      </div>
      
      <div className="text-center">
        <h2 className="text-black text-2xl mb-4">Large Blue Pulse</h2>
        <PulseLoader size={40} color="#3b82f6" />
      </div>
      
      <div className="text-center">
        <h2 className="text-black text-2xl mb-4">Medium Green Pulse</h2>
        <PulseLoader size={30} color="#10b981" />
      </div>
      
      <div className="text-center">
        <h2 className="text-black text-2xl mb-4">Small Red Pulse</h2>
        <PulseLoader size={25} color="#ef4444" />
      </div>
      
      <div className="text-center">
        <h2 className="text-black text-2xl mb-4">Custom Purple</h2>
        <PulseLoader size={35} color="#8b5cf6" />
      </div>
    </div>
  );
}
