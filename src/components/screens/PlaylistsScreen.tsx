import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { Plus, Play, Download, ListMusic, Heart, Trash2, X, Calendar, Clock, ArrowDownAZ, SortAsc, SortDesc } from 'lucide-react';
import { Playlist } from '../../types/music';

type SortOption = 'date' | 'duration' | 'title';

export const PlaylistsScreen: React.FC = () => {
  const { playlists, tracks, createPlaylist, setActiveScreen, showToast } = useApp();
  const { playTrack } = usePlayer();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(playlists[0] || null);

  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortAscending, setSortAscending] = useState<boolean>(false); // default: newest first, longest first, A-Z first

  // Calculate total duration in seconds for a playlist
  const getPlaylistDuration = (playlist: Playlist): number => {
    return playlist.trackIds.reduce((total, id) => {
      const track = tracks.find(t => t.id === id);
      return total + (track ? track.duration : 0);
    }, 0);
  };

  // Format seconds to mm:ss or hh:mm
  const formatDuration = (totalSeconds: number): string => {
    if (!totalSeconds) return '0s';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  // Sort playlists dynamically
  const sortedPlaylists = useMemo(() => {
    return [...playlists].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      } else if (sortBy === 'duration') {
        const durA = getPlaylistDuration(a);
        const durB = getPlaylistDuration(b);
        comparison = durA - durB;
      } else if (sortBy === 'date') {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;
        comparison = dateA - dateB;
      }

      return sortAscending ? comparison : -comparison;
    });
  }, [playlists, tracks, sortBy, sortAscending]);

  const handleCreate = () => {
    if (newTitle.trim()) {
      createPlaylist(newTitle.trim(), newDesc.trim());
      setNewTitle('');
      setNewDesc('');
      setCreateModalOpen(false);
    }
  };

  const activePlaylist = selectedPlaylist || sortedPlaylists[0] || null;

  const selectedTracks = activePlaylist
    ? tracks.filter(t => activePlaylist.trackIds.includes(t.id))
    : [];

  const handleExportM3U = (playlist: Playlist) => {
    const playlistTracks = tracks.filter(t => playlist.trackIds.includes(t.id));
    let m3uContent = '#EXTM3U\n';
    playlistTracks.forEach(t => {
      m3uContent += `#EXTINF:${t.duration},${t.artist} - ${t.title}\n${t.filePath}\n`;
    });

    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.title.replace(/\s+/g, '_')}.m3u`;
    a.click();
    showToast(`Exported ${playlist.title}.m3u file!`);
  };

  return (
    <div className="space-y-4 pb-10">
      <OneUIHeader title="Playlists" subtitle={`${playlists.length} Custom & System Playlists`} />

      {/* Action Header & Sorting Bar */}
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-lg shadow-blue-900/30"
            id="btn-create-playlist"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortAscending(!sortAscending)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition"
            title={`Order: ${sortAscending ? 'Ascending' : 'Descending'}`}
          >
            {sortAscending ? <SortAsc className="w-3.5 h-3.5 text-blue-400" /> : <SortDesc className="w-3.5 h-3.5 text-blue-400" />}
            <span className="text-[10px] font-mono uppercase">{sortAscending ? 'Asc' : 'Desc'}</span>
          </button>
        </div>

        {/* Sort Criterion Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap mr-1">Sort by:</span>
          
          <button
            onClick={() => setSortBy('date')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              sortBy === 'date'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Date Created</span>
          </button>

          <button
            onClick={() => setSortBy('duration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              sortBy === 'duration'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Total Duration</span>
          </button>

          <button
            onClick={() => setSortBy('title')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              sortBy === 'title'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <ArrowDownAZ className="w-3.5 h-3.5" />
            <span>Alphabetical</span>
          </button>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {sortedPlaylists.map(playlist => {
          const playlistDuration = getPlaylistDuration(playlist);
          const isSelected = activePlaylist?.id === playlist.id;

          return (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className={`p-3 rounded-[24px] border cursor-pointer transition ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-blue-500/50'
              }`}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 border border-zinc-800">
                <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleExportM3U(playlist);
                  }}
                  className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white hover:bg-black transition border border-zinc-700/50"
                  title="Export M3U"
                >
                  <Download className="w-3.5 h-3.5 text-blue-300" />
                </button>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{playlist.title}</h4>
              <p className="text-[10px] text-zinc-400 truncate">
                {playlist.trackIds.length} Songs • {formatDuration(playlistDuration)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Playlist Track View */}
      {activePlaylist && (
        <div className="mx-4 p-4 bg-zinc-900/90 border border-zinc-800 rounded-[28px] space-y-3 mt-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-white">{activePlaylist.title}</h3>
              <p className="text-[10px] text-zinc-400">
                {activePlaylist.description || 'Collection'} • Total Duration: {formatDuration(getPlaylistDuration(activePlaylist))}
              </p>
            </div>

            <button
              onClick={() => selectedTracks.length > 0 && playTrack(selectedTracks[0], selectedTracks)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-md shadow-blue-900/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play All</span>
            </button>
          </div>

          <div className="space-y-2">
            {selectedTracks.length === 0 ? (
              <p className="text-center py-6 text-zinc-500 text-xs">No tracks in this playlist yet</p>
            ) : (
              selectedTracks.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, selectedTracks)}
                  className="p-2.5 bg-black/50 border border-zinc-800/60 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-zinc-500">{idx + 1}</span>
                    <img src={track.artworkUrl} alt={track.title} className="w-8 h-8 rounded-lg object-cover border border-zinc-700/50" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-5 max-w-xs w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create New Playlist</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Playlist Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Midnight Chill Beats"
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="e.g. Perfect for study and late night coding"
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-2xl text-xs font-bold transition shadow-lg shadow-blue-900/40"
            >
              Create Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

