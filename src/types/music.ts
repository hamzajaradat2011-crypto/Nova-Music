export type ScreenId =
  | 'home'
  | 'library'
  | 'song-details'
  | 'album-details'
  | 'artist-details'
  | 'now-playing'
  | 'music-videos'
  | 'playlists'
  | 'mood-engine'
  | 'trip-packs'
  | 'download-assistant'
  | 'audio-lab'
  | 'media-analyzer'
  | 'file-manager'
  | 'private-vault'
  | 'settings';

export type AudioFormat = 'MP3' | 'FLAC' | 'WAV' | 'AAC' | 'OGG';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  artworkUrl: string;
  audioUrl: string; // Blob URL, Synth URL, or sample audio
  format: AudioFormat;
  bitrate: number; // e.g. 320
  sampleRate: number; // e.g. 44100
  fileSize: number; // in bytes
  filePath: string;
  isFavorite: boolean;
  isVaulted: boolean;
  playCount: number;
  lastPlayedTimestamp?: number;
  dateAdded: number;
  lyrics?: string;
  bpm?: number;
  energyLevel?: number; // 1 - 10
  moodTags?: string[];
  syntheticType?: 'synthwave' | 'chill' | 'kpop' | 'rock' | 'ambient' | 'edm';
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  year: number;
  genre: string;
  trackIds: string[];
  themeColor?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  genres: string[];
  albumIds: string[];
  popularTrackIds: string[];
}

export interface MusicVideo {
  id: string;
  title: string;
  artist: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  resolution: string; // '4K HDR' | '1080p 60fps' | '720p'
  category: 'Official MV' | 'Live Performance' | 'Lyric Video' | 'Visualizer';
  dateAdded: number;
  isVaulted: boolean;
  views: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isSystem?: boolean;
  type?: 'user' | 'favorite' | 'mood' | 'trip' | 'recent';
  createdAt: number;
}

export interface MoodPreset {
  id: string;
  name: string;
  iconName: string;
  energy: 'High' | 'Medium' | 'Low';
  tempoRange: string; // e.g. '120 - 140 BPM'
  description: string;
  explanation: string;
  coverUrl: string;
  color: string;
  trackIds: string[];
}

export interface TripPack {
  id: string;
  title: string;
  activity: 'Gym' | 'Driving' | 'Travel' | 'Study' | 'Relax' | 'Custom';
  genre: string;
  mood: string;
  energyLevel: number;
  targetDurationMinutes: number;
  storageLimitMB: number;
  currentSizeMB: number;
  progressPercentage: number;
  status: 'not_downloaded' | 'downloading' | 'downloaded' | 'active';
  trackIds: string[];
}

export interface UnlinkedDownload {
  id: string;
  rawFilename: string;
  filePath: string;
  fileSize: number;
  detectedArtist?: string;
  detectedTitle?: string;
  detectedAlbum?: string;
  detectedDuration?: number;
  matchScore: number; // 0 - 100
  matchedTrackId?: string;
  status: 'unmatched' | 'matched' | 'added';
}

export interface EqualizerBand {
  frequency: number; // Hz e.g. 60, 230, 910, 4000, 14000
  label: string; // '60Hz', '230Hz', '910Hz', '4kHz', '14kHz'
  gain: number; // -12 to +12 dB
}

export interface EqualizerSettings {
  enabled: boolean;
  preset: 'Flat' | 'Bass Booster' | 'Rock' | 'Pop' | 'Jazz' | 'Vocal' | 'Classical' | 'Electronic' | 'Custom';
  bands: EqualizerBand[];
  bassBoost: number; // 0 - 100
  trebleBoost: number; // 0 - 100
  crossfadeSeconds: number; // 0 - 10
  gaplessPlayback: boolean;
  volumeNormalization: boolean;
  playbackSpeed: number; // 0.5 - 2.0
}

export interface MediaFileScan {
  id: string;
  filename: string;
  path: string;
  size: number;
  detectedType: 'music' | 'music_video' | 'other_video';
  confidence: number;
  userOverride?: 'music' | 'music_video' | 'other_video';
  metadataSummary: string;
}

export interface UserSettings {
  amoledMode: boolean;
  accentColor: 'violet' | 'emerald' | 'sapphire' | 'amber' | 'crimson';
  playerLayout: 'oneui7' | 'classic';
  scannedFolders: string[];
  excludedFolders: string[];
  animationSpeed: 'normal' | 'fast' | 'none';
  autoLyrics: boolean;
  biometricEnabled: boolean;
  vaultPin: string;
  backgroundPlaybackEnabled: boolean;
  lockScreenControlsEnabled: boolean;
}
