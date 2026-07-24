import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useApp } from '../../context/AppContext';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, toggleFavorite } = usePlayer();
  const { setActiveScreen } = useApp();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-14 left-2 right-2 z-30 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl flex items-center justify-between transition-all hover:bg-zinc-900">
      {/* Clickable Track Info (Expands Full Now Playing Screen) */}
      <div
        onClick={() => setActiveScreen('now-playing')}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer pr-2"
        id="btn-expand-now-playing"
      >
        <img
          src={currentTrack.artworkUrl}
          alt={currentTrack.title}
          className={`w-10 h-10 rounded-xl object-cover border border-zinc-700/50 shadow-md ${isPlaying ? 'animate-pulse' : ''}`}
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-white truncate">{currentTrack.title}</h4>
          <p className="text-[10px] text-zinc-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className="p-1.5 text-zinc-400 hover:text-red-400 transition"
          title="Favorite Track"
          id="btn-mini-favorite"
        >
          <Heart className={`w-4 h-4 ${currentTrack.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        <button
          onClick={togglePlayPause}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-900/30 transition"
          id="btn-mini-play-pause"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        <button
          onClick={nextTrack}
          className="p-1.5 text-zinc-400 hover:text-white transition"
          id="btn-mini-next"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
