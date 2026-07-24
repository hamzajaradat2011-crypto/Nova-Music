import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { ArrowLeft, Play, Disc, Film } from 'lucide-react';

export const ArtistDetailsScreen: React.FC = () => {
  const { activeDetailId, artists, tracks, videos, setActiveScreen } = useApp();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const artist = artists.find(a => a.id === activeDetailId) || artists[0];
  const artistTracks = tracks.filter(t => t.artist === artist?.name || artist?.popularTrackIds.includes(t.id));
  const artistVideos = videos.filter(v => v.artist === artist?.name);

  if (!artist) return null;

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          onClick={() => setActiveScreen('library')}
          className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700/50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-zinc-400">Artist Profile</span>
      </div>

      {/* Artist Profile Header */}
      <div className="mx-4 p-5 rounded-[32px] bg-zinc-900/90 border border-zinc-800 shadow-2xl flex flex-col items-center text-center">
        <img src={artist.avatarUrl} alt={artist.name} className="w-28 h-28 rounded-full object-cover shadow-2xl border-2 border-blue-500 mb-3" />
        <h2 className="text-xl font-bold text-white">{artist.name}</h2>
        <p className="text-xs text-zinc-400 mt-1">{artist.genres.join(' • ')}</p>
        <p className="text-xs text-zinc-300 max-w-sm my-3 leading-relaxed">{artist.bio}</p>

        <button
          onClick={() => artistTracks.length > 0 && playTrack(artistTracks[0], artistTracks)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-lg shadow-blue-900/40"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Play Popular Tracks</span>
        </button>
      </div>

      {/* Popular Tracks */}
      <div className="px-4 space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Popular Songs</h3>
        {artistTracks.map(track => {
          const isPlayingThis = currentTrack?.id === track.id && isPlaying;
          return (
            <div
              key={track.id}
              onClick={() => playTrack(track, artistTracks)}
              className={`p-2.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                isPlayingThis ? 'bg-blue-600/20 border-blue-500' : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/50'
              }`}
            >
              <img src={track.artworkUrl} alt={track.title} className="w-10 h-10 rounded-xl object-cover border border-zinc-700/50" />
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-bold truncate ${isPlayingThis ? 'text-blue-300' : 'text-white'}`}>{track.title}</h4>
                <p className="text-[10px] text-zinc-400 truncate">{track.album}</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Artist Music Videos */}
      {artistVideos.length > 0 && (
        <div className="px-4 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Music Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {artistVideos.map(video => (
              <div
                key={video.id}
                onClick={() => setActiveScreen('music-videos')}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2.5 cursor-pointer hover:border-blue-500/50 transition"
              >
                <img src={video.thumbnailUrl} alt={video.title} className="w-full aspect-video rounded-xl object-cover mb-2 border border-zinc-800" />
                <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                <p className="text-[10px] text-blue-400">{video.resolution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
