"use client";

import { useEffect, useMemo, useRef } from "react";
import { ParticleEngine, type ParticleProfile } from "@/vfx/engine/particleEngine";

const BLUE_ENERGY_PROFILE: ParticleProfile = {
  maxParticles: 120,
  spawnPerSecond: 36,
  spread: 88,
  minSpeed: 18,
  maxSpeed: 60,
  minLife: 0.9,
  maxLife: 1.8,
  minSize: 0.8,
  maxSize: 2.8,
  glowBlur: 14,
  colors: ["#67e8f9", "#22d3ee", "#38bdf8", "#a5f3fc"],
};

type BlueEnergyEffectProps = {
  enabled: boolean;
};

export function BlueEnergyEffect({ enabled }: BlueEnergyEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const preDraw = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, width: number, height: number, elapsedSeconds: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const pulse = 0.6 + Math.sin(elapsedSeconds * 2.1) * 0.13;
      const ringRadius = Math.min(width, height) * (0.31 + pulse * 0.04);

      const aura = ctx.createRadialGradient(cx, cy, ringRadius * 0.25, cx, cy, ringRadius * 1.35);
      aura.addColorStop(0, "rgba(34, 211, 238, 0.20)");
      aura.addColorStop(0.5, "rgba(14, 116, 144, 0.12)");
      aura.addColorStop(1, "rgba(14, 116, 144, 0)");

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(103, 232, 249, 0.36)";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = "rgba(34, 211, 238, 0.7)";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
  }, []);

  useEffect(() => {
    if (!enabled || !canvasRef.current || !hostRef.current) {
      return;
    }

    const engine = new ParticleEngine(canvasRef.current, BLUE_ENERGY_PROFILE, preDraw);

    const resize = () => {
      if (!hostRef.current) {
        return;
      }
      const rect = hostRef.current.getBoundingClientRect();
      engine.resize(rect.width, rect.height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(hostRef.current);

    engine.start();

    return () => {
      observer.disconnect();
      engine.stop();
    };
  }, [enabled, preDraw]);

  return (
    <div ref={hostRef} className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[17%] w-[66%] h-[13%] rounded-full bg-cyan-300/25 blur-2xl animate-pulse" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[16%] w-[82%] h-[18%] rounded-full border border-cyan-200/20" />
    </div>
  );
}
