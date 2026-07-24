import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { mediaScanner } from '../../services/mediaScanner';
import { EditSongModal } from '../modals/EditSongModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import {
  Play,
  Shuffle,
  Grid,
  List,
  Plus,
  Heart,
  MoreVertical,
  Folder,
  Music,
  Disc,
  User,
  Film,
  Trash2,
  Edit3
} from 'lucide-react';
import { Track } from '../../types/music';

type LibraryTab = 'songs' | 'albums' | 'artists' | 'genres' | 'folders' | 'favorites' | 'recent' | 'most-played';

export const LibraryScreen: React.FC = () => {
  const { tracks, albums, artists, searchQuery, setActiveScreen, addTrack, addVideo, deleteTrack, showToast } = useApp();
  const { playTrack, currentTrack, isPlaying, toggleFavorite } = usePlayer();

  const [activeTab, setActiveTab] = useState<LibraryTab>('songs');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'date' | 'plays'>('title');

  // Modal States
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);

  // Filter & Sort Logic
  const filteredTracks = tracks.filter(t => {
    if (t.isVaulted) return false;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = formatFilter === 'all' || t.format.toLowerCase() === formatFilter.toLowerCase();

    if (activeTab === 'favorites') return matchesSearch && matchesFormat && t.isFavorite;
    if (activeTab === 'recent') return matchesSearch && matchesFormat && t.lastPlayedTimestamp;
    if (activeTab === 'most-played') return matchesSearch && matchesFormat && t.playCount > 10;

    return matchesSearch && matchesFormat;
  }).sort((a, b) => {
    if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
    if (sortBy === 'date') return b.dateAdded - a.dateAdded;
    if (sortBy === 'plays') return b.playCount - a.playCount;
    return a.title.localeCompare(b.title);
  });

  // Handle local file import from device disk
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const classification = mediaScanner.classifyMediaFile(file);
      if (classification.detectedType === 'music') {
        const parsedTrack = await mediaScanner.parseFileToTrack(file);
        addTrack(parsedTrack);
        showToast(`Imported MP3 song: ${parsedTrack.title}`);
      } else if (classification.detectedType === 'music_video') {
        const parsedVideo = await mediaScanner.parseFileToVideo(file);
        addVideo(parsedVideo);
        showToast(`Recognized & added Music Video: ${parsedVideo.title}`);
      } else {
        showToast(`Analyzed ${file.name}: Normal video distinguished and stored in Media Inspector`);
      }
    }
  };

  const tabs: { id: LibraryTab; label: string }[] = [
    { id: 'songs', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'recent', label: 'Recently Added' },
    { id: 'most-played', label: 'Most Played' },
    { id: 'genres', label: 'Genres' },
    { id: 'folders', label: 'Folders' }
  ];

  return (
    <div className="space-y-4 pb-8">
      <OneUIHeader title="Media Library" subtitle={`${filteredTracks.length} items available`} />

      {/* Tabs Row */}
      <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Controls & Format Filters */}
      <div className="px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => playTrack(filteredTracks[0], filteredTracks)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-md shadow-blue-900/20"
            id="btn-library-shuffle-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle All</span>
          </button>

          {/* Import File Button */}
          <label className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border border-zinc-700/50 transition">
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Import</span>
            <input type="file" multiple accept="audio/*,video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <select
            value={formatFilter}
            onChange={e => setFormatFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none focus:border-blue-500/60"
          >
            <option value="all">All Formats</option>
            <option value="mp3">MP3</option>
            <option value="flac">FLAC</option>
            <option value="wav">WAV</option>
            <option value="aac">AAC</option>
            <option value="ogg">OGG</option>
          </select>

          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-white transition"
            title="Toggle View Mode"
          >
            {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Songs Tab View */}
      {activeTab === 'songs' || activeTab === 'favorites' || activeTab === 'recent' || activeTab === 'most-played' ? (
        <div className="px-4">
          {viewMode === 'list' ? (
            <div className="space-y-2">
              {filteredTracks.map(track => {
                const isPlayingThis = currentTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={track.id}
                    className={`p-2.5 rounded-2xl border flex items-center gap-3 transition ${
                      isPlayingThis
                        ? 'bg-blue-600/20 border-blue-500/50 shadow-lg'
                        : 'bg-zinc-900/80 border-zinc-800 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div
                      onClick={() => playTrack(track, filteredTracks)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover" />
                        {isPlayingThis && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-blue-400 text-blue-400 animate-bounce" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-bold truncate ${isPlayingThis ? 'text-blue-300' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {track.artist} • {track.album}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-blue-400 border border-zinc-700/50">
                        {track.format}
                      </span>
                      <button
                        onClick={() => toggleFavorite(track.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 transition"
                        title="Toggle Favorite"
                      >
                        <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTrack(track);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-400 transition"
                        title="Rename / Edit Song"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingTrack(track);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-400 transition"
                        title="Delete Song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveScreen('song-details', track.id)}
                        className="p-1.5 text-zinc-400 hover:text-white transition"
                        title="Song Details"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredTracks.map(track => (
                <div
                  key={track.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2.5 hover:border-blue-500/50 transition group relative"
                >
                  <div
                    onClick={() => playTrack(track, filteredTracks)}
                    className="relative aspect-square rounded-xl overflow-hidden mb-2 cursor-pointer"
                  >
                    <img src={track.artworkUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTrack(track);
                        }}
                        className="p-1 text-zinc-500 hover:text-blue-400 transition"
                        title="Rename Song"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingTrack(track);
                        }}
                        className="p-1 text-zinc-500 hover:text-red-400 transition"
                        title="Delete Song"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'albums' ? (
        <div className="px-4 grid grid-cols-2 gap-3">
          {albums.map(album => (
            <div
              key={album.id}
              onClick={() => setActiveScreen('album-details', album.id)}
              className="bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-3 cursor-pointer transition group"
            >
              <img src={album.artworkUrl} alt={album.title} className="w-full aspect-square rounded-xl object-cover mb-2 group-hover:scale-105 transition-transform" />
              <h4 className="text-xs font-bold text-white truncate">{album.title}</h4>
              <p className="text-[10px] text-zinc-400 truncate">{album.artist} • {album.year}</p>
            </div>
          ))}
        </div>
      ) : activeTab === 'artists' ? (
        <div className="px-4 space-y-2">
          {artists.map(artist => (
            <div
              key={artist.id}
              onClick={() => setActiveScreen('artist-details', artist.id)}
              className="p-3 bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 rounded-2xl flex items-center gap-3 cursor-pointer transition"
            >
              <img src={artist.avatarUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover border border-zinc-700/50" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{artist.name}</h4>
                <p className="text-[10px] text-zinc-400 truncate">{artist.genres.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-zinc-500 text-xs">
          Folder browser available in <button onClick={() => setActiveScreen('file-manager')} className="text-blue-400 underline">File Manager</button>
        </div>
      )}

      {/* Edit Song / Rename Modal */}
      {editingTrack && (
        <EditSongModal
          track={editingTrack}
          onClose={() => setEditingTrack(null)}
        />
      )}

      {/* Delete Song Confirmation Modal */}
      {deletingTrack && (
        <DeleteConfirmModal
          title={deletingTrack.title}
          itemType="Song"
          onConfirm={() => {
            deleteTrack(deletingTrack.id);
            setDeletingTrack(null);
          }}
          onClose={() => setDeletingTrack(null)}
        />
      )}
    </div>
  );
};
