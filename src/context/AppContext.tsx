import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenId,
  Track,
  Album,
  Artist,
  MusicVideo,
  Playlist,
  TripPack,
  UnlinkedDownload,
  MediaFileScan,
  UserSettings
} from '../types/music';
import { dbService } from '../services/database';
import { cloudSyncService, SyncPayload } from '../services/cloudSync';
import {
  INITIAL_TRACKS,
  INITIAL_ALBUMS,
  INITIAL_ARTISTS,
  INITIAL_MUSIC_VIDEOS,
  INITIAL_PLAYLISTS,
  INITIAL_TRIP_PACKS,
  INITIAL_UNLINKED_DOWNLOADS
} from '../services/sampleData';

interface AppContextType {
  activeScreen: ScreenId;
  activeDetailId: string | null;
  searchQuery: string;
  deviceFrame: 'galaxy' | 'fullscreen';
  notificationShadeOpen: boolean;
  vaultUnlocked: boolean;
  toastMessage: string | null;

  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  videos: MusicVideo[];
  playlists: Playlist[];
  tripPacks: TripPack[];
  unlinkedDownloads: UnlinkedDownload[];
  mediaScans: MediaFileScan[];
  userSettings: UserSettings;

  setActiveScreen: (screen: ScreenId, detailId?: string | null) => void;
  setSearchQuery: (query: string) => void;
  setDeviceFrame: (frame: 'galaxy' | 'fullscreen') => void;
  setNotificationShadeOpen: (open: boolean) => void;
  setVaultUnlocked: (unlocked: boolean) => void;
  showToast: (message: string) => void;

  addTrack: (track: Track) => void;
  updateTrack: (track: Track) => void;
  deleteTrack: (trackId: string) => void;
  addVideo: (video: MusicVideo) => void;
  updateVideo: (video: MusicVideo) => void;
  deleteVideo: (videoId: string) => void;
  createPlaylist: (title: string, description?: string, coverUrl?: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  createTripPack: (trip: TripPack) => void;
  updateTripPackProgress: (id: string, progress: number, sizeMB: number) => void;
  resolveUnlinkedDownload: (id: string, trackId: string) => void;
  addMediaScan: (scan: MediaFileScan) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  toggleTrackVault: (trackId: string) => void;
  syncStatus: 'connected' | 'syncing' | 'error';
  syncCode: string;
  lastSyncTime: number | null;
  updateSyncCode: (code: string) => void;
  pushCloudSync: () => Promise<void>;
  pullCloudSync: () => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  amoledMode: true,
  accentColor: 'violet',
  playerLayout: 'oneui7',
  scannedFolders: ['/storage/emulated/0/Music', '/storage/emulated/0/Download'],
  excludedFolders: ['/storage/emulated/0/Android'],
  animationSpeed: 'normal',
  autoLyrics: true,
  biometricEnabled: true,
  vaultPin: '1234',
  backgroundPlaybackEnabled: true,
  lockScreenControlsEnabled: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreenState] = useState<ScreenId>('home');
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFrame, setDeviceFrame] = useState<'galaxy' | 'fullscreen'>('galaxy');
  const [notificationShadeOpen, setNotificationShadeOpen] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [videos, setVideos] = useState<MusicVideo[]>(INITIAL_MUSIC_VIDEOS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [tripPacks, setTripPacks] = useState<TripPack[]>(INITIAL_TRIP_PACKS);
  const [unlinkedDownloads, setUnlinkedDownloads] = useState<UnlinkedDownload[]>(INITIAL_UNLINKED_DOWNLOADS);
  const [mediaScans, setMediaScans] = useState<MediaFileScan[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'error'>('connected');
  const [syncCode, setSyncCodeState] = useState<string>(cloudSyncService.getSyncCode());
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(Date.now());

  // Function to manually or automatically push state to cloud
  const pushCloudSync = async () => {
    setSyncStatus('syncing');
    const success = await cloudSyncService.pushToCloud({
      playlists,
      tracks,
      tripPacks,
      videos,
      userSettings
    });
    if (success) {
      setLastSyncTime(Date.now());
      setSyncStatus('connected');
    } else {
      setSyncStatus('error');
    }
  };

  // Function to pull state from cloud
  const pullCloudSync = async () => {
    setSyncStatus('syncing');
    const remoteData = await cloudSyncService.pullFromCloud();
    if (remoteData) {
      applyRemoteData(remoteData);
      setLastSyncTime(remoteData.updatedAt || Date.now());
      showToast('Synced latest progress from cloud!');
      setSyncStatus('connected');
    } else {
      setSyncStatus('error');
    }
  };

  const updateSyncCode = (code: string) => {
    cloudSyncService.setSyncCode(code);
    setSyncCodeState(cloudSyncService.getSyncCode());
    showToast(`Updated Sync Code to: ${cloudSyncService.getSyncCode()}`);
    pullCloudSync();
  };

  // Apply remote dataset to local state and IndexedDB
  const applyRemoteData = (data: SyncPayload) => {
    if (data.playlists && Array.isArray(data.playlists) && data.playlists.length > 0) {
      setPlaylists(data.playlists);
      dbService.putMany('playlists', data.playlists);
    }
    if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
      setTracks(data.tracks);
      dbService.putMany('tracks', data.tracks);
    }
    if (data.tripPacks && Array.isArray(data.tripPacks) && data.tripPacks.length > 0) {
      setTripPacks(data.tripPacks);
      dbService.putMany('tripPacks', data.tripPacks);
    }
    if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
      setVideos(data.videos);
      dbService.putMany('videos', data.videos);
    }
    if (data.userSettings) {
      setUserSettings(data.userSettings);
      dbService.setKeyVal('user_settings', data.userSettings);
    }
    if (data.updatedAt) {
      setLastSyncTime(data.updatedAt);
    } else {
      setLastSyncTime(Date.now());
    }
  };

  // Subscribe to real-time cloud updates
  useEffect(() => {
    const unsubscribe = cloudSyncService.subscribeToCloudSync(
      (remotePayload) => {
        applyRemoteData(remotePayload);
      },
      (status) => setSyncStatus(status)
    );

    return () => unsubscribe();
  }, [syncCode]);

  // Auto-sync local state changes to Firebase Cloud
  useEffect(() => {
    const timer = setTimeout(async () => {
      const success = await cloudSyncService.pushToCloud({
        playlists,
        tracks,
        tripPacks,
        videos,
        userSettings
      });
      if (success) {
        setLastSyncTime(Date.now());
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [playlists, tracks, tripPacks, videos, userSettings]);

  // Load persistent DB state
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedTracks = await dbService.getAll<Track>('tracks');
        if (storedTracks.length > 0) setTracks(storedTracks);

        const storedAlbums = await dbService.getAll<Album>('albums');
        if (storedAlbums.length > 0) setAlbums(storedAlbums);

        const storedArtists = await dbService.getAll<Artist>('artists');
        if (storedArtists.length > 0) setArtists(storedArtists);

        const storedVideos = await dbService.getAll<MusicVideo>('videos');
        if (storedVideos.length > 0) setVideos(storedVideos);

        const storedPlaylists = await dbService.getAll<Playlist>('playlists');
        if (storedPlaylists.length > 0) setPlaylists(storedPlaylists);

        const storedPacks = await dbService.getAll<TripPack>('tripPacks');
        if (storedPacks.length > 0) setTripPacks(storedPacks);

        const storedDownloads = await dbService.getAll<UnlinkedDownload>('downloads');
        if (storedDownloads.length > 0) setUnlinkedDownloads(storedDownloads);

        const storedSettings = await dbService.getKeyVal<UserSettings>('user_settings');
        if (storedSettings) setUserSettings(storedSettings);
      } catch (err) {
        console.warn('Error loading stored DB data:', err);
      }
    }

    loadStoredData();
  }, []);

  const setActiveScreen = (screen: ScreenId, detailId: string | null = null) => {
    setActiveScreenState(screen);
    setActiveDetailId(detailId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addTrack = (track: Track) => {
    setTracks(prev => [track, ...prev]);
    dbService.put('tracks', track);
    showToast(`Added track: ${track.title}`);
  };

  const updateTrack = (updatedTrack: Track) => {
    setTracks(prev => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
    dbService.put('tracks', updatedTrack);
    showToast('Track metadata saved');
  };

  const deleteTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    dbService.delete('tracks', trackId);
    showToast('Track removed from library');
  };

  const addVideo = (video: MusicVideo) => {
    setVideos(prev => [video, ...prev]);
    dbService.put('videos', video);
    showToast(`Added video: ${video.title}`);
  };

  const updateVideo = (updatedVideo: MusicVideo) => {
    setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
    dbService.put('videos', updatedVideo);
    showToast(`Updated video details for "${updatedVideo.title}"`);
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    dbService.delete('videos', videoId);
    showToast('Video removed from library');
  };

  const createPlaylist = (title: string, description: string = '', coverUrl?: string) => {
    const newPlaylist: Playlist = {
      id: 'pl-' + Date.now(),
      title,
      description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
      trackIds: [],
      type: 'user',
      createdAt: Date.now()
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    dbService.put('playlists', newPlaylist);
    showToast(`Created playlist: ${title}`);
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          const exists = p.trackIds.includes(trackId);
          const newTrackIds = exists ? p.trackIds : [...p.trackIds, trackId];
          const updated = { ...p, trackIds: newTrackIds };
          dbService.put('playlists', updated);
          return updated;
        }
        return p;
      })
    );
    showToast('Track added to playlist');
  };

  const createTripPack = (trip: TripPack) => {
    setTripPacks(prev => [trip, ...prev]);
    dbService.put('tripPacks', trip);
    showToast(`Created Trip Pack: ${trip.title}`);
  };

  const updateTripPackProgress = (id: string, progress: number, sizeMB: number) => {
    setTripPacks(prev =>
      prev.map(tp => {
        if (tp.id === id) {
          const status = progress >= 100 ? 'downloaded' : 'downloading';
          const updated: TripPack = {
            ...tp,
            progressPercentage: progress,
            currentSizeMB: sizeMB,
            status
          };
          dbService.put('tripPacks', updated);
          return updated;
        }
        return tp;
      })
    );
  };

  const resolveUnlinkedDownload = (id: string, trackId: string) => {
    setUnlinkedDownloads(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'added', matchedTrackId: trackId, matchScore: 100 } : d))
    );
    showToast('Linked download file to metadata!');
  };

  const addMediaScan = (scan: MediaFileScan) => {
    setMediaScans(prev => [scan, ...prev]);
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const updated = { ...prev, ...settings };
      dbService.setKeyVal('user_settings', updated);
      return updated;
    });
    showToast('Settings saved');
  };

  const toggleTrackVault = (trackId: string) => {
    setTracks(prev =>
      prev.map(t => {
        if (t.id === trackId) {
          const isVaulted = !t.isVaulted;
          const updated = { ...t, isVaulted };
          dbService.put('tracks', updated);
          showToast(isVaulted ? 'Moved track to Private Vault' : 'Restored track to Library');
          return updated;
        }
        return t;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        activeDetailId,
        searchQuery,
        deviceFrame,
        notificationShadeOpen,
        vaultUnlocked,
        toastMessage,
        tracks,
        albums,
        artists,
        videos,
        playlists,
        tripPacks,
        unlinkedDownloads,
        mediaScans,
        userSettings,
        setActiveScreen,
        setSearchQuery,
        setDeviceFrame,
        setNotificationShadeOpen,
        setVaultUnlocked,
        showToast,
        addTrack,
        updateTrack,
        deleteTrack,
        addVideo,
        updateVideo,
        deleteVideo,
        createPlaylist,
        addTrackToPlaylist,
        createTripPack,
        updateTripPackProgress,
        resolveUnlinkedDownload,
        addMediaScan,
        updateUserSettings,
        toggleTrackVault,
        syncStatus,
        syncCode,
        lastSyncTime,
        updateSyncCode,
        pushCloudSync,
        pullCloudSync
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
