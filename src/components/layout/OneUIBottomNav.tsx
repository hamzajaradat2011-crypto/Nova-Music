import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Music,
  Film,
  Sparkles,
  Navigation,
  Grid,
  Sliders,
  Settings,
  FolderTree,
  ShieldCheck,
  DownloadCloud,
  FileSearch
} from 'lucide-react';
import { ScreenId } from '../../types/music';

export const OneUIBottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen } = useApp();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Music },
    { id: 'music-videos', label: 'Videos', icon: Film },
    { id: 'mood-engine', label: 'Mood AI', icon: Sparkles },
    { id: 'trip-packs', label: 'Trips', icon: Navigation }
  ];

  const moreItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'audio-lab', label: 'Audio Lab (EQ)', icon: Sliders, color: 'text-violet-400' },
    { id: 'download-assistant', label: 'Smart Downloads', icon: DownloadCloud, color: 'text-emerald-400' },
    { id: 'media-analyzer', label: 'Media Analyzer', icon: FileSearch, color: 'text-amber-400' },
    { id: 'file-manager', label: 'File Manager', icon: FolderTree, color: 'text-blue-400' },
    { id: 'private-vault', label: 'Private Vault', icon: ShieldCheck, color: 'text-red-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-neutral-400' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 px-2 py-1.5 flex items-center justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setMoreMenuOpen(false);
              setActiveScreen(item.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
              isActive ? 'text-blue-400 bg-blue-600/10' : 'text-zinc-400 hover:text-white'
            }`}
            id={`nav-tab-${item.id}`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </button>
        );
      })}

      {/* More Ecosystem Drawer Trigger */}
      <button
        onClick={() => setMoreMenuOpen(!moreMenuOpen)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
          moreMenuOpen ? 'text-blue-400 bg-blue-600/10' : 'text-zinc-400 hover:text-white'
        }`}
        id="nav-tab-more"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Ecosystem</span>
      </button>

      {/* More Ecosystem Popup Menu */}
      {moreMenuOpen && (
        <div className="absolute bottom-16 right-3 bg-zinc-900/95 border border-zinc-700/60 rounded-3xl p-3 shadow-2xl w-56 backdrop-blur-2xl grid grid-cols-2 gap-2 z-50">
          {moreItems.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMoreMenuOpen(false);
                  setActiveScreen(m.id);
                }}
                className="flex flex-col items-center justify-center p-2.5 bg-zinc-800/60 hover:bg-zinc-800 rounded-2xl text-center transition border border-zinc-700/40"
                id={`btn-more-${m.id}`}
              >
                <Icon className={`w-5 h-5 ${m.color} mb-1`} />
                <span className="text-[10px] font-medium text-white">{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
