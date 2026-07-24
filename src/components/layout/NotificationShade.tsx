import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { X, Play, Pause, SkipForward, SkipBack, Headphones, Sliders, Volume2, ShieldCheck, Wifi, Bluetooth } from 'lucide-react';

export const NotificationShade: React.FC = () => {
  const { notificationShadeOpen, setNotificationShadeOpen, setActiveScreen } = useApp();
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack, volume, setVolume } = usePlayer();

  if (!notificationShadeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col p-4 text-white overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-300">Quick Settings & Notifications</span>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-mono">One UI 7 Media</span>
        </div>
        <button
          onClick={() => setNotificationShadeOpen(false)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
          id="btn-close-notification-shade"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Toggles Grid */}
      <div className="grid grid-cols-4 gap-3 my-4">
        <div className="bg-violet-600/30 border border-violet-500/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <Wifi className="w-5 h-5 text-violet-400 mb-1" />
          <span className="text-[10px] font-semibold">Wi-Fi 7</span>
        </div>
        <div className="bg-blue-600/30 border border-blue-500/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <Bluetooth className="w-5 h-5 text-blue-400 mb-1" />
          <span className="text-[10px] font-semibold">Buds3 Pro</span>
        </div>
        <button
          onClick={() => {
            setNotificationShadeOpen(false);
            setActiveScreen('audio-lab');
          }}
          className="bg-neutral-800/80 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/10 transition"
        >
          <Sliders className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-[10px] font-semibold">Audio Lab</span>
        </button>
        <button
          onClick={() => {
            setNotificationShadeOpen(false);
            setActiveScreen('private-vault');
          }}
          className="bg-neutral-800/80 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/10 transition"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
          <span className="text-[10px] font-semibold">Vault</span>
        </button>
      </div>

      {/* Active Samsung MediaSession Player Card */}
      {currentTrack ? (
        <div className="bg-neutral-900/90 border border-white/15 rounded-3xl p-4 shadow-2xl my-2">
          <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-white">Media Output: Galaxy Buds3 Pro</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">LDAC 990kbps</span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate text-white">{currentTrack.title}</h3>
              <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
              <p className="text-[10px] text-violet-400 mt-1 font-mono">{currentTrack.format} • {currentTrack.bitrate} kbps</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-white/10">
            <button onClick={prevTrack} className="p-2 text-neutral-300 hover:text-white transition">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-11 h-11 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-neutral-300 hover:text-white transition">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 mt-4 px-2">
            <Volume2 className="w-4 h-4 text-neutral-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-full accent-violet-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 text-center text-neutral-400 my-2">
          <p className="text-xs">No media currently playing</p>
        </div>
      )}
    </div>
  );
};
