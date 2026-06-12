import React from 'react'
import { SignOutButton } from "@clerk/clerk-react";
import { Link } from 'react-router';
import { Key, LogOut, RefreshCw } from 'lucide-react';

function Apikeypopup({ apikeyfound }) {
  return (
    <div style={{
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      transform: !apikeyfound ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
      opacity: !apikeyfound ? 1 : 0,
    }}
      className='w-[90%] max-w-[420px] p-8 rounded-3xl flex flex-col shadow-2xl border border-zinc-800/80 shadow-black/80 bg-zinc-950/90 backdrop-blur-xl z-30 text-center items-center gap-6 relative'>
      
      {/* Icon Accent */}
      <div className='w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500 shadow-inner'>
        <Key size={22} className="animate-pulse" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className='text-xl font-bold text-white tracking-tight'>API Key Required</h2>
        <p className='text-zinc-400 text-sm leading-relaxed px-2'>
          To use Owl AI, you need to configure your Gemini API Key. Click below to add your key or sign out if you want to switch accounts.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-2">
        <Link to="/configure_keys" className="w-full">
          <button className='w-full py-3 px-5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer'>
            <Key size={16} />
            Set Gemini API Key
          </button>
        </Link>
        
        <SignOutButton>
          <button className='w-full py-3 px-5 text-sm font-semibold text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 rounded-2xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer'>
            <LogOut size={16} />
            Sign Out
          </button>
        </SignOutButton>
      </div>

      <button 
        onClick={() => window.location.reload()} 
        className='mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-150 flex items-center gap-1.5 focus:outline-none cursor-pointer'
      >
        <RefreshCw size={12} />
        Already set? Click to refresh
      </button>

    </div>
  )
}

export default Apikeypopup