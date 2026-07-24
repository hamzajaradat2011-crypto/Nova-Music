import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { ArrowLeft, Play, Shuffle, Heart, Plus } from 'lucide-react';

export const AlbumDetailsScreen: React.FC = () => {
  const { activeDetailId, albums, tracks, setActiveScreen, createTripPack } = useApp();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const album = albums.find(a => a.id === activeDetailId) || albums[0];
  const albumTracks = tracks.filter(t => album?.trackIds.includes(t.id) || t.album === album?.title);

  if (!album) return null;

  const totalDurationSecs = albumTracks.reduce((acc, t) => acc + t.duration, 0);
  const durationMins = Math.floor(totalDurationSecs / 60);

  const handleCreateAlbumTripPack = () => {
    createTripPack({
      id: 'trip-' + Date.now(),
      title: `${album.title} Trip Pack`,
      activity: 'Travel',
      genre: album.genre,
      mood: 'Focused',
      energyLevel: 8,
      targetDurationMinutes: durationMins,
      storageLimitMB: 500,
      currentSizeMB: Math.round(albumTracks.reduce((acc, t) => acc + t.fileSize, 0) / (1024 * 1024)),
      progressPercentage: 100,
      status: 'downloaded',
      trackIds: albumTracks.map(t => t.id)
    });
    setActiveScreen('trip-packs');
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header Back Bar */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          onClick={() => setActiveScreen('library')}
          className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700/50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-zinc-400">Album View</span>
      </div>

      {/* Album Artwork Banner */}
      <div className="mx-4 p-5 rounded-[32px] bg-zinc-900/90 border border-zinc-800 shadow-2xl flex flex-col items-center text-center">
        <img src={album.artworkUrl} alt={album.title} className="w-44 h-44 rounded-2xl object-cover shadow-2xl border border-zinc-700/50 mb-3" />
        <h2 className="text-xl font-bold text-white">{album.title}</h2>
        <p className="text-xs text-zinc-400 mt-1">{album.artist} • {album.year} • {album.genre}</p>
        <p className="text-[11px] text-blue-400 font-mono mt-1">{albumTracks.length} Songs • {durationMins} Minutes</p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => albumTracks.length > 0 && playTrack(albumTracks[0], albumTracks)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-lg shadow-blue-900/40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Album</span>
          </button>

          <button
            onClick={handleCreateAlbumTripPack}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition border border-zinc-700/50"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Pack for Trip</span>
          </button>
        </div>
      </div>

      {/* Album Tracklist */}
      <div className="px-4 space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400 mb-2">Tracklist</h3>
        {albumTracks.map((track, index) => {
          const isPlayingThis = currentTrack?.id === track.id && isPlaying;
          return (
            <div
              key={track.id}
              onClick={() => playTrack(track, albumTracks)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                isPlayingThis ? 'bg-blue-600/20 border-blue-500' : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-zinc-500 w-4">{index + 1}</span>
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isPlayingThis ? 'text-blue-300' : 'text-white'}`}>{track.title}</h4>
                  <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-blue-300">{track.format}</span>
                <span className="text-xs font-mono text-zinc-400">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
