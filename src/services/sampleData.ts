import { Track, Album, Artist, MusicVideo, Playlist, MoodPreset, TripPack, UnlinkedDownload } from '../types/music';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight City Lights',
    artist: 'Aura Synthesis',
    album: 'Neon Horizons',
    genre: 'Synthwave',
    duration: 218, // 3:38
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
    format: 'FLAC',
    bitrate: 1411,
    sampleRate: 96000,
    fileSize: 38400000,
    filePath: '/storage/emulated/0/Music/Aura Synthesis/Neon Horizons/01. Midnight City Lights.flac',
    isFavorite: true,
    isVaulted: false,
    playCount: 42,
    dateAdded: Date.now() - 86400000 * 12,
    lyrics: `[00:12.00]Glow of the neon streets beneath my feet\n[00:18.50]Driving through the cyber grid so deep\n[00:25.00]Nova lights reflecting in your eyes\n[00:32.00]Underneath the endless starry skies\n[00:45.00]Midnight city lights, taking us tonight\n[00:58.00]Feel the bassline burn, no point of return`,
    bpm: 124,
    energyLevel: 8,
    moodTags: ['Driving', 'Workout', 'Cyberpunk', 'High Energy'],
    syntheticType: 'synthwave'
  },
  {
    id: 'track-2',
    title: 'Velvet Rain & Espresso',
    artist: 'K-Acoustic Chill',
    album: 'Seoul Coffee Shop Sessions',
    genre: 'Lo-Fi / Chill',
    duration: 184, // 3:04
    artworkUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3',
    format: 'MP3',
    bitrate: 320,
    sampleRate: 44100,
    fileSize: 7360000,
    filePath: '/storage/emulated/0/Music/LoFi/Velvet Rain & Espresso.mp3',
    isFavorite: true,
    isVaulted: false,
    playCount: 68,
    dateAdded: Date.now() - 86400000 * 5,
    lyrics: `[00:10.00]Droplets tapping on the window glass\n[00:20.00]Warm coffee steam gently drifts by\n[00:32.00]Quiet moments made to last\n[00:45.00]Focus deep as night rolls in`,
    bpm: 82,
    energyLevel: 3,
    moodTags: ['Study', 'Focus', 'Relax', 'Rainy'],
    syntheticType: 'chill'
  },
  {
    id: 'track-3',
    title: 'Starlight Dynamite',
    artist: 'Luna Nova',
    album: 'Galaxy Prism',
    genre: 'K-Pop / Dance',
    duration: 202, // 3:22
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f37311.mp3?filename=pop-dance-upbeat-124888.mp3',
    format: 'AAC',
    bitrate: 256,
    sampleRate: 48000,
    fileSize: 6400000,
    filePath: '/storage/emulated/0/Music/KPop/Luna Nova - Starlight Dynamite.m4a',
    isFavorite: false,
    isVaulted: false,
    playCount: 19,
    dateAdded: Date.now() - 86400000 * 2,
    lyrics: `[00:08.00]Shining bright like a supernova blast\n[00:15.00]We gotta make this moment last\n[00:24.00]1, 2, 3 - Jump into the light!`,
    bpm: 128,
    energyLevel: 9,
    moodTags: ['Party', 'Workout', 'Upbeat', 'KPop'],
    syntheticType: 'kpop'
  },
  {
    id: 'track-4',
    title: 'Hyperdrive Overdrive',
    artist: 'Titan Core',
    album: 'Mechanical Symphony',
    genre: 'Rock / Industrial',
    duration: 245, // 4:05
    artworkUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c876b328.mp3?filename=rock-energetic-heavy-106511.mp3',
    format: 'WAV',
    bitrate: 1411,
    sampleRate: 44100,
    fileSize: 43200000,
    filePath: '/storage/emulated/0/Music/Titan Core/Hyperdrive Overdrive.wav',
    isFavorite: true,
    isVaulted: false,
    playCount: 51,
    dateAdded: Date.now() - 86400000 * 20,
    lyrics: `[00:15.00]Engine roaring in the core\n[00:28.00]Heavy distorted thunder shaking the floor\n[00:42.00]Unleash the storm, breaks all limits!`,
    bpm: 142,
    energyLevel: 10,
    moodTags: ['Workout', 'Gaming', 'Intense', 'Heavy'],
    syntheticType: 'rock'
  },
  {
    id: 'track-5',
    title: 'Celestial Deep Sleep',
    artist: 'Zenith Mind',
    album: 'Delta Waves 432Hz',
    genre: 'Ambient',
    duration: 310, // 5:10
    artworkUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db32c86e00.mp3?filename=meditation-ambient-116281.mp3',
    format: 'FLAC',
    bitrate: 920,
    sampleRate: 48000,
    fileSize: 35000000,
    filePath: '/storage/emulated/0/Music/Ambient/Zenith Mind - Deep Sleep.flac',
    isFavorite: false,
    isVaulted: false,
    playCount: 30,
    dateAdded: Date.now() - 86400000 * 8,
    lyrics: `[Instrumental Track - Pure Delta Waves & Soft Cosmic Pad]`,
    bpm: 60,
    energyLevel: 1,
    moodTags: ['Sleep', 'Relax', 'Meditation'],
    syntheticType: 'ambient'
  },
  {
    id: 'track-6',
    title: 'Cybernetics 2077',
    artist: 'Aura Synthesis',
    album: 'Neon Horizons',
    genre: 'Synthwave',
    duration: 210, // 3:30
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
    format: 'MP3',
    bitrate: 320,
    sampleRate: 44100,
    fileSize: 8400000,
    filePath: '/storage/emulated/0/Music/Aura Synthesis/Neon Horizons/02. Cybernetics 2077.mp3',
    isFavorite: true,
    isVaulted: false,
    playCount: 25,
    dateAdded: Date.now() - 86400000 * 10,
    bpm: 130,
    energyLevel: 9,
    moodTags: ['Gaming', 'Driving', 'Cyberpunk'],
    syntheticType: 'edm'
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Neon Horizons',
    artist: 'Aura Synthesis',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    year: 2026,
    genre: 'Synthwave',
    trackIds: ['track-1', 'track-6'],
    themeColor: '#8b5cf6'
  },
  {
    id: 'album-2',
    title: 'Seoul Coffee Shop Sessions',
    artist: 'K-Acoustic Chill',
    artworkUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    year: 2025,
    genre: 'Lo-Fi / Chill',
    trackIds: ['track-2'],
    themeColor: '#10b981'
  },
  {
    id: 'album-3',
    title: 'Galaxy Prism',
    artist: 'Luna Nova',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    year: 2026,
    genre: 'K-Pop / Dance',
    trackIds: ['track-3'],
    themeColor: '#ec4899'
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Aura Synthesis',
    avatarUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    bio: 'Pioneering electronic synthwave soundscapes with analog modular synths and hyper-resolution spatial mastering.',
    genres: ['Synthwave', 'Cyberpunk', 'EDM'],
    albumIds: ['album-1'],
    popularTrackIds: ['track-1', 'track-6']
  },
  {
    id: 'artist-2',
    name: 'K-Acoustic Chill',
    avatarUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    bio: 'Seoul-based lo-fi beatmaker crafting relaxing study beats, vinyl textures, and rainy day coffee acoustic sessions.',
    genres: ['Lo-Fi', 'Chill', 'Acoustic'],
    albumIds: ['album-2'],
    popularTrackIds: ['track-2']
  },
  {
    id: 'artist-3',
    name: 'Luna Nova',
    avatarUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    bio: 'Global K-Pop sensation bringing energetic dance pop beats and futuristic visuals to millions worldwide.',
    genres: ['K-Pop', 'Dance', 'Pop'],
    albumIds: ['album-3'],
    popularTrackIds: ['track-3']
  }
];

export const INITIAL_MUSIC_VIDEOS: MusicVideo[] = [
  {
    id: 'video-1',
    title: 'Midnight City Lights (Official 4K Music Video)',
    artist: 'Aura Synthesis',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    duration: 218,
    resolution: '4K HDR',
    category: 'Official MV',
    dateAdded: Date.now() - 86400000 * 4,
    isVaulted: false,
    views: 1240500
  },
  {
    id: 'video-2',
    title: 'Starlight Dynamite (Live at Seoul Dome)',
    artist: 'Luna Nova',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    duration: 202,
    resolution: '1080p 60fps',
    category: 'Live Performance',
    dateAdded: Date.now() - 86400000 * 2,
    isVaulted: false,
    views: 890120
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-favorites',
    title: 'Favorites',
    description: 'Your starred flagship tracks',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    trackIds: ['track-1', 'track-2', 'track-4', 'track-6'],
    isSystem: true,
    type: 'favorite',
    createdAt: Date.now()
  },
  {
    id: 'playlist-recent',
    title: 'Recently Played',
    description: 'Tracks played in your recent sessions',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    trackIds: ['track-2', 'track-1', 'track-5'],
    isSystem: true,
    type: 'recent',
    createdAt: Date.now()
  }
];

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'mood-workout',
    name: 'Workout',
    iconName: 'Zap',
    energy: 'High',
    tempoRange: '130 - 150 BPM',
    description: 'High energy basslines & fast tempos engineered to boost adrenaline during training.',
    explanation: 'You usually play energetic synthwave and heavy industrial rock during your afternoon workouts.',
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    color: '#ef4444',
    trackIds: ['track-1', 'track-4', 'track-6']
  },
  {
    id: 'mood-study',
    name: 'Study & Focus',
    iconName: 'Brain',
    energy: 'Low',
    tempoRange: '70 - 90 BPM',
    description: 'Relaxing lo-fi beats & vinyl textures designed to optimize deep focus.',
    explanation: 'Selected based on low-skip rates during extended study sessions.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    color: '#10b981',
    trackIds: ['track-2', 'track-5']
  },
  {
    id: 'mood-driving',
    name: 'Night Drive',
    iconName: 'Car',
    energy: 'High',
    tempoRange: '115 - 135 BPM',
    description: 'Retro synthwave and driving beats for highway cruising under city lights.',
    explanation: 'High replay count tracks tagged with driving energy.',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    color: '#8b5cf6',
    trackIds: ['track-1', 'track-3', 'track-6']
  },
  {
    id: 'mood-sleep',
    name: 'Deep Sleep',
    iconName: 'Moon',
    energy: 'Low',
    tempoRange: '50 - 70 BPM',
    description: 'Pure 432Hz delta waves and cosmic pads for peaceful REM sleep.',
    explanation: 'Zero lyrics and slow harmonic progressions.',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    color: '#3b82f6',
    trackIds: ['track-5']
  }
];

export const INITIAL_TRIP_PACKS: TripPack[] = [
  {
    id: 'trip-1',
    title: 'Gym & Cardio Session',
    activity: 'Gym',
    genre: 'Synthwave & Rock',
    mood: 'High Energy',
    energyLevel: 9,
    targetDurationMinutes: 180, // 3 hours
    storageLimitMB: 700,
    currentSizeMB: 546,
    progressPercentage: 78,
    status: 'downloaded',
    trackIds: ['track-1', 'track-4', 'track-6']
  }
];

export const INITIAL_UNLINKED_DOWNLOADS: UnlinkedDownload[] = [
  {
    id: 'download-1',
    rawFilename: 'Imagine_Dragons_Believer_Official_Audio_320k.mp3',
    filePath: '/storage/emulated/0/Download/Imagine_Dragons_Believer_Official_Audio_320k.mp3',
    fileSize: 8900000,
    detectedArtist: 'Imagine Dragons',
    detectedTitle: 'Believer',
    detectedAlbum: 'Evolve',
    detectedDuration: 204,
    matchScore: 98,
    status: 'unmatched'
  },
  {
    id: 'download-2',
    rawFilename: 'K-Pop_Luna_Nova_Starlight_Dynamite_M4A.m4a',
    filePath: '/storage/emulated/0/Download/K-Pop_Luna_Nova_Starlight_Dynamite_M4A.m4a',
    fileSize: 6400000,
    detectedArtist: 'Luna Nova',
    detectedTitle: 'Starlight Dynamite',
    detectedAlbum: 'Galaxy Prism',
    detectedDuration: 202,
    matchScore: 100,
    matchedTrackId: 'track-3',
    status: 'matched'
  }
];
