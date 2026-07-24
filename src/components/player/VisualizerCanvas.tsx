import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const VisualizerCanvas: React.FC<{ mode?: 'bars' | 'wave' | 'ring' }> = ({ mode = 'bars' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { getVisualizerData, getWaveformData, isPlaying } = usePlayer();

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (mode === 'bars') {
        const freqData = getVisualizerData();
        const barCount = 32;
        const barWidth = width / barCount - 2;

        for (let i = 0; i < barCount; i++) {
          const value = isPlaying ? freqData[i * 2] || Math.sin(Date.now() / 200 + i) * 80 + 90 : 15;
          const barHeight = (value / 255) * height * 0.85;

          const x = i * (barWidth + 2);
          const y = height - barHeight;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#1e3a8a');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#60a5fa');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();
        }
      } else if (mode === 'wave') {
        const waveData = getWaveformData();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3b82f6';

        const sliceWidth = width / waveData.length;
        let x = 0;

        for (let i = 0; i < waveData.length; i++) {
          const v = isPlaying ? waveData[i] / 128.0 : 1.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, mode]);

  return <canvas ref={canvasRef} className="w-full h-16 rounded-2xl bg-neutral-900/40 border border-white/5" />;
};
