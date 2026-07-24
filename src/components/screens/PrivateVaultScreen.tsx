import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { ShieldCheck, Fingerprint, Lock, Unlock, Eye, Play, ShieldAlert } from 'lucide-react';

export const PrivateVaultScreen: React.FC = () => {
  const { vaultUnlocked, setVaultUnlocked, tracks, videos, toggleTrackVault, showToast } = useApp();
  const { playTrack } = usePlayer();

  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const vaultedTracks = tracks.filter(t => t.isVaulted);

  const handleUnlockPin = () => {
    if (pinInput === '1234') {
      setVaultUnlocked(true);
      setErrorMsg('');
      showToast('Vault Unlocked!');
    } else {
      setErrorMsg('Incorrect PIN. Default PIN is 1234');
    }
  };

  const handleBiometricScan = () => {
    setVaultUnlocked(true);
    showToast('Biometric Fingerprint Accepted!');
  };

  if (!vaultUnlocked) {
    return (
      <div className="space-y-6 pb-10">
        <OneUIHeader title="Private Vault" subtitle="Samsung Knox Biometric Security" />

        <div className="mx-4 p-6 rounded-[32px] bg-zinc-900/90 border border-red-500/30 shadow-2xl flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/40">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Private Vault Encrypted</h3>
            <p className="text-xs text-zinc-400 mt-1">Authenticate to view hidden audio and music videos</p>
          </div>

          {/* Biometric Button */}
          <button
            onClick={handleBiometricScan}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            id="btn-vault-biometric"
          >
            <Fingerprint className="w-5 h-5" />
            <span>Scan Fingerprint</span>
          </button>

          <div className="w-full flex items-center gap-2 my-2">
            <div className="h-[1px] bg-zinc-800 flex-1"></div>
            <span className="text-[10px] text-zinc-500 font-mono">OR USE PIN</span>
            <div className="h-[1px] bg-zinc-800 flex-1"></div>
          </div>

          {/* PIN Input */}
          <div className="w-full space-y-2">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Enter 4-digit PIN (default 1234)"
              className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-4 py-2.5 text-center text-sm tracking-widest font-mono text-white focus:outline-none focus:border-blue-500"
              id="input-vault-pin"
            />
            {errorMsg && <p className="text-[10px] text-red-400">{errorMsg}</p>}

            <button
              onClick={handleUnlockPin}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-2xl text-xs font-bold transition border border-zinc-700/50"
            >
              Unlock with PIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Private Vault Unlocked</h2>
        </div>

        <button
          onClick={() => setVaultUnlocked(false)}
          className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 border border-red-500/30"
          id="btn-lock-vault"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Vault</span>
        </button>
      </div>

      {/* Vaulted Items */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">
          Hidden Vault Media ({vaultedTracks.length})
        </h3>

        {vaultedTracks.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 rounded-[28px] bg-zinc-900/60">
            No items in vault. Select "Move to Vault" on any song to protect it here.
          </div>
        ) : (
          vaultedTracks.map(track => (
            <div key={track.id} className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between">
              <div
                onClick={() => playTrack(track, vaultedTracks)}
                className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
              >
                <img src={track.artworkUrl} alt={track.title} className="w-10 h-10 rounded-xl object-cover border border-zinc-700/50" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                  <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
                </div>
              </div>

              <button
                onClick={() => toggleTrackVault(track.id)}
                className="p-2 text-blue-400 hover:text-white transition"
                title="Restore to Library"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
