import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useApp } from '../../context/AppContext';
import { X, Edit3, Save, Sparkles, Volume2 } from 'lucide-react';

export const LyricsModal: React.FC = () => {
  const { currentTrack, lyricsOpen, setLyricsOpen, currentTime } = usePlayer();
  const { updateTrack } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [lyricsText, setLyricsText] = useState(currentTrack?.lyrics || '');

  if (!lyricsOpen || !currentTrack) return null;

  const lines = (currentTrack.lyrics || 'No lyrics available for this song.')
    .split('\n')
    .filter(line => line.trim().length > 0);

  const handleSave = () => {
    updateTrack({ ...currentTrack, lyrics: lyricsText });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-white">Synced Lyrics • {currentTrack.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
              id="btn-save-lyrics"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setLyricsText(currentTrack.lyrics || '');
                setIsEditing(true);
              }}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold"
              id="btn-edit-lyrics"
            >
              <Edit3 className="w-3.5 h-3.5 text-violet-400" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => setLyricsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            id="btn-close-lyrics"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lyrics Display or Editor */}
      <div className="flex-1 my-6 flex flex-col items-center justify-center">
        {isEditing ? (
          <textarea
            value={lyricsText}
            onChange={e => setLyricsText(e.target.value)}
            className="w-full h-80 bg-neutral-900 border border-white/10 rounded-2xl p-4 text-xs font-mono text-neutral-200 focus:outline-none focus:border-violet-500"
            placeholder="Enter lyrics here (optional timestamp format [00:15.00] Line text)..."
          />
        ) : (
          <div className="space-y-4 text-center max-w-md w-full px-4">
            {lines.map((line, idx) => {
              // Simulated sync highlighting
              const isHighlighted = idx === Math.floor((currentTime / currentTrack.duration) * lines.length);
              return (
                <p
                  key={idx}
                  className={`text-sm sm:text-base transition-all font-medium ${
                    isHighlighted
                      ? 'text-violet-300 font-bold scale-105 bg-violet-500/10 py-1.5 px-3 rounded-xl border border-violet-500/30 shadow-lg'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {line.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '')}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Track Info Footer */}
      <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-2xl flex items-center gap-3">
        <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="w-10 h-10 rounded-xl object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate text-white">{currentTrack.title}</p>
          <p className="text-[10px] text-neutral-400 truncate">{currentTrack.artist}</p>
        </div>
        <Volume2 className="w-4 h-4 text-violet-400" />
      </div>
    </div>
  );
};
