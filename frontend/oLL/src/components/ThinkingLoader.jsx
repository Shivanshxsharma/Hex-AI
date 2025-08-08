export default function ThinkingLoader({ size = 20, color = "#fff", className = "" }) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 gap-8">
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Default Pulse Loader</h2>
        <ThinkingLoader />
      </div>
      
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Large White Pulse</h2>
        <ThinkingLoader size={40} color="#fff" />
      </div>
      
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Medium White Pulse</h2>
        <ThinkingLoader size={30} color="#fff" />
      </div>
      
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Small White Pulse</h2>
        <ThinkingLoader size={25} color="#fff" />
      </div>
      
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4">Custom Light Gray</h2>
        <ThinkingLoader size={35} color="#f3f4f6" />
      </div>
    </div>
  );
}
