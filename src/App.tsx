import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PlayerProvider } from './context/PlayerContext';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { OneUIBottomNav } from './components/layout/OneUIBottomNav';
import { MiniPlayer } from './components/layout/MiniPlayer';
import { NotificationShade } from './components/layout/NotificationShade';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { SongDetailsScreen } from './components/screens/SongDetailsScreen';
import { AlbumDetailsScreen } from './components/screens/AlbumDetailsScreen';
import { ArtistDetailsScreen } from './components/screens/ArtistDetailsScreen';
import { NowPlayingScreen } from './components/player/NowPlayingScreen';
import { MusicVideoScreen } from './components/screens/MusicVideoScreen';
import { PlaylistsScreen } from './components/screens/PlaylistsScreen';
import { MoodEngineScreen } from './components/screens/MoodEngineScreen';
import { TripPacksScreen } from './components/screens/TripPacksScreen';
import { DownloadAssistantScreen } from './components/screens/DownloadAssistantScreen';
import { AudioLabScreen } from './components/screens/AudioLabScreen';
import { MediaAnalyzerScreen } from './components/screens/MediaAnalyzerScreen';
import { FileManagerScreen } from './components/screens/FileManagerScreen';
import { PrivateVaultScreen } from './components/screens/PrivateVaultScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const MainAppContent: React.FC = () => {
  const { activeScreen } = useApp();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen />;
      case 'library':
        return <LibraryScreen />;
      case 'song-details':
        return <SongDetailsScreen />;
      case 'album-details':
        return <AlbumDetailsScreen />;
      case 'artist-details':
        return <ArtistDetailsScreen />;
      case 'now-playing':
        return <NowPlayingScreen />;
      case 'music-videos':
        return <MusicVideoScreen />;
      case 'playlists':
        return <PlaylistsScreen />;
      case 'mood-engine':
        return <MoodEngineScreen />;
      case 'trip-packs':
        return <TripPacksScreen />;
      case 'download-assistant':
        return <DownloadAssistantScreen />;
      case 'audio-lab':
        return <AudioLabScreen />;
      case 'media-analyzer':
        return <MediaAnalyzerScreen />;
      case 'file-manager':
        return <FileManagerScreen />;
      case 'private-vault':
        return <PrivateVaultScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <DeviceFrame>
      <div className="min-h-full pb-6">
        {renderActiveScreen()}
        {activeScreen !== 'now-playing' && <MiniPlayer />}
        <OneUIBottomNav />
        <NotificationShade />
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PlayerProvider>
        <MainAppContent />
      </PlayerProvider>
    </AppProvider>
  );
}
