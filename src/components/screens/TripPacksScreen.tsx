import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { Navigation, Plus, CheckCircle, Download, Play, HardDrive, Sparkles, X } from 'lucide-react';
import { TripPack } from '../../types/music';

export const TripPacksScreen: React.FC = () => {
  const { tripPacks, tracks, createTripPack, updateTripPackProgress } = useApp();
  const { playTrack } = usePlayer();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Wizard State
  const [title, setTitle] = useState('');
  const [activity, setActivity] = useState<'Gym' | 'Driving' | 'Travel' | 'Study' | 'Relax' | 'Custom'>('Gym');
  const [genre, setGenre] = useState('Synthwave & Electronic');
  const [durationMins, setDurationMins] = useState(180);
  const [storageLimitMB, setStorageLimitMB] = useState(700);

  const handleGeneratePack = () => {
    const matchedTracks = tracks.filter(t => t.energyLevel && t.energyLevel >= 6);
    const selectedTrackIds = matchedTracks.slice(0, 5).map(t => t.id);

    const newPack: TripPack = {
      id: 'trip-' + Date.now(),
      title: title || `${activity} Trip Pack`,
      activity,
      genre,
      mood: 'High Energy',
      energyLevel: 8,
      targetDurationMinutes: durationMins,
      storageLimitMB,
      currentSizeMB: Math.round(storageLimitMB * 0.8),
      progressPercentage: 100,
      status: 'downloaded',
      trackIds: selectedTrackIds
    };

    createTripPack(newPack);
    setWizardOpen(false);
    setStep(1);
  };

  return (
    <div className="space-y-4 pb-10">
      <OneUIHeader title="Trip Packs" subtitle="Offline Smart Trip Preparation Engine" />

      {/* Main Hero Header */}
      <div className="mx-4 p-5 rounded-[32px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/50 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Prepare For Your Trip</h2>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
            OFFLINE SYNC
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
          Never get caught without music on flights or road trips. Generate targeted music packs bounded by exact duration and storage limits.
        </p>

        <button
          onClick={() => setWizardOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
          id="btn-open-trip-wizard"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Trip Pack Wizard</span>
        </button>
      </div>

      {/* Downloaded Trip Packs List */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Downloaded Trip Packs ({tripPacks.length})</h3>

        {tripPacks.map(pack => {
          const packTracks = tracks.filter(t => pack.trackIds.includes(t.id));
          return (
            <div key={pack.id} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-[28px] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{pack.title}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {pack.activity} • {pack.targetDurationMinutes} Mins • {pack.storageLimitMB} MB Limit
                  </p>
                </div>

                <button
                  onClick={() => packTracks.length > 0 && playTrack(packTracks[0], packTracks)}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-900/30 transition"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              {/* Storage & Download Progress Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                  <span>Storage: {pack.currentSizeMB} MB / {pack.storageLimitMB} MB</span>
                  <span className="text-blue-400 font-bold">{pack.progressPercentage}% Downloaded</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full transition-all duration-500" style={{ width: `${pack.progressPercentage}%` }}></div>
                </div>
              </div>

              {/* Track Status Badges */}
              <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                {packTracks.map(track => (
                  <div key={track.id} className="flex items-center justify-between text-xs text-zinc-300 p-1.5 bg-black/40 rounded-xl border border-zinc-800/50">
                    <span className="truncate max-w-[200px] font-medium">{track.title}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      <span>Downloaded</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3-Step Wizard Modal */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Trip Pack Wizard (Step {step}/3)</h3>
              </div>
              <button onClick={() => setWizardOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {step === 1 ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-white">Select Activity / Destination</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Gym', 'Driving', 'Travel', 'Study', 'Relax', 'Custom'] as const).map(act => (
                    <button
                      key={act}
                      onClick={() => setActivity(act)}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-center transition ${
                        activity === act ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-black/50 text-neutral-300 border-white/10'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-2xl text-xs font-bold mt-2"
                >
                  Next Step →
                </button>
              </div>
            ) : step === 2 ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Pack Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Flight to Tokyo 8 Hours"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Target Duration ({durationMins} Mins)</label>
                  <input
                    type="range"
                    min="30"
                    max="600"
                    step="30"
                    value={durationMins}
                    onChange={e => setDurationMins(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-neutral-800 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Storage Limit ({storageLimitMB} MB)</label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={storageLimitMB}
                    onChange={e => setStorageLimitMB(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-neutral-800 rounded-lg"
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="w-1/2 bg-white/10 text-white py-2.5 rounded-2xl text-xs font-bold">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="w-1/2 bg-emerald-600 text-white py-2.5 rounded-2xl text-xs font-bold">
                    Generate Pack
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <Sparkles className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">Trip Pack Ready!</h4>
                <p className="text-xs text-neutral-300">
                  Compiled {activity} Pack with {durationMins} mins duration under {storageLimitMB}MB storage cap.
                </p>

                <button
                  onClick={handleGeneratePack}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl text-xs font-bold shadow-lg"
                >
                  Save & Download Pack
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
