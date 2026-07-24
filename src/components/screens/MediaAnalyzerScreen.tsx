import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { mediaScanner } from '../../services/mediaScanner';
import { FileSearch, Sparkles, RefreshCw, Upload, Film, Video, FileAudio, Music2 } from 'lucide-react';

export const MediaAnalyzerScreen: React.FC = () => {
  const { mediaScans, addMediaScan, addTrack, addVideo, showToast } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanDirectory = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate scanning device storage files
      const mockScan = mediaScanner.classifyMediaFile(
        new File(['mock'], 'The_Weeknd_Blinding_Lights_Official_MV.mp4', { type: 'video/mp4' })
      );
      const mockCameraVideo = mediaScanner.classifyMediaFile(
        new File(['mock'], 'VID_20260724_113000_FamilyTrip.mp4', { type: 'video/mp4' })
      );
      const mockMp3 = mediaScanner.classifyMediaFile(
        new File(['mock'], 'Daft_Punk_Get_Lucky.mp3', { type: 'audio/mp3' })
      );

      addMediaScan(mockScan);
      addMediaScan(mockCameraVideo);
      addMediaScan(mockMp3);

      setIsScanning(false);
      showToast('Media storage scan complete! Identified MP3s, Music Videos, and Normal Camera Clips');
    }, 1000);
  };

  const handleAnalyzeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const classification = mediaScanner.classifyMediaFile(file);
      addMediaScan(classification);

      if (classification.detectedType === 'music') {
        const parsed = await mediaScanner.parseFileToTrack(file);
        addTrack(parsed);
      } else if (classification.detectedType === 'music_video') {
        const parsedVid = await mediaScanner.parseFileToVideo(file);
        addVideo(parsedVid);
      }
    }
    showToast(`Analyzed and classified ${files.length} device file(s)`);
  };

  return (
    <div className="space-y-4 pb-10">
      <OneUIHeader title="Media Analyzer" subtitle="Offline Content Classifier & AI Inspector" />

      {/* Hero Header */}
      <div className="mx-4 p-4 rounded-[32px] bg-zinc-900/90 border border-blue-500/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Storage Content Inspector</h3>
          </div>
          <button
            onClick={handleScanDirectory}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-900/30"
            id="btn-trigger-media-scan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Storage'}</span>
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Nova Music automatically differentiates standard video files (like camera recordings or family clips) from official music videos and MP3 audio tracks using file metadata, video stream analysis, and title keywords.
        </p>

        {/* Manual File Picker */}
        <label className="w-full p-3 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-white cursor-pointer transition">
          <Upload className="w-4 h-4 text-blue-400" />
          <span>Pick Device File to Test Classification</span>
          <input type="file" multiple accept="audio/*,video/*" onChange={handleAnalyzeUpload} className="hidden" />
        </label>
      </div>

      {/* Classification Legend */}
      <div className="px-4 grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="p-2 bg-zinc-900/80 border border-blue-500/30 rounded-2xl">
          <FileAudio className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <span className="font-bold text-white block">MP3 / Audio</span>
          <span className="text-zinc-400">Added to Library</span>
        </div>
        <div className="p-2 bg-zinc-900/80 border border-purple-500/30 rounded-2xl">
          <Film className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <span className="font-bold text-white block">Music Video</span>
          <span className="text-zinc-400">Added to Videos</span>
        </div>
        <div className="p-2 bg-zinc-900/80 border border-amber-500/30 rounded-2xl">
          <Video className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <span className="font-bold text-white block">Normal Video</span>
          <span className="text-zinc-400">Excluded from MV</span>
        </div>
      </div>

      {/* Classification Results */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Scanned & Classified Media</h3>

        {mediaScans.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 rounded-[28px] bg-zinc-900/60">
            Click "Scan Storage" or "Pick Device File" to run the media analyzer
          </div>
        ) : (
          mediaScans.map(scan => (
            <div key={scan.id} className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{scan.filename}</h4>
                <p className="text-[10px] text-zinc-400 font-mono truncate">{scan.metadataSummary}</p>
              </div>

              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap border ${
                scan.detectedType === 'music'
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                  : scan.detectedType === 'music_video'
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                  : 'bg-amber-600/20 text-amber-300 border-amber-500/30'
              }`}>
                {scan.detectedType === 'music'
                  ? 'MP3 Track'
                  : scan.detectedType === 'music_video'
                  ? 'Music Video'
                  : 'Normal Video'} ({scan.confidence}%)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
