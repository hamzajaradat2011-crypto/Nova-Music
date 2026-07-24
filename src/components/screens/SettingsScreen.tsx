import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { Settings, Moon, Palette, Shield, Sliders, Database, RotateCcw, Download, Upload, Cloud, RefreshCw, CheckCircle2, CloudLightning, Headphones, Lock } from 'lucide-react';
import { dbService } from '../../services/database';

export const SettingsScreen: React.FC = () => {
  const {
    userSettings,
    updateUserSettings,
    showToast,
    syncStatus,
    syncCode,
    lastSyncTime,
    updateSyncCode,
    pushCloudSync,
    pullCloudSync
  } = useApp();

  const [codeInput, setCodeInput] = useState(syncCode);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleForceSync = async () => {
    setIsManualSyncing(true);
    await pushCloudSync();
    await pullCloudSync();
    setIsManualSyncing(false);
    showToast('Manual cloud sync completed!');
  };

  const formattedSyncTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' (' + new Date(lastSyncTime).toLocaleDateString() + ')'
    : 'Not synced yet';

  return (
    <div className="space-y-4 pb-12">
      <OneUIHeader title="Settings" subtitle="Samsung One UI 7 Customization & Preferences" />

      {/* Cloud & Sync Section */}
      <div className="mx-4 p-4 bg-zinc-900/90 border border-blue-500/30 rounded-[28px] space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cloud & Sync</h3>
          </div>

          <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            syncStatus === 'connected'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : syncStatus === 'syncing' || isManualSyncing
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === 'connected' && !isManualSyncing ? 'bg-emerald-400' : 'bg-blue-400'
            }`} />
            {syncStatus === 'connected' && !isManualSyncing ? 'Connected' : 'Syncing...'}
          </span>
        </div>

        {/* Last Successful Sync Time */}
        <div className="bg-black/50 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Last Successful Sync</p>
            <p className="text-xs font-semibold font-mono text-blue-300 mt-0.5">{formattedSyncTime}</p>
          </div>

          <button
            onClick={handleForceSync}
            disabled={isManualSyncing}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/40"
            id="btn-force-cloud-sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
            <span>{isManualSyncing ? 'Syncing...' : 'Force Sync Now'}</span>
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Your custom playlists, offline trip packs, MP3 library metadata, and preferences automatically sync across Web and APK using your unique Cloud Sync Passcode via Google Firebase Firestore.
        </p>

        {/* Sync Code Input */}
        <div className="bg-black/60 p-3 rounded-2xl border border-zinc-800 space-y-2">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Cloud Sync Passcode (Web & APK)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. NOVA-SYNC-01"
              className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-1.5 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500 font-bold"
            />
            <button
              onClick={() => updateSyncCode(codeInput)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-zinc-700/60"
            >
              Update Passcode
            </button>
          </div>
        </div>

        {/* Manual Direct Push / Pull Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={pushCloudSync}
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Force Push</span>
          </button>

          <button
            onClick={pullCloudSync}
            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span>Force Pull</span>
          </button>
        </div>
      </div>

      {/* Background & Lock Screen Playback Section */}
      <div className="mx-4 p-4 bg-zinc-900/90 border border-emerald-500/30 rounded-[28px] space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Background & Lock Screen Playback</h3>
          </div>

          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active OS MediaSession
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Keep your audio playing seamlessly when minimizing the app, locking your smartphone, or turning off the screen. Includes native MediaSession lock screen playback widgets, headphone hardware button controls, and screen wake lock.
        </p>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between bg-black/50 p-3 rounded-2xl border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                Background Audio Playback
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Continue playing music when switching apps or minimizing</p>
            </div>
            <input
              type="checkbox"
              checked={userSettings.backgroundPlaybackEnabled ?? true}
              onChange={e => {
                updateUserSettings({ backgroundPlaybackEnabled: e.target.checked });
                showToast(e.target.checked ? 'Background audio playback enabled' : 'Background audio playback disabled');
              }}
              className="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between bg-black/50 p-3 rounded-2xl border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Lock Screen Media Widgets
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Show track artwork, seekbar & play/next controls on lock screen</p>
            </div>
            <input
              type="checkbox"
              checked={userSettings.lockScreenControlsEnabled ?? true}
              onChange={e => {
                updateUserSettings({ lockScreenControlsEnabled: e.target.checked });
                showToast(e.target.checked ? 'Lock screen media controls enabled' : 'Lock screen controls disabled');
              }}
              className="accent-blue-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Palette className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Appearance & Theme</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">AMOLED Black Mode</p>
            <p className="text-[10px] text-zinc-400">Pure #000000 black canvas for Galaxy OLED screens</p>
          </div>
          <input
            type="checkbox"
            checked={userSettings.amoledMode}
            onChange={e => updateUserSettings({ amoledMode: e.target.checked })}
            className="accent-blue-600 w-4 h-4 cursor-pointer"
          />
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold text-white mb-2">Accent Color Palette</p>
          <div className="flex gap-2">
            {(['sapphire', 'violet', 'emerald', 'amber', 'crimson'] as const).map(color => (
              <button
                key={color}
                onClick={() => updateUserSettings({ accentColor: color })}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === 'sapphire'
                    ? 'bg-blue-600'
                    : color === 'violet'
                    ? 'bg-violet-600'
                    : color === 'emerald'
                    ? 'bg-emerald-600'
                    : color === 'amber'
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                } ${userSettings.accentColor === color ? 'scale-125 ring-2 ring-white shadow-lg' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Music & Scanner Settings */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Scanner & Lyrics</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Auto-Fetch Synced Lyrics</p>
            <p className="text-[10px] text-zinc-400">Extracts lyrics from embedded ID3 tags</p>
          </div>
          <input
            type="checkbox"
            checked={userSettings.autoLyrics}
            onChange={e => updateUserSettings({ autoLyrics: e.target.checked })}
            className="accent-blue-600 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* Security Settings */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Vault & Security</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Biometric Unlock</p>
            <p className="text-[10px] text-zinc-400">Use Samsung Pass Fingerprint scanner</p>
          </div>
          <input
            type="checkbox"
            checked={userSettings.biometricEnabled}
            onChange={e => updateUserSettings({ biometricEnabled: e.target.checked })}
            className="accent-blue-600 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* Sync & Backup Section */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Database className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sync & Web-to-APK Transfer</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Export your web playlists, preferences, and offline library configuration into a backup file, then import it into your installed APK to keep your progress synced!
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={async () => {
              try {
                const backupData = {
                  version: 1,
                  timestamp: Date.now(),
                  tracks: await dbService.getAll('tracks'),
                  playlists: await dbService.getAll('playlists'),
                  tripPacks: await dbService.getAll('tripPacks'),
                  videos: await dbService.getAll('videos'),
                  scans: await dbService.getAll('scans'),
                  settings: userSettings
                };

                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `NovaMusic_Web_Backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Exported backup file successfully!');
              } catch (err) {
                showToast('Failed to export backup data.');
              }
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Export Web Progress</span>
          </button>

          <label className="bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-zinc-700/50 cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Import to APK</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  const text = await file.text();
                  const data = JSON.parse(text);

                  if (data.tracks && Array.isArray(data.tracks)) await dbService.putMany('tracks', data.tracks);
                  if (data.playlists && Array.isArray(data.playlists)) await dbService.putMany('playlists', data.playlists);
                  if (data.tripPacks && Array.isArray(data.tripPacks)) await dbService.putMany('tripPacks', data.tripPacks);
                  if (data.videos && Array.isArray(data.videos)) await dbService.putMany('videos', data.videos);
                  if (data.settings) updateUserSettings(data.settings);

                  showToast('Import successful! Refreshing page to apply...');
                  setTimeout(() => window.location.reload(), 1200);
                } catch (err) {
                  showToast('Invalid backup JSON file');
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Reset & Storage */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <RotateCcw className="w-4 h-4 text-red-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Reset Database</h3>
        </div>

        <button
          onClick={() => {
            indexedDB.deleteDatabase('NovaMusicDB');
            showToast('Reset database to defaults. Please refresh page.');
          }}
          className="w-full bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Database & Clear Cache</span>
        </button>
      </div>
    </div>
  );
};
