import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { mediaScanner } from '../../services/mediaScanner';
import { EditSongModal } from '../modals/EditSongModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { Track } from '../../types/music';
import { CopyCheck, Folder, FileAudio, Film, Video, Trash2, Upload, Sparkles, CheckCircle2, Edit3 } from 'lucide-react';

export const FileManagerScreen: React.FC = () => {
  const { tracks, videos, mediaScans, deleteTrack, addTrack, addVideo, addMediaScan, showToast } = useApp();
  const [activeFolder, setActiveFolder] = useState('/storage/emulated/0/Music');
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);

  // Detect duplicates
  const duplicates = mediaScanner.detectDuplicateTracks(tracks);

  const folders = [
    '/storage/emulated/0/Music',
    '/storage/emulated/0/Download',
    '/storage/emulated/0/DCIM/Camera',
    '/storage/emulated/0/NovaMusic/Vault'
  ];

  const handleImportFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const classification = mediaScanner.classifyMediaFile(file);
      addMediaScan(classification);

      if (classification.detectedType === 'music') {
        const parsed = await mediaScanner.parseFileToTrack(file);
        addTrack(parsed);
        showToast(`Imported MP3 song: ${parsed.title}`);
      } else if (classification.detectedType === 'music_video') {
        const parsedVideo = await mediaScanner.parseFileToVideo(file);
        addVideo(parsedVideo);
        showToast(`Recognized & added Music Video: ${parsedVideo.title}`);
      } else {
        showToast(`Analyzed ${file.name}: Distinguished as Normal Device Video (excluded from Music Videos)`);
      }
    }
  };

  return (
    <div className="space-y-4 pb-10">
      <OneUIHeader title="File Manager" subtitle="Samsung Storage & Smart Media Classifier" />

      {/* Media Type Distinguisher Banner */}
      <div className="mx-4 p-4 rounded-[28px] bg-zinc-900/90 border border-blue-500/30 shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Device Media Distinguisher</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Nova Music automatically scans your device files and distinguishes between <strong className="text-blue-400">MP3 Songs</strong>, <strong className="text-purple-400">Official Music Videos</strong>, and <strong className="text-amber-400 font-semibold">Normal Device Videos</strong> (e.g., camera clips or screen recordings).
        </p>
      </div>

      {/* Duplicate Song Finder Banner */}
      {duplicates.length > 0 && (
        <div className="mx-4 p-4 rounded-[28px] bg-zinc-900/90 border border-blue-500/30 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <CopyCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Duplicate Songs Detected ({duplicates.length})</h3>
          </div>

          <div className="space-y-2">
            {duplicates.map((dup, i) => (
              <div key={i} className="p-2.5 bg-black/60 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate">{dup.trackA.title}</p>
                  <p className="text-[10px] text-zinc-400">{dup.trackA.artist} • {dup.similarityScore}% Match</p>
                </div>
                <button
                  onClick={() => deleteTrack(dup.trackB.id)}
                  className="bg-red-600/20 text-red-300 hover:bg-red-600/30 px-3 py-1 rounded-xl text-[10px] font-bold border border-red-500/30"
                >
                  Remove Duplicate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folder Selection Pills */}
      <div className="px-4 space-y-2">
        <label className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Storage Folders</label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {folders.map(f => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeFolder === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f.split('/').pop()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File Import Label */}
      <div className="px-4">
        <label className="w-full p-4 bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 rounded-[24px] flex items-center justify-center gap-2 text-xs font-bold text-white cursor-pointer transition shadow-xl">
          <Upload className="w-4 h-4 text-blue-400" />
          <span>Import MP3 Music & Videos from Device Storage</span>
          <input type="file" multiple accept="audio/*,video/*" onChange={handleImportFiles} className="hidden" />
        </label>
      </div>

      {/* Scanned Log - Distinguish Normal Videos */}
      {mediaScans.length > 0 && (
        <div className="px-4 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">Recently Scanned Device Media</h3>
          <div className="space-y-2">
            {mediaScans.map(scan => (
              <div key={scan.id} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {scan.detectedType === 'music' ? (
                    <FileAudio className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : scan.detectedType === 'music_video' ? (
                    <Film className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <Video className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{scan.filename}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">{scan.metadataSummary}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  scan.detectedType === 'music'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : scan.detectedType === 'music_video'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {scan.detectedType === 'music' ? 'MP3 Song' : scan.detectedType === 'music_video' ? 'Music Video' : 'Normal Video'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track Files in Folder */}
      <div className="px-4 space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Library Songs in {activeFolder}</h3>
        {tracks.map(track => (
          <div key={track.id} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <FileAudio className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                <p className="text-[10px] text-zinc-400 font-mono truncate">{track.filePath}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditingTrack(track)}
                className="p-1.5 text-zinc-400 hover:text-blue-400 transition"
                title="Rename Song"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingTrack(track)}
                className="p-1.5 text-zinc-400 hover:text-red-400 transition"
                title="Delete Song"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Song Modal */}
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
