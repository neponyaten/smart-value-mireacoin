export type ParticleProfile = {
  maxParticles: number;
  spawnPerSecond: number;
  spread: number;
  minSpeed: number;
  maxSpeed: number;
  minLife: number;
  maxLife: number;
  minSize: number;
  maxSize: number;
  glowBlur: number;
  colors: string[];
};

type Particle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

const FRAME_INTERVAL_MS = 1000 / 60;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

export class ParticleEngine {
  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D;

  private profile: ParticleProfile;

  private pool: Particle[];

  private running = false;

  private rafId: number | null = null;

  private lastTick = 0;

  private emitAccumulator = 0;

  private elapsedSeconds = 0;

  private preDraw?: (ctx: CanvasRenderingContext2D, width: number, height: number, elapsedSeconds: number) => void;

  constructor(
    canvas: HTMLCanvasElement,
    profile: ParticleProfile,
    preDraw?: (ctx: CanvasRenderingContext2D, width: number, height: number, elapsedSeconds: number) => void,
  ) {
    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) {
      throw new Error("Canvas 2D context unavailable");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.profile = profile;
    this.pool = this.createPool(profile.maxParticles);
    this.preDraw = preDraw;
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTick = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resize(width: number, height: number, dpr = window.devicePixelRatio || 1) {
    this.canvas.width = Math.max(1, Math.floor(width * dpr));
    this.canvas.height = Math.max(1, Math.floor(height * dpr));
    this.canvas.style.width = `${Math.floor(width)}px`;
    this.canvas.style.height = `${Math.floor(height)}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  updateProfile(profile: ParticleProfile) {
    this.profile = profile;
    if (this.pool.length !== profile.maxParticles) {
      this.pool = this.createPool(profile.maxParticles);
    }
  }

  setPreDraw(preDraw?: (ctx: CanvasRenderingContext2D, width: number, height: number, elapsedSeconds: number) => void) {
    this.preDraw = preDraw;
  }

  private createPool(maxParticles: number): Particle[] {
    return Array.from({ length: maxParticles }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      color: "#22d3ee",
    }));
  }

  private loop = (now: number) => {
    if (!this.running) {
      return;
    }

    const deltaMs = now - this.lastTick;
    if (deltaMs < FRAME_INTERVAL_MS) {
      this.rafId = requestAnimationFrame(this.loop);
      return;
    }

    this.lastTick = now;
    const deltaSeconds = clamp(deltaMs / 1000, 0.001, 0.05);
    this.elapsedSeconds += deltaSeconds;

    this.emitAccumulator += this.profile.spawnPerSecond * deltaSeconds;
    const emitCount = Math.floor(this.emitAccumulator);
    this.emitAccumulator -= emitCount;

    for (let i = 0; i < emitCount; i += 1) {
      this.emit();
    }

    this.update(deltaSeconds);
    this.draw();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private emit() {
    const particle = this.pool.find((item) => !item.active);
    if (!particle) {
      return;
    }

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const cx = width / 2;
    const cy = height / 2;

    const angle = randomRange(0, Math.PI * 2);
    const radius = randomRange(14, this.profile.spread);
    const speed = randomRange(this.profile.minSpeed, this.profile.maxSpeed);

    particle.active = true;
    particle.x = cx + Math.cos(angle) * radius;
    particle.y = cy + Math.sin(angle) * radius;
    particle.vx = Math.cos(angle) * speed + randomRange(-3, 3);
    particle.vy = Math.sin(angle) * speed + randomRange(-3, 3);
    particle.life = 0;
    particle.maxLife = randomRange(this.profile.minLife, this.profile.maxLife);
    particle.size = randomRange(this.profile.minSize, this.profile.maxSize);
    particle.color = pickRandom(this.profile.colors);
  }

  private update(deltaSeconds: number) {
    for (let i = 0; i < this.pool.length; i += 1) {
      const particle = this.pool[i];
      if (!particle || !particle.active) {
        continue;
      }

      particle.life += deltaSeconds;
      if (particle.life >= particle.maxLife) {
        particle.active = false;
        continue;
      }

      particle.x += particle.vx * deltaSeconds;
      particle.y += particle.vy * deltaSeconds;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
    }
  }

  private draw() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.ctx.clearRect(0, 0, width, height);

    if (this.preDraw) {
      this.preDraw(this.ctx, width, height, this.elapsedSeconds);
    }

    this.ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < this.pool.length; i += 1) {
      const particle = this.pool[i];
      if (!particle || !particle.active) {
        continue;
      }

      const alpha = 1 - particle.life / particle.maxLife;
      const radius = particle.size;

      this.ctx.beginPath();
      this.ctx.shadowBlur = this.profile.glowBlur;
      this.ctx.shadowColor = particle.color;
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    this.ctx.globalCompositeOperation = "source-over";
  }
}
