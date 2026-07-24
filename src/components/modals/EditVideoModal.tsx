import React, { useState } from 'react';
import { MusicVideo } from '../../types/music';
import { useApp } from '../../context/AppContext';
import { videoStore } from '../../services/videoStore';
import { mediaScanner } from '../../services/mediaScanner';
import { Edit3, X, Save, Film, User, Image, Tag, Monitor, Sparkles, Upload } from 'lucide-react';

interface EditVideoModalProps {
  video: MusicVideo;
  onClose: () => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({ video, onClose }) => {
  const { updateVideo, showToast } = useApp();

  const [title, setTitle] = useState(video.title);
  const [artist, setArtist] = useState(video.artist);
  const [category, setCategory] = useState(video.category);
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnailUrl || '');
  const [resolution, setResolution] = useState(video.resolution || '1080p HD');
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);

  const categories = ['Official MV', 'Live Performance', 'Lyric Video', 'Visualizer'];

  const handleAutoGenerateThumb = async () => {
    setIsGeneratingThumb(true);
    try {
      const storedFile = videoStore.getFile(video.id);
      if (storedFile) {
        const res = await mediaScanner.generateThumbnailFromVideo(storedFile);
        setThumbnailUrl(res.thumbnailUrl);
        showToast('Generated fresh 1080p frame thumbnail from video!');
      } else {
        showToast('Video file not loaded in memory. Upload image or re-select video.');
      }
    } catch (err) {
      showToast('Could not extract frame from video file.');
    } finally {
      setIsGeneratingThumb(false);
    }
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setThumbnailUrl(reader.result);
          showToast('Updated thumbnail image from gallery!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateVideo({
      ...video,
      title: title.trim(),
      artist: artist.trim() || 'Unknown Artist',
      category: category || 'Official MV',
      thumbnailUrl: thumbnailUrl.trim() || video.thumbnailUrl,
      resolution: resolution || '1080p HD'
    });

    showToast(`Saved details for "${title.trim()}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[32px] p-5 space-y-4 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Edit & Rename Music Video</h3>
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
          {/* Video Title */}
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Film className="w-3 h-3 text-blue-400" />
              <span>Video Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title..."
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
            {/* Category */}
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" />
                <span>Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-zinc-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Resolution */}
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Monitor className="w-3 h-3 text-amber-400" />
                <span>Resolution</span>
              </label>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="1080p HD, 4K..."
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Thumbnail Preview & Generator */}
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Image className="w-3 h-3 text-cyan-400" />
                <span>Thumbnail</span>
              </span>
              <button
                type="button"
                onClick={handleAutoGenerateThumb}
                disabled={isGeneratingThumb}
                className="text-[9px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-blue-600/10 hover:bg-blue-600/20 px-2 py-0.5 rounded-full border border-blue-500/20 transition"
              >
                <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                <span>{isGeneratingThumb ? 'Generating...' : 'Extract Frame'}</span>
              </button>
            </label>

            {thumbnailUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-zinc-800 bg-black">
                <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Thumbnail Image URL..."
                className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 px-3 py-2 rounded-xl cursor-pointer text-xs font-bold text-zinc-300 flex items-center gap-1 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Gallery</span>
                <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
              </label>
            </div>
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
