import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sliders, ShieldCheck } from 'lucide-react';

interface OneUIHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

export const OneUIHeader: React.FC<OneUIHeaderProps> = ({ title, subtitle, showSearch = true }) => {
  const { searchQuery, setSearchQuery, setNotificationShadeOpen, notificationShadeOpen, setActiveScreen } = useApp();

  return (
    <div className="pt-4 px-4 pb-2 bg-gradient-to-b from-zinc-950/90 via-zinc-900/80 to-black sticky top-0 z-30 backdrop-blur-lg border-b border-zinc-800">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('audio-lab')}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300 transition"
            title="Audio Lab & Equalizer"
            id="btn-header-audio-lab"
          >
            <Sliders className="w-4 h-4 text-blue-400" />
          </button>

          <button
            onClick={() => setActiveScreen('private-vault')}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300 transition"
            title="Private Vault"
            id="btn-header-vault"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => setNotificationShadeOpen(!notificationShadeOpen)}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300 relative transition"
            title="Android Notification Panel"
            id="btn-header-notifications"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="relative mt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, albums, moods..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 transition"
            id="input-global-search"
          />
        </div>
      )}
    </div>
  );
};
