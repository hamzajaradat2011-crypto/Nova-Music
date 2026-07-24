import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { MusicVideo } from '../../types/music';
import { mediaScanner } from '../../services/mediaScanner';
import { videoStore } from '../../services/videoStore';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { EditVideoModal } from '../modals/EditVideoModal';
import { Play, Pause, Film, Headphones, X, Upload, AlertTriangle, RefreshCw, Volume2, VolumeX, Trash2, Edit3 } from 'lucide-react';

export const MusicVideoScreen: React.FC = () => {
  const { videos, addVideo, deleteVideo, addMediaScan, showToast } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<MusicVideo | null>(null);
  const [editingVideo, setEditingVideo] = useState<MusicVideo | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<MusicVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const categories = ['All', 'Official MV', 'Live Performance', 'Lyric Video', 'Visualizer'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = videos.filter(
    v => activeCategory === 'All' || v.category === activeCategory
  );

  // Asynchronously resolve video URL from memory cache or IndexedDB blob store
  useEffect(() => {
    if (selectedVideo) {
      let isCancelled = false;
      videoStore.getVideoUrlAsync(selectedVideo.id, selectedVideo.videoUrl).then(url => {
        if (!isCancelled) {
          setActiveVideoUrl(url);
        }
      });
      return () => { isCancelled = true; };
    } else {
      setActiveVideoUrl('');
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      setPlayError(null);
      setAutoplayBlocked(false);
      videoRef.current.currentTime = 0;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch((err) => {
            console.warn('Autoplay prevented by browser:', err);
            setIsPlaying(false);
            setAutoplayBlocked(true);
          });
      }
    }
  }, [selectedVideo, audioOnlyMode]);

  const toggleVideoPlay = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setPlayError(null);
      } catch (err: any) {
        console.error('Video play error:', err);
        setAutoplayBlocked(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const classification = mediaScanner.classifyMediaFile(file);
      addMediaScan(classification);

      const parsedVideo = await mediaScanner.parseFileToVideo(file);
      addVideo(parsedVideo);

      if (classification.detectedType === 'music_video') {
        showToast(`Imported Official Music Video: ${parsedVideo.title}`);
      } else {
        showToast(`Analyzed ${file.name}: Imported into player`);
      }

      // Auto play newly imported video
      setSelectedVideo(parsedVideo);
    }
  };

  const handleReattachVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedVideo) return;

    const newUrl = videoStore.registerVideo(selectedVideo.id, file);

    try {
      const res = await mediaScanner.generateThumbnailFromVideo(file);
      const updated = {
        ...selectedVideo,
        thumbnailUrl: res.thumbnailUrl,
        duration: res.duration
      };
      updateVideo(updated);
      setSelectedVideo(updated);
    } catch (err) {
      console.warn('Thumbnail extraction on re-attach warning:', err);
    }

    setActiveVideoUrl(newUrl);
    setPlayError(null);
    showToast(`Re-attached video file for "${selectedVideo.title}"!`);
  };

  return (
    <div className="space-y-4 pb-10">
      <OneUIHeader title="Music Videos" subtitle={`${videos.length} 4K & 1080p Videos Available`} />

      {/* Import & Category Bar */}
      <div className="px-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer shadow-lg shadow-blue-900/30 transition whitespace-nowrap">
          <Upload className="w-3.5 h-3.5 text-white" />
          <span>Import Video</span>
          <input type="file" multiple accept="video/*" onChange={handleVideoUpload} className="hidden" />
        </label>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="mx-4 p-8 bg-zinc-900/60 border border-zinc-800 rounded-[28px] text-center space-y-3">
          <Film className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-xs font-bold text-zinc-300">No videos found in "{activeCategory}"</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold transition"
          >
            Show All Videos
          </button>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => {
                setSelectedVideo(video);
                setPlayError(null);
              }}
              className="bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 rounded-[28px] p-2.5 cursor-pointer transition group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-2 border border-zinc-800 bg-black">
                <img
                  src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-blue-300 border border-zinc-700/50">
                  {video.resolution}
                </span>

                <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                  <p className="text-[10px] text-zinc-400 truncate">{video.artist} • {video.category}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingVideo(video);
                    }}
                    className="p-1.5 text-zinc-500 hover:text-blue-400 transition"
                    title="Rename / Edit Video"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingVideo(video);
                    }}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col p-4 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white truncate max-w-xs">{selectedVideo.title}</h3>
            </div>
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                setSelectedVideo(null);
              }}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition border border-zinc-700/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
            {audioOnlyMode ? (
              <div className="w-full max-w-md aspect-video bg-zinc-900 rounded-[32px] border border-blue-500/30 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative">
                <Headphones className="w-12 h-12 text-blue-400 animate-pulse mb-3" />
                <h4 className="text-sm font-bold text-white">{selectedVideo.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">Audio-Only Background Playback Active</p>
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => setPlayError("Could not decode video file format.")}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="w-full max-w-2xl aspect-video bg-black rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl relative group flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  playsInline
                  controls
                  onPlay={() => {
                    setIsPlaying(true);
                    setAutoplayBlocked(false);
                    setPlayError(null);
                  }}
                  onPause={() => setIsPlaying(false)}
                  onError={() => {
                    console.error("Video element error for URL:", activeVideoUrl);
                    setPlayError("Browser couldn't play this video file directly or session blob expired.");
                  }}
                  className="w-full h-full object-contain"
                />

                {/* Autoplay Blocked Overlay */}
                {autoplayBlocked && !playError && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
                    <button
                      onClick={toggleVideoPlay}
                      className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-2xl shadow-blue-600/50 transition transform hover:scale-110 mb-3"
                    >
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </button>
                    <p className="text-xs font-bold text-white">Click to Start Playing Video</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Browser requires user click to initialize video playback</p>
                  </div>
                )}

                {/* Playback Error Overlay */}
                {playError && (
                  <div className="absolute inset-0 bg-zinc-950/95 p-6 flex flex-col items-center justify-center text-center z-30 space-y-3">
                    <AlertTriangle className="w-10 h-10 text-amber-400 animate-bounce" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Video File Unreachable</h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm">{playError}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <label className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-lg flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        <span>Re-select Video File</span>
                        <input type="file" accept="video/*" onChange={handleReattachVideo} className="hidden" />
                      </label>

                      <button
                        onClick={() => {
                          setAudioOnlyMode(true);
                          setPlayError(null);
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        Try Audio Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Player Mode & Controls Bar */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVideoPlay}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-lg shadow-blue-900/30"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition border border-zinc-700/50"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setAudioOnlyMode(!audioOnlyMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  audioOnlyMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{audioOnlyMode ? 'Audio Mode' : 'Audio-Only'}</span>
              </button>
            </div>

            <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              {selectedVideo.resolution}
            </span>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
        />
      )}

      {/* Delete Video Confirmation Modal */}
      {deletingVideo && (
        <DeleteConfirmModal
          title={deletingVideo.title}
          itemType="Music Video"
          onConfirm={() => {
            deleteVideo(deletingVideo.id);
            if (selectedVideo?.id === deletingVideo.id) {
              setSelectedVideo(null);
            }
            setDeletingVideo(null);
          }}
          onClose={() => setDeletingVideo(null)}
        />
      )}
    </div>
  );
};
