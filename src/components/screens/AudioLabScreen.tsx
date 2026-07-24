import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { OneUIHeader } from '../layout/OneUIHeader';
import { VisualizerCanvas } from '../player/VisualizerCanvas';
import { Sliders, Volume2, Zap, Gauge, Radio, Sparkles } from 'lucide-react';
import { EqualizerBand } from '../../types/music';

export const AudioLabScreen: React.FC = () => {
  const { equalizerSettings, updateEqualizer, playbackSpeed, setPlaybackSpeed } = usePlayer();

  const presets = [
    'Flat',
    'Bass Booster',
    'Rock',
    'Pop',
    'Jazz',
    'Vocal',
    'Classical',
    'Electronic'
  ] as const;

  const presetGains: Record<string, number[]> = {
    Flat: [0, 0, 0, 0, 0],
    'Bass Booster': [8, 5, 1, 0, 2],
    Rock: [5, 3, 0, 3, 5],
    Pop: [-1, 2, 4, 2, -1],
    Jazz: [3, 2, -1, 2, 4],
    Vocal: [-2, 1, 5, 3, 0],
    Classical: [4, 2, 0, 2, 4],
    Electronic: [6, 4, 0, 2, 6]
  };

  const selectPreset = (presetName: typeof presets[number]) => {
    const gains = presetGains[presetName] || [0, 0, 0, 0, 0];
    const newBands = equalizerSettings.bands.map((b, idx) => ({
      ...b,
      gain: gains[idx] ?? 0
    }));
    updateEqualizer({ preset: presetName, bands: newBands });
  };

  const handleBandGainChange = (bandIdx: number, newGain: number) => {
    const newBands = equalizerSettings.bands.map((b, i) => (i === bandIdx ? { ...b, gain: newGain } : b));
    updateEqualizer({ preset: 'Custom', bands: newBands });
  };

  return (
    <div className="space-y-5 pb-10">
      <OneUIHeader title="Audio Lab & Equalizer" subtitle="Samsung Galaxy Audio DSP Engine" />

      {/* Equalizer Power Switch & Visualizer */}
      <div className="mx-4 p-4 rounded-[32px] bg-zinc-900/90 border border-blue-500/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">5-Band Equalizer</h3>
              <p className="text-[10px] text-zinc-400">Web Audio API Low/Peak/High Shelf Filters</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={equalizerSettings.enabled}
              onChange={e => updateEqualizer({ enabled: e.target.checked })}
              className="sr-only peer"
              id="toggle-eq-enabled"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <VisualizerCanvas mode="bars" />
      </div>

      {/* Preset Pills Carousel */}
      <div className="px-4">
        <label className="text-[10px] text-zinc-400 block mb-2 font-bold uppercase tracking-wider">Audio Presets</label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => selectPreset(p)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                equalizerSettings.preset === p
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
              id={`preset-${p.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Sliders for Bands */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-4">
        <label className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Band Frequency Gains (-12dB to +12dB)</label>

        <div className="grid grid-cols-5 gap-2 text-center">
          {equalizerSettings.bands.map((band: EqualizerBand, idx: number) => (
            <div key={band.label} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-blue-300 font-bold">{band.gain > 0 ? `+${band.gain}` : band.gain}dB</span>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={band.gain}
                onChange={e => handleBandGainChange(idx, parseInt(e.target.value))}
                className="w-full accent-blue-500 h-28 bg-zinc-800 rounded-lg [writing-mode:vertical-lr] [direction:rtl] cursor-pointer mx-auto"
                id={`band-slider-${band.label}`}
              />
              <span className="text-[10px] font-mono text-zinc-400 font-bold">{band.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bass Boost & Treble Enhancers */}
      <div className="mx-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[28px] space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-blue-400">Bass & Sound Effects</h3>

        <div>
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Bass Boost</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">{equalizerSettings.bassBoost}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={equalizerSettings.bassBoost}
            onChange={e => updateEqualizer({ bassBoost: parseInt(e.target.value) })}
            className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
            id="slider-bass-boost"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Crossfade Duration</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{equalizerSettings.crossfadeSeconds}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={equalizerSettings.crossfadeSeconds}
            onChange={e => updateEqualizer({ crossfadeSeconds: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
            id="slider-crossfade"
          />
        </div>
      </div>
    </div>
  );
};
