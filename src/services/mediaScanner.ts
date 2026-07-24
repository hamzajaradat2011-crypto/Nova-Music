import { Track, MusicVideo, MediaFileScan } from '../types/music';
import { videoStore } from './videoStore';

export class MediaScannerService {
  /**
   * Parses uploaded or scanned File object into Track metadata
   */
  public async parseFileToTrack(file: File): Promise<Track> {
    const filename = file.name;
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    const ext = filename.split('.').pop()?.toUpperCase() || 'MP3';

    // Basic heuristic artist - title parser (e.g. "Imagine Dragons - Believer")
    let artist = 'Local Artist';
    let title = nameWithoutExt;

    if (nameWithoutExt.includes(' - ')) {
      const parts = nameWithoutExt.split(' - ');
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    } else {
      // Clean up common file prefixes like "01. ", "01 - "
      title = nameWithoutExt.replace(/^(\d{1,2}[\s.-]+)/, '').trim();
    }

    // Estimate duration via HTML5 Audio
    const blobUrl = URL.createObjectURL(file);
    const duration = await this.getAudioDuration(blobUrl);

    const track: Track = {
      id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: title || 'Scanned Track',
      artist: artist || 'Local Device Artist',
      album: 'Device MP3 Storage',
      genre: 'Device Audio',
      duration: Math.round(duration) || 180,
      artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      audioUrl: blobUrl,
      format: (ext as any) || 'MP3',
      bitrate: 320,
      sampleRate: 44100,
      fileSize: file.size,
      filePath: `/storage/emulated/0/Music/${file.name}`,
      isFavorite: false,
      isVaulted: false,
      playCount: 0,
      dateAdded: Date.now(),
      bpm: 120,
      energyLevel: 6,
      moodTags: ['Device Audio', 'Local MP3']
    };

    return track;
  }

  public async parseFileToVideo(file: File): Promise<MusicVideo> {
    const filename = file.name;
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    let artist = 'Local Artist';
    let title = nameWithoutExt;

    if (nameWithoutExt.includes(' - ')) {
      const parts = nameWithoutExt.split(' - ');
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    } else {
      title = nameWithoutExt.replace(/^(\d{1,2}[\s.-]+)/, '').trim();
    }

    const id = 'video-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const videoUrl = videoStore.registerVideo(id, file);

    let extractedThumb = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
    let duration = 210;

    try {
      const res = await this.generateThumbnailFromVideo(file);
      extractedThumb = res.thumbnailUrl;
      duration = res.duration;
    } catch (err) {
      console.warn('Video frame extraction warning:', err);
    }

    return {
      id: id,
      title: title,
      artist: artist,
      videoUrl: videoUrl,
      thumbnailUrl: extractedThumb,
      duration: duration,
      resolution: '1080p HD',
      category: 'Official MV',
      dateAdded: Date.now(),
      isVaulted: false,
      views: 1
    };
  }

  public generateThumbnailFromVideo(file: File | Blob): Promise<{ thumbnailUrl: string; duration: number }> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.playsInline = true;
      video.muted = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration) || 210;
        video.currentTime = Math.min(1.5, (video.duration || 5) / 2);

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 360;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
              URL.revokeObjectURL(url);
              resolve({ thumbnailUrl: dataUrl, duration });
              return;
            }
          } catch (e) {
            console.warn('Canvas video thumbnail capture error:', e);
          }
          URL.revokeObjectURL(url);
          resolve({
            thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            duration
          });
        };
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
          duration: 210
        });
      };
    });
  }

  /**
   * Distinguishes between MP3/Audio files, Official Music Videos, and Normal Device Videos
   */
  public classifyMediaFile(file: File): MediaFileScan {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const nameLower = file.name.toLowerCase();

    let detectedType: 'music' | 'music_video' | 'other_video' = 'music';
    let confidence = 85;

    // Normal video indicator patterns (e.g., camera recordings, WhatsApp clips, screen captures)
    const normalVideoPatterns = [
      'vid_', 'mov_', 'cam_', 'whatsapp', 'screen_', 'rec_', 'zoom_', 'clip_', 'camera',
      'video_', 'screenshot', 'recording', 'dji_', 'gopro', 'pxl_'
    ];

    // Music video indicator patterns
    const musicVideoPatterns = [
      'official video', 'music video', ' official mv', ' [mv]', ' (mv)', 'lyric video',
      'live at', 'performance video', 'vevo', 'official audio', 'visualizer', 'remix'
    ];

    const isNormalVideoName = normalVideoPatterns.some(p => nameLower.startsWith(p) || nameLower.includes(p));
    const isMusicVideoName = musicVideoPatterns.some(p => nameLower.includes(p));

    if (['mp4', 'mkv', 'webm', 'mov', 'avi', '3gp'].includes(ext)) {
      if (isMusicVideoName || (nameLower.includes(' - ') && !isNormalVideoName)) {
        detectedType = 'music_video';
        confidence = isMusicVideoName ? 98 : 88;
      } else {
        detectedType = 'other_video';
        confidence = isNormalVideoName ? 96 : 82;
      }
    } else if (['mp3', 'flac', 'wav', 'm4a', 'aac', 'ogg', 'wma'].includes(ext)) {
      detectedType = 'music';
      confidence = 99;
    }

    const typeLabel =
      detectedType === 'music'
        ? 'MP3 / Device Audio Track'
        : detectedType === 'music_video'
        ? 'Official Music Video'
        : 'Normal Device Video (Non-Music)';

    return {
      id: 'scan-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      filename: file.name,
      path: `/storage/emulated/0/${detectedType === 'music' ? 'Music' : 'DCIM/Camera'}/${file.name}`,
      size: file.size,
      detectedType,
      confidence,
      metadataSummary: `${typeLabel} | ${ext.toUpperCase()} | ${(file.size / (1024 * 1024)).toFixed(2)} MB`
    };
  }

  public detectDuplicateTracks(tracks: Track[]): { trackA: Track; trackB: Track; similarityScore: number }[] {
    const duplicates: { trackA: Track; trackB: Track; similarityScore: number }[] = [];

    for (let i = 0; i < tracks.length; i++) {
      for (let j = i + 1; j < tracks.length; j++) {
        const a = tracks[i];
        const b = tracks[j];

        const titleMatch = a.title.toLowerCase().trim() === b.title.toLowerCase().trim();
        const artistMatch = a.artist.toLowerCase().trim() === b.artist.toLowerCase().trim();
        const durationDiff = Math.abs(a.duration - b.duration);

        if (titleMatch && (artistMatch || durationDiff <= 3)) {
          duplicates.push({
            trackA: a,
            trackB: b,
            similarityScore: titleMatch && artistMatch ? 98 : 85
          });
        }
      }
    }

    return duplicates;
  }

  private getAudioDuration(url: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = url;
      audio.onloadedmetadata = () => {
        resolve(audio.duration || 180);
      };
      audio.onerror = () => {
        resolve(180);
      };
    });
  }
}

export const mediaScanner = new MediaScannerService();
