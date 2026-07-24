import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Signal, Battery, Maximize2, Minimize2, Smartphone } from 'lucide-react';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceFrame, setDeviceFrame, toastMessage } = useApp();

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  if (deviceFrame === 'fullscreen') {
    return (
      <div className="min-h-screen bg-black text-white relative font-sans flex flex-col">
        <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Nova Music</span>
            <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-blue-500/30">One UI 7</span>
          </div>
          <button
            onClick={() => setDeviceFrame('galaxy')}
            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-white px-2.5 py-1 rounded-full text-xs transition"
            id="btn-toggle-galaxy-frame"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Galaxy S25 View</span>
          </button>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto pb-28">{children}</main>

        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 border border-blue-500/30 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs flex items-center gap-2 backdrop-blur-md animate-bounce">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-2 sm:p-6 text-white font-sans">
      <div className="w-full max-w-sm sm:max-w-md h-[92vh] max-h-[920px] bg-black border-[6px] border-zinc-800 rounded-[48px] shadow-[0_0_60px_rgba(59,130,246,0.18)] flex flex-col relative overflow-hidden ring-1 ring-zinc-700/50">
        
        {/* Galaxy S25 Camera Notch Cutout */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-28 h-5 bg-zinc-900 rounded-full flex items-center justify-center gap-2 px-3 border border-zinc-800">
          <div className="w-2.5 h-2.5 rounded-full bg-black border border-zinc-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500/80"></div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
        </div>

        {/* Galaxy Status Bar */}
        <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-medium text-zinc-300 z-40 select-none">
          <span>{currentTimeStr}</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">98%</span>
              <Battery className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Device Frame View Mode Switcher Header */}
        <div className="px-4 py-1.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between z-40">
          <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Nova Music • Galaxy Edition</span>
          <button
            onClick={() => setDeviceFrame('fullscreen')}
            className="text-[10px] flex items-center gap-1 text-zinc-400 hover:text-white transition"
            id="btn-toggle-fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Full Layout</span>
          </button>
        </div>

        {/* Screen Content Container */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar pb-24">
          {children}
        </div>

        {/* Toast Notification Floating Banner */}
        {toastMessage && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 border border-violet-500/40 text-white px-4 py-2 rounded-full shadow-2xl text-[11px] flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Android Gesture Navigation Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50 w-32 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
};
