import React from "react";

export default function ThinkingLoader() {
  return (
    <div
      className="relative rounded-[20px] box-border blur-[12px] animate-pulse-loader"
      style={{
        height: "80px",
        aspectRatio: "1",
        padding: "10px",
        mask: "conic-gradient(#000 0 0) content-box exclude, conic-gradient(#000 0 0)",
        WebkitMask:
          "conic-gradient(#000 0 0) content-box exclude, conic-gradient(#000 0 0)",
      }}
    >
      <div
        className="absolute inset-0 animate-spin-loader"
        style={{
          background:
            "repeating-conic-gradient(#0000 0 5%, #C02942, #0000 20% 50%)",
        }}
      ></div>
    </div>
  );
}

