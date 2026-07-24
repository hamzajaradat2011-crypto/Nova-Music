import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { X, Trash2, Shuffle, Music, Play } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const { queue, queueIndex, currentTrack, queueOpen, setQueueOpen, playTrack, removeFromQueue, clearQueue, toggleShuffle, shuffleMode } = usePlayer();

  if (!queueOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold text-white">Up Next Queue ({queue.length})</h3>
          <p className="text-[10px] text-neutral-400">Drag or click to play tracks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition ${shuffleMode !== 'off' ? 'bg-violet-600 text-white' : 'bg-white/10 text-neutral-400'}`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={clearQueue}
            className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-full transition"
            title="Clear Queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setQueueOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Queue Track List */}
      <div className="flex-1 my-4 space-y-2 overflow-y-auto pr-1">
        {queue.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">Queue is empty</div>
        ) : (
          queue.map((track, idx) => {
            const isPlayingThis = currentTrack?.id === track.id && idx === queueIndex;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`p-2.5 rounded-2xl border flex items-center gap-3 transition ${
                  isPlayingThis
                    ? 'bg-violet-600/30 border-violet-500/50 shadow-lg'
                    : 'bg-neutral-900/60 border-white/5 hover:bg-white/5'
                }`}
              >
                <div
                  onClick={() => playTrack(track, queue)}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" />
                    {isPlayingThis && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-violet-400 text-violet-400 animate-bounce" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-bold truncate ${isPlayingThis ? 'text-violet-300' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => removeFromQueue(idx)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
