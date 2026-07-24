import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, EqualizerSettings } from '../types/music';
import { audioEngine } from '../services/audioEngine';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  shuffleMode: 'off' | 'all' | 'smart';
  repeatMode: 'off' | 'one' | 'all';
  queue: Track[];
  queueIndex: number;
  history: Track[];
  equalizerSettings: EqualizerSettings;
  lyricsOpen: boolean;
  queueOpen: boolean;

  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (timeSeconds: number) => void;
  setVolume: (vol: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (trackId: string) => void;
  updateEqualizer: (newSettings: Partial<EqualizerSettings>) => void;
  setLyricsOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  addToQueue: (track: Track) => void;
  getVisualizerData: () => Uint8Array;
  getWaveformData: () => Uint8Array;
}

const DEFAULT_EQ: EqualizerSettings = {
  enabled: true,
  preset: 'Rock',
  bands: [
    { frequency: 60, label: '60Hz', gain: 4 },
    { frequency: 230, label: '230Hz', gain: 2 },
    { frequency: 910, label: '910Hz', gain: 0 },
    { frequency: 4000, label: '4kHz', gain: 3 },
    { frequency: 14000, label: '14kHz', gain: 5 }
  ],
  bassBoost: 45,
  trebleBoost: 25,
  crossfadeSeconds: 2,
  gaplessPlayback: true,
  volumeNormalization: true,
  playbackSpeed: 1.0
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const SILENT_WAV_URI = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolumeState] = useState(0.85);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1.0);
  const [shuffleMode, setShuffleMode] = useState<'off' | 'all' | 'smart'>('off');
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('all');
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [history, setHistory] = useState<Track[]>([]);
  const [equalizerSettings, setEqualizerSettings] = useState<EqualizerSettings>(DEFAULT_EQ);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element with background audio properties
  useEffect(() => {
    const audio = new Audio();
    audio.playsInline = true;
    audio.preload = 'auto';
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('x-webkit-airplay', 'allow');
    audioRef.current = audio;

    audioEngine.init(audio);
    audioEngine.applyEqualizerSettings(equalizerSettings);

    const handleTimeUpdate = () => {
      if (audio.src && !audio.src.startsWith('data:audio/wav')) {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audioEngine.stopSyntheticDemoTrack();
    };
  }, [repeatMode]);

  // Handle document visibility change and Screen WakeLock for background playback
  useEffect(() => {
    let wakeLockObj: any = null;

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isPlaying) {
        try {
          wakeLockObj = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          // Wake Lock fallback
        }
      }
    };

    if (isPlaying) {
      requestWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        requestWakeLock();
        audioEngine.init(audioRef.current || undefined);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockObj) {
        wakeLockObj.release().catch(() => {});
      }
    };
  }, [isPlaying]);

  // Update MediaSession lock screen controls & metadata
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album || 'Nova Music',
          artwork: [
            { src: currentTrack.artworkUrl, sizes: '96x96', type: 'image/jpeg' },
            { src: currentTrack.artworkUrl, sizes: '128x128', type: 'image/jpeg' },
            { src: currentTrack.artworkUrl, sizes: '192x192', type: 'image/jpeg' },
            { src: currentTrack.artworkUrl, sizes: '256x256', type: 'image/jpeg' },
            { src: currentTrack.artworkUrl, sizes: '384x384', type: 'image/jpeg' },
            { src: currentTrack.artworkUrl, sizes: '512x512', type: 'image/jpeg' }
          ]
        });

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        const setAction = (action: MediaSessionAction, handler: ((details: any) => void) | null) => {
          try {
            navigator.mediaSession.setActionHandler(action, handler);
          } catch (e) {
            // Ignore unsupported actions
          }
        };

        setAction('play', () => {
          if (audioRef.current && audioRef.current.src) {
            audioRef.current.play().catch(() => {});
          }
          setIsPlaying(true);
        });

        setAction('pause', () => {
          if (audioRef.current) audioRef.current.pause();
          audioEngine.stopSyntheticDemoTrack();
          setIsPlaying(false);
        });

        setAction('previoustrack', () => prevTrack());
        setAction('nexttrack', () => nextTrack());

        setAction('seekto', (details) => {
          if (details.seekTime !== undefined && details.seekTime !== null) {
            seekTo(details.seekTime);
          }
        });

        setAction('seekbackward', (details) => {
          const offset = details.seekOffset || 10;
          setCurrentTime(prev => {
            const nextTime = Math.max(0, prev - offset);
            if (audioRef.current && audioRef.current.src && !audioRef.current.src.startsWith('data:audio/wav')) {
              audioRef.current.currentTime = nextTime;
            }
            return nextTime;
          });
        });

        setAction('seekforward', (details) => {
          const offset = details.seekOffset || 10;
          setCurrentTime(prev => {
            const nextTime = Math.min(duration, prev + offset);
            if (audioRef.current && audioRef.current.src && !audioRef.current.src.startsWith('data:audio/wav')) {
              audioRef.current.currentTime = nextTime;
            }
            return nextTime;
          });
        });

        setAction('stop', () => {
          if (audioRef.current) audioRef.current.pause();
          audioEngine.stopSyntheticDemoTrack();
          setIsPlaying(false);
        });
      } catch (err) {
        console.warn('MediaSession API warning:', err);
      }
    }
  }, [currentTrack, isPlaying, duration]);

  // Update MediaSession Position State
  useEffect(() => {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && currentTrack && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(1, duration),
          playbackRate: playbackSpeed || 1,
          position: Math.min(Math.max(0, currentTime), duration)
        });
      } catch (e) {
        // Ignore positionState sync timing mismatches
      }
    }
  }, [currentTime, duration, playbackSpeed, currentTrack]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setDuration(track.duration || 180);
    setCurrentTime(0);

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (!queue.some(t => t.id === track.id)) {
      setQueue(prev => [...prev, track]);
      setQueueIndex(queue.length);
    }

    setHistory(prev => [track, ...prev.filter(t => t.id !== track.id)].slice(0, 30));

    if (audioRef.current) {
      if (track.audioUrl && (track.audioUrl.startsWith('http') || track.audioUrl.startsWith('blob:'))) {
        audioRef.current.loop = false;
        audioRef.current.src = track.audioUrl;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Keep silent audio loop playing for MediaSession lock screen keep-alive
          audioRef.current!.src = SILENT_WAV_URI;
          audioRef.current!.loop = true;
          audioRef.current!.play().catch(() => {});
          audioEngine.playSyntheticDemoTrack(track.syntheticType || 'synthwave');
          setIsPlaying(true);
        });
      } else {
        // Play silent audio loop on audioRef to keep OS background audio session alive
        audioRef.current.src = SILENT_WAV_URI;
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
        audioEngine.playSyntheticDemoTrack(track.syntheticType || 'synthwave');
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      audioEngine.stopSyntheticDemoTrack();
      setIsPlaying(false);
    } else {
      if (audioRef.current && audioRef.current.src) {
        audioRef.current.play().catch(() => {
          audioEngine.playSyntheticDemoTrack(currentTrack.syntheticType || 'synthwave');
        });
      } else {
        audioEngine.playSyntheticDemoTrack(currentTrack.syntheticType || 'synthwave');
      }
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIdx = queueIndex + 1;
    if (shuffleMode !== 'off') {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = repeatMode === 'all' ? 0 : queue.length - 1;
    }

    setQueueIndex(nextIdx);
    if (queue[nextIdx]) {
      playTrack(queue[nextIdx]);
    }
  };

  const prevTrack = () => {
    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === 'all' ? queue.length - 1 : 0;
    }

    setQueueIndex(prevIdx);
    if (queue[prevIdx]) {
      playTrack(queue[prevIdx]);
    }
  };

  const seekTo = (timeSeconds: number) => {
    setCurrentTime(timeSeconds);
    if (audioRef.current) {
      audioRef.current.currentTime = timeSeconds;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    audioEngine.setVolume(vol);
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    updateEqualizer({ playbackSpeed: speed });
  };

  const toggleShuffle = () => {
    setShuffleMode(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'smart' : 'off'));
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  };

  const toggleFavorite = (trackId: string) => {
    if (currentTrack && currentTrack.id === trackId) {
      setCurrentTrack(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
    setQueue(prev => prev.map(t => t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  const updateEqualizer = (newSettings: Partial<EqualizerSettings>) => {
    setEqualizerSettings(prev => {
      const updated = { ...prev, ...newSettings };
      audioEngine.applyEqualizerSettings(updated);
      return updated;
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, idx) => idx !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearQueue = () => {
    setQueue(currentTrack ? [currentTrack] : []);
    setQueueIndex(0);
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackSpeed,
        shuffleMode,
        repeatMode,
        queue,
        queueIndex,
        history,
        equalizerSettings,
        lyricsOpen,
        queueOpen,
        playTrack,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        setPlaybackSpeed,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        updateEqualizer,
        setLyricsOpen,
        setQueueOpen,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        addToQueue,
        getVisualizerData: () => audioEngine.getFrequencyData(),
        getWaveformData: () => audioEngine.getWaveformData()
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
