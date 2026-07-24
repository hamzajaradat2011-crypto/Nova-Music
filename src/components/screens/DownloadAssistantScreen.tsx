import React from 'react';
import { useApp } from '../../context/AppContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { DownloadCloud, CheckCircle2, FileAudio, Link, Sparkles } from 'lucide-react';

export const DownloadAssistantScreen: React.FC = () => {
  const { unlinkedDownloads, resolveUnlinkedDownload, tracks } = useApp();

  return (
    <div className="space-y-4 pb-10">
      <OneUIHeader title="Smart Download Assistant" subtitle="Automatic Offline Track Matcher & File Solver" />

      {/* Header Info */}
      <div className="mx-4 p-4 rounded-[32px] bg-zinc-900/90 border border-blue-500/30 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Storage File Matcher</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Scans downloaded raw MP3s in `/Download` and compares filename, artist tags, and duration to automatically link high-resolution cover art and lyrics.
        </p>
      </div>

      {/* Detected Files List */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">
          Detected Storage Downloads ({unlinkedDownloads.length})
        </h3>

        {unlinkedDownloads.map(download => (
          <div key={download.id} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-[28px] space-y-3 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <FileAudio className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{download.rawFilename}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono">{download.filePath}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold flex-shrink-0 border border-blue-500/30">
                {download.matchScore}% MATCH
              </span>
            </div>

            {/* Match Result Banner */}
            <div className="p-3 bg-black/60 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase block">Matched Metadata</span>
                <p className="text-xs font-bold text-white">{download.detectedTitle} • {download.detectedArtist}</p>
                <p className="text-[10px] text-zinc-400">{download.detectedAlbum}</p>
              </div>

              {download.status === 'added' ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Added</span>
                </span>
              ) : (
                <button
                  onClick={() => resolveUnlinkedDownload(download.id, download.matchedTrackId || tracks[0].id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-blue-900/30"
                  id={`btn-link-download-${download.id}`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Link Track</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
