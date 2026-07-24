import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { Sparkles, Play, Navigation, Sliders, Music, Film, Flame, ShieldCheck, DownloadCloud } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { tracks, videos, tripPacks, setActiveScreen } = useApp();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const favoriteTracks = tracks.filter(t => t.isFavorite);
  const activeTrip = tripPacks[0];

  return (
    <div className="space-y-5 pb-6">
      <OneUIHeader title="Nova Music" subtitle="One UI 7 Flagship Audio Ecosystem" />

      {/* Flagship Welcome & Status Card */}
      <div className="mx-4 p-4 rounded-[32px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30">
            OFFLINE ENGINE ACTIVE
          </span>
          <span className="text-xs text-zinc-400 font-mono">1.2 GB Storage Used</span>
        </div>

        <h2 className="text-lg font-bold text-white">Good Morning, Hamza</h2>
        <p className="text-xs text-zinc-300 mt-1">Ready for high-resolution 24-bit audio listening?</p>

        {/* Quick Launch Action Pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-800">
          <button
            onClick={() => setActiveScreen('mood-engine')}
            className="flex items-center justify-center gap-1.5 p-2 bg-zinc-800/80 hover:bg-zinc-800 rounded-2xl border border-zinc-700/50 text-xs font-semibold text-blue-300 transition"
            id="btn-home-quick-mood"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Mood AI</span>
          </button>

          <button
            onClick={() => setActiveScreen('trip-packs')}
            className="flex items-center justify-center gap-1.5 p-2 bg-zinc-800/80 hover:bg-zinc-800 rounded-2xl border border-zinc-700/50 text-xs font-semibold text-emerald-300 transition"
            id="btn-home-quick-trip"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Trip Pack</span>
          </button>

          <button
            onClick={() => setActiveScreen('audio-lab')}
            className="flex items-center justify-center gap-1.5 p-2 bg-zinc-800/80 hover:bg-zinc-800 rounded-2xl border border-zinc-700/50 text-xs font-semibold text-amber-300 transition"
            id="btn-home-quick-eq"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Equalizer</span>
          </button>
        </div>
      </div>

      {/* Active Trip Pack Progress Widget */}
      {activeTrip && (
        <div className="mx-4 p-4 rounded-[28px] bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Active Trip Pack: {activeTrip.title}</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{activeTrip.progressPercentage}% Synced</span>
          </div>

          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden my-2">
            <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full transition-all duration-500" style={{ width: `${activeTrip.progressPercentage}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-400">
            <span>{activeTrip.activity} • {activeTrip.currentSizeMB} MB</span>
            <button
              onClick={() => setActiveScreen('trip-packs')}
              className="text-blue-400 hover:underline font-semibold"
            >
              Manage Pack →
            </button>
          </div>
        </div>
      )}

      {/* Quick Launch Category Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">Ecosystem Navigation</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveScreen('library')}
            className="p-3.5 bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 rounded-[24px] flex items-center gap-3 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Library</h4>
              <p className="text-[10px] text-zinc-400">{tracks.length} Scanned Tracks</p>
            </div>
          </button>

          <button
            onClick={() => setActiveScreen('music-videos')}
            className="p-3.5 bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 rounded-[24px] flex items-center gap-3 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Music Videos</h4>
              <p className="text-[10px] text-zinc-400">{videos.length} Videos Available</p>
            </div>
          </button>

          <button
            onClick={() => setActiveScreen('download-assistant')}
            className="p-3.5 bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 rounded-[24px] flex items-center gap-3 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Smart Match</h4>
              <p className="text-[10px] text-zinc-400">Offline Assistant</p>
            </div>
          </button>

          <button
            onClick={() => setActiveScreen('private-vault')}
            className="p-3.5 bg-zinc-900/80 border border-zinc-800 hover:border-red-500/50 rounded-[24px] flex items-center gap-3 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Private Vault</h4>
              <p className="text-[10px] text-zinc-400">Biometric Protected</p>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Songs Horizontal Carousel */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Favorites & High Bitrate</h3>
          </div>
          <button onClick={() => setActiveScreen('library')} className="text-xs text-blue-400 font-semibold hover:underline">
            See All →
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {favoriteTracks.map(track => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, tracks)}
                className="flex-shrink-0 w-36 bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-2.5 cursor-pointer transition group"
              >
                <div className="relative w-31 h-31 rounded-xl overflow-hidden mb-2">
                  <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </button>
                  <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-blue-300">
                    {track.format}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
