import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useApp } from '../../context/AppContext';
import { VisualizerCanvas } from './VisualizerCanvas';
import { LyricsModal } from './LyricsModal';
import { QueueDrawer } from './QueueDrawer';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Heart,
  FileText,
  ListMusic,
  Sliders,
  RotateCcw,
  RotateCw,
  Clock,
  Gauge,
  Share2,
  Headphones
} from 'lucide-react';

export const NowPlayingScreen: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    shuffleMode,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    toggleFavorite,
    playbackSpeed,
    setPlaybackSpeed,
    setLyricsOpen,
    setQueueOpen
  } = usePlayer();

  const { setActiveScreen, showToast } = useApp();

  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);

  if (!currentTrack) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p className="text-sm">No track selected. Select a song from your library.</p>
        <button
          onClick={() => setActiveScreen('library')}
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-full font-bold shadow-md shadow-blue-900/30"
        >
          Go to Library
        </button>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const setSleepTimer = (mins: number | null) => {
    setTimerMinutes(mins);
    if (mins) {
      showToast(`Sleep timer set for ${mins} minutes`);
    } else {
      showToast('Sleep timer disabled');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 opacity-25 blur-3xl pointer-events-none scale-125 transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentTrack.artworkUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2 pb-4 border-b border-zinc-800">
        <button
          onClick={() => setActiveScreen('home')}
          className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700/50 transition"
          id="btn-close-now-playing"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
              <Headphones className="w-2.5 h-2.5" />
              Background & Lock Screen Active
            </p>
          </div>
          <p className="text-xs font-bold text-white truncate max-w-[200px]">{currentTrack.album}</p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText?.(`${currentTrack.title} by ${currentTrack.artist}`);
            showToast('Song info copied to clipboard');
          }}
          className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700/50 transition"
        >
          <Share2 className="w-4 h-4 text-zinc-300" />
        </button>
      </div>

      {/* Album Artwork & Visualizer */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.25)] border border-zinc-700/50 group">
          <img
            src={currentTrack.artworkUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-blue-300 border border-zinc-700/50">
            {currentTrack.format} • {currentTrack.bitrate}kbps
          </div>
        </div>

        {/* Realtime Audio Spectrum Visualizer */}
        <div className="w-full max-w-sm mt-5">
          <VisualizerCanvas mode="bars" />
        </div>
      </div>

      {/* Song Info & Favorite */}
      <div className="relative z-10 flex items-center justify-between px-2 my-2">
        <div className="min-w-0 flex-1 pr-3">
          <h2 className="text-xl font-bold text-white truncate">{currentTrack.title}</h2>
          <p className="text-sm text-zinc-400 truncate mt-0.5">{currentTrack.artist}</p>
        </div>

        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-full text-zinc-300 border border-zinc-700/50 transition"
          id="btn-nowplaying-favorite"
        >
          <Heart className={`w-6 h-6 ${currentTrack.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Progress Timeline Slider */}
      <div className="relative z-10 my-2 px-1">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={e => seekTo(parseFloat(e.target.value))}
          className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
          id="slider-timeline"
        />
        <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Transport Controls */}
      <div className="relative z-10 flex items-center justify-between px-3 my-2">
        <button
          onClick={toggleShuffle}
          className={`p-2.5 rounded-full transition ${shuffleMode !== 'off' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-zinc-400 hover:text-white'}`}
          title="Shuffle"
          id="btn-nowplaying-shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={() => seekTo(Math.max(0, currentTime - 10))}
          className="p-2 text-zinc-400 hover:text-white transition"
          title="Rewind 10s"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button onClick={prevTrack} className="p-3 text-zinc-200 hover:text-white transition">
          <SkipBack className="w-7 h-7" />
        </button>

        <button
          onClick={togglePlayPause}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-600/40 transition transform active:scale-95"
          id="btn-nowplaying-playpause"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white ml-1" />}
        </button>

        <button onClick={nextTrack} className="p-3 text-zinc-200 hover:text-white transition">
          <SkipForward className="w-7 h-7" />
        </button>

        <button
          onClick={() => seekTo(Math.min(duration, currentTime + 10))}
          className="p-2 text-zinc-400 hover:text-white transition"
          title="Forward 10s"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleRepeat}
          className={`p-2.5 rounded-full transition ${repeatMode !== 'off' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-zinc-400 hover:text-white'}`}
          title="Repeat Mode"
          id="btn-nowplaying-repeat"
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Tool Icons Bar */}
      <div className="relative z-10 flex items-center justify-around pt-3 border-t border-zinc-800 text-xs text-zinc-400">
        <button
          onClick={() => setLyricsOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-white transition"
          id="btn-trigger-lyrics"
        >
          <FileText className="w-5 h-5 text-blue-400" />
          <span className="text-[10px]">Lyrics</span>
        </button>

        <button
          onClick={() => setQueueOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-white transition"
          id="btn-trigger-queue"
        >
          <ListMusic className="w-5 h-5 text-blue-400" />
          <span className="text-[10px]">Queue</span>
        </button>

        <button
          onClick={() => setActiveScreen('audio-lab')}
          className="flex flex-col items-center gap-1 hover:text-white transition"
          id="btn-trigger-eq"
        >
          <Sliders className="w-5 h-5 text-amber-400" />
          <span className="text-[10px]">Equalizer</span>
        </button>

        <button
          onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
          className="flex flex-col items-center gap-1 hover:text-white transition relative"
          id="btn-trigger-speed"
        >
          <Gauge className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px]">{playbackSpeed}x Speed</span>

          {speedMenuOpen && (
            <div className="absolute bottom-12 bg-zinc-900 border border-zinc-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-50 min-w-[100px]">
              {speeds.map(s => (
                <button
                  key={s}
                  onClick={e => {
                    e.stopPropagation();
                    setPlaybackSpeed(s);
                    setSpeedMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left text-xs font-mono font-bold transition ${
                    playbackSpeed === s ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </button>

        <button
          onClick={() => setSleepTimer(timerMinutes ? null : 30)}
          className={`flex flex-col items-center gap-1 transition ${timerMinutes ? 'text-blue-400' : 'hover:text-white'}`}
          id="btn-trigger-timer"
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">{timerMinutes ? `${timerMinutes}m` : 'Sleep'}</span>
        </button>
      </div>

      <LyricsModal />
      <QueueDrawer />
    </div>
  );
};
