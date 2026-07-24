import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { ArrowLeft, Play, Save, Trash2, ShieldCheck, Heart, Music, ListPlus } from 'lucide-react';

export const SongDetailsScreen: React.FC = () => {
  const { activeDetailId, tracks, updateTrack, deleteTrack, playlists, addTrackToPlaylist, toggleTrackVault, setActiveScreen } = useApp();
  const { playTrack } = usePlayer();

  const track = tracks.find(t => t.id === activeDetailId) || tracks[0];

  const [title, setTitle] = useState(track?.title || '');
  const [artist, setArtist] = useState(track?.artist || '');
  const [album, setAlbum] = useState(track?.album || '');
  const [genre, setGenre] = useState(track?.genre || '');
  const [artworkUrl, setArtworkUrl] = useState(track?.artworkUrl || '');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  if (!track) return null;

  const handleSave = () => {
    updateTrack({
      ...track,
      title,
      artist,
      album,
      genre,
      artworkUrl
    });
  };

  const handleAddToPlaylist = () => {
    if (selectedPlaylistId) {
      addTrackToPlaylist(selectedPlaylistId, track.id);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          onClick={() => setActiveScreen('library')}
          className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700/50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold text-white">Song Details & Metadata</h2>
      </div>

      {/* Main Track Header Card */}
      <div className="mx-4 p-4 bg-zinc-900/90 border border-zinc-800 rounded-[32px] flex flex-col sm:flex-row items-center gap-4 shadow-xl">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-xl border border-zinc-700/50">
          <img src={artworkUrl || track.artworkUrl} alt={title} className="w-full h-full object-cover" />
          <button
            onClick={() => playTrack(track, tracks)}
            className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/60 transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </button>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white truncate">{track.title}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{track.artist} • {track.album}</p>

          <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
            <span className="bg-blue-600/30 text-blue-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-blue-500/30">
              {track.format} {track.bitrate}kbps
            </span>
            <span className="bg-emerald-600/30 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
              {track.sampleRate / 1000} kHz
            </span>
            <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-zinc-700/50">
              {(track.fileSize / (1024 * 1024)).toFixed(1)} MB
            </span>
          </div>
        </div>
      </div>

      {/* Metadata Editor Form */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Edit Metadata</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Artist Name</label>
            <input
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Album Name</label>
            <input
              type="text"
              value={album}
              onChange={e => setAlbum(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-zinc-400 block mb-1">Artwork URL</label>
          <input
            type="text"
            value={artworkUrl}
            onChange={e => setArtworkUrl(e.target.value)}
            className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
          id="btn-save-track-metadata"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Add to Playlist & Security Actions */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Actions & Security</h3>

        <div className="flex gap-2">
          <select
            value={selectedPlaylistId}
            onChange={e => setSelectedPlaylistId(e.target.value)}
            className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">Select Playlist...</option>
            {playlists.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddToPlaylist}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-zinc-700/50"
          >
            <ListPlus className="w-4 h-4 text-blue-400" />
            <span>Add</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => toggleTrackVault(track.id)}
            className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{track.isVaulted ? 'Unvault Song' : 'Move to Vault'}</span>
          </button>

          <button
            onClick={() => {
              deleteTrack(track.id);
              setActiveScreen('library');
            }}
            className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Track</span>
          </button>
        </div>
      </div>
    </div>
  );
};
