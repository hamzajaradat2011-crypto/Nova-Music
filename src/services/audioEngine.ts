import { EqualizerSettings, EqualizerBand } from '../types/music';

class WebAudioEngine {
  private audioCtx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private bassFilter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isInitialized = false;

  // Synthetic tone generator for built-in sample demo songs if audio files are offline
  private synthInterval: number | null = null;

  public init(element?: HTMLAudioElement): void {
    if (this.isInitialized && this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      if (element) {
        this.audioElement = element;
        this.sourceNode = this.audioCtx.createMediaElementSource(element);
      }

      // Create Analyser
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 256;

      // Create Gain Node
      this.gainNode = this.audioCtx.createGain();

      // Create Bass Boost Filter (Low shelf at 100Hz)
      this.bassFilter = this.audioCtx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 100;
      this.bassFilter.gain.value = 0;

      // Create 5-band EQ filters
      const freqs = [60, 230, 910, 4000, 14000];
      this.eqFilters = freqs.map((f, i) => {
        const filter = this.audioCtx!.createBiquadFilter();
        if (i === 0) {
          filter.type = 'lowshelf';
        } else if (i === freqs.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = f;
        filter.gain.value = 0;
        return filter;
      });

      // Chain audio nodes
      // Source -> Bass -> EQ0 -> EQ1 -> EQ2 -> EQ3 -> EQ4 -> Gain -> Analyser -> Destination
      if (this.sourceNode) {
        let prevNode: AudioNode = this.sourceNode;
        prevNode.connect(this.bassFilter);
        prevNode = this.bassFilter;

        for (const filter of this.eqFilters) {
          prevNode.connect(filter);
          prevNode = filter;
        }

        prevNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
      } else {
        // Fallback chain for direct synth generator
        let prevNode: AudioNode = this.bassFilter;
        for (const filter of this.eqFilters) {
          prevNode.connect(filter);
          prevNode = filter;
        }
        prevNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
      }

      this.isInitialized = true;
    } catch (err) {
      console.warn('Web Audio initialization warning:', err);
    }
  }

  public applyEqualizerSettings(settings: EqualizerSettings): void {
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Apply Bass Boost
    if (this.bassFilter) {
      const boostGain = settings.enabled ? (settings.bassBoost / 100) * 12 : 0;
      this.bassFilter.gain.setTargetAtTime(boostGain, this.audioCtx.currentTime, 0.05);
    }

    // Apply Bands
    if (this.eqFilters.length === settings.bands.length) {
      settings.bands.forEach((band: EqualizerBand, idx: number) => {
        const gainVal = settings.enabled ? band.gain : 0;
        this.eqFilters[idx].gain.setTargetAtTime(gainVal, this.audioCtx!.currentTime, 0.05);
      });
    }

    // Apply Playback Speed if audio element exists
    if (this.audioElement) {
      this.audioElement.playbackRate = settings.playbackSpeed || 1.0;
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(64);
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(64);
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  // Play procedural synth chord sequence for preview tracks if no MP3 URL is provided
  public playSyntheticDemoTrack(genre: string = 'synthwave'): void {
    if (!this.audioCtx) this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.stopSyntheticDemoTrack();

    const bpmMap: Record<string, number> = {
      synthwave: 118,
      chill: 85,
      kpop: 128,
      rock: 140,
      ambient: 60,
      edm: 130
    };

    const notesMap: Record<string, number[]> = {
      synthwave: [220, 261.63, 329.63, 392.00], // Am7
      chill: [174.61, 220, 261.63, 329.63],     // Fmaj7
      kpop: [261.63, 329.63, 392.00, 493.88],    // Cmaj7
      rock: [146.83, 220, 293.66, 369.99],     // D5
      ambient: [130.81, 164.81, 196.00, 246.94], // Cmaj7 low
      edm: [130.81, 261.63, 392.00, 523.25]      // C oct
    };

    const bpm = bpmMap[genre] || 120;
    const notes = notesMap[genre] || [220, 277.18, 329.63, 440];
    const stepTime = (60 / bpm) * 1000;
    let step = 0;

    const playStep = () => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      const freq = notes[step % notes.length] * (step % 2 === 0 ? 1 : 1.5);
      osc.type = genre === 'synthwave' || genre === 'edm' ? 'sawtooth' : genre === 'rock' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (stepTime / 1000));

      if (this.bassFilter) {
        osc.connect(noteGain);
        noteGain.connect(this.bassFilter);
      } else if (this.gainNode) {
        osc.connect(noteGain);
        noteGain.connect(this.gainNode);
      }

      osc.start();
      osc.stop(this.audioCtx.currentTime + (stepTime / 1000));
      step++;
    };

    playStep();
    this.synthInterval = window.setInterval(playStep, stepTime);
  }

  public stopSyntheticDemoTrack(): void {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public setVolume(volume: number): void {
    if (this.gainNode && this.audioCtx) {
      const vol = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.setTargetAtTime(vol, this.audioCtx.currentTime, 0.05);
    }
  }
}

export const audioEngine = new WebAudioEngine();
