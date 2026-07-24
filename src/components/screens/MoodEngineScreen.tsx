import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { MOOD_PRESETS } from '../../services/sampleData';
import { Sparkles, Play, Zap, Brain, Car, Moon, Sliders, Shield } from 'lucide-react';

export const MoodEngineScreen: React.FC = () => {
  const { tracks } = useApp();
  const { playTrack } = usePlayer();

  const [energyFilter, setEnergyFilter] = useState(7);
  const [tempoFilter, setTempoFilter] = useState(120);

  // Generate dynamic tuned queue based on energy and tempo matrix
  const tunedTracks = tracks.filter(t => {
    const energy = t.energyLevel || 5;
    const bpm = t.bpm || 120;
    return Math.abs(energy - energyFilter) <= 3 && Math.abs(bpm - tempoFilter) <= 35;
  });

  return (
    <div className="space-y-5 pb-10">
      <OneUIHeader title="Nova Mood AI" subtitle="Offline Machine Learning Audio Engine" />

      {/* AI Privacy & Status Card */}
      <div className="mx-4 p-4 rounded-[32px] bg-zinc-900/90 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Local Neural Matrix</h3>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1 border border-emerald-500/30">
            <Shield className="w-3 h-3" />
            <span>100% On-Device Privacy</span>
          </span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Analyzes tempo, energy level, skip ratios, and replay patterns locally. No listening habits ever leave your Galaxy device.
        </p>
      </div>

      {/* Interactive "Tune My Mood" Matrix */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tune My Mood Matrix</h3>
          </div>
          <span className="text-xs font-mono text-blue-300">{tunedTracks.length} Matched Tracks</span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-zinc-300 mb-1">
            <span>Energy Level</span>
            <span className="font-mono text-blue-400 font-bold">{energyFilter} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyFilter}
            onChange={e => setEnergyFilter(parseInt(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-zinc-300 mb-1">
            <span>Tempo Target (BPM)</span>
            <span className="font-mono text-blue-400 font-bold">{tempoFilter} BPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="160"
            step="5"
            value={tempoFilter}
            onChange={e => setTempoFilter(parseInt(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <button
          onClick={() => tunedTracks.length > 0 && playTrack(tunedTracks[0], tunedTracks)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
          id="btn-play-tuned-mood"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Play Tuned Mood Queue ({tunedTracks.length})</span>
        </button>
      </div>

      {/* Preset Mood Cards */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Offline Mood Presets</h3>

        <div className="space-y-3">
          {MOOD_PRESETS.map(mood => {
            const moodTracks = tracks.filter(t => mood.trackIds.includes(t.id));
            return (
              <div
                key={mood.id}
                className="p-4 bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/50 rounded-[28px] transition space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={mood.coverUrl} alt={mood.name} className="w-12 h-12 rounded-2xl object-cover border border-zinc-700/50" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{mood.name} Mode</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">{mood.tempoRange} • {mood.energy} Energy</p>
                    </div>
                  </div>

                  <button
                    onClick={() => moodTracks.length > 0 && playTrack(moodTracks[0], moodTracks)}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-900/30 transition"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">{mood.description}</p>

                <div className="p-2.5 bg-black/60 rounded-2xl border border-zinc-800 text-[11px] text-blue-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">AI Reason:</span>
                    <span>"{mood.explanation}"</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
