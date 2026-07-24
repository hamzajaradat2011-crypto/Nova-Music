import React, { useState } from 'react';
import { Track } from '../../types/music';
import { useApp } from '../../context/AppContext';
import { Edit3, X, Save, Music, User, Disc, Tag, Image } from 'lucide-react';

interface EditSongModalProps {
  track: Track;
  onClose: () => void;
}

export const EditSongModal: React.FC<EditSongModalProps> = ({ track, onClose }) => {
  const { updateTrack, showToast } = useApp();

  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [album, setAlbum] = useState(track.album || '');
  const [genre, setGenre] = useState(track.genre || '');
  const [artworkUrl, setArtworkUrl] = useState(track.artworkUrl || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTrack({
      ...track,
      title: title.trim(),
      artist: artist.trim() || 'Unknown Artist',
      album: album.trim() || 'Unknown Album',
      genre: genre.trim() || 'General',
      artworkUrl: artworkUrl.trim() || track.artworkUrl
    });

    showToast(`Updated song details for "${title.trim()}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Rename & Edit Song</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition border border-zinc-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3">
          {/* Song Title */}
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Music className="w-3 h-3 text-blue-400" />
              <span>Song Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song title..."
              required
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Artist */}
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-purple-400" />
              <span>Artist Name</span>
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name..."
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Album */}
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Disc className="w-3 h-3 text-amber-400" />
                <span>Album</span>
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Album..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" />
                <span>Genre</span>
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Artwork URL */}
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Image className="w-3 h-3 text-cyan-400" />
              <span>Artwork Image URL</span>
            </label>
            <input
              type="text"
              value={artworkUrl}
              onChange={(e) => setArtworkUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-2xl text-xs font-bold transition border border-zinc-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/40"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
