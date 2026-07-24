import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, initFirebaseAuth } from '../lib/firebase';
import { dbService } from './database';
import { Playlist, Track, TripPack, MusicVideo, UserSettings } from '../types/music';

export interface SyncPayload {
  syncCode: string;
  updatedAt: number;
  playlists: Playlist[];
  tracks: Track[];
  tripPacks: TripPack[];
  videos: MusicVideo[];
  userSettings?: UserSettings;
}

export class CloudSyncService {
  private syncCode: string = 'NOVA-SYNC-01';
  private unsubscribeListener: (() => void) | null = null;

  public setSyncCode(code: string) {
    if (code && code.trim()) {
      this.syncCode = code.trim().toUpperCase();
      localStorage.setItem('nova_sync_code', this.syncCode);
    }
  }

  public getSyncCode(): string {
    return localStorage.getItem('nova_sync_code') || this.syncCode;
  }

  /**
   * Pushes current local state (playlists, tracks, tripPacks, videos) to Firebase Firestore
   */
  public async pushToCloud(data: {
    playlists: Playlist[];
    tracks: Track[];
    tripPacks: TripPack[];
    videos: MusicVideo[];
    userSettings?: UserSettings;
  }): Promise<boolean> {
    try {
      await initFirebaseAuth();
      const code = this.getSyncCode();
      const docRef = doc(db, 'cloud_sync', code);

      const payload: SyncPayload = {
        syncCode: code,
        updatedAt: Date.now(),
        playlists: data.playlists,
        tracks: data.tracks,
        tripPacks: data.tripPacks,
        videos: data.videos,
        userSettings: data.userSettings
      };

      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (err) {
      console.error('Cloud Sync Push Error:', err);
      return false;
    }
  }

  /**
   * Pulls data from Firestore once for the given sync code
   */
  public async pullFromCloud(): Promise<SyncPayload | null> {
    try {
      await initFirebaseAuth();
      const code = this.getSyncCode();
      const docRef = doc(db, 'cloud_sync', code);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        return snapshot.data() as SyncPayload;
      }
      return null;
    } catch (err) {
      console.error('Cloud Sync Pull Error:', err);
      return null;
    }
  }

  /**
   * Listens for real-time Firestore updates and fires callback on change
   */
  public subscribeToCloudSync(
    onRemoteUpdate: (payload: SyncPayload) => void,
    onStatusChange?: (status: 'connected' | 'syncing' | 'error') => void
  ) {
    // Unsubscribe existing listener if any
    if (this.unsubscribeListener) {
      this.unsubscribeListener();
    }

    initFirebaseAuth().then(() => {
      const code = this.getSyncCode();
      const docRef = doc(db, 'cloud_sync', code);

      if (onStatusChange) onStatusChange('syncing');

      this.unsubscribeListener = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as SyncPayload;
            onRemoteUpdate(data);
            if (onStatusChange) onStatusChange('connected');
          }
        },
        (error) => {
          console.warn('Real-time sync error:', error);
          if (onStatusChange) onStatusChange('error');
        }
      );
    });

    return () => {
      if (this.unsubscribeListener) {
        this.unsubscribeListener();
      }
    };
  }
}

export const cloudSyncService = new CloudSyncService();
