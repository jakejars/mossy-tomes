'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  drift: number;
  pulseSpeed: number;
  pulseOffset: number;
  reset: () => void;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const c = canvas as HTMLCanvasElement;
  const context = ctx as CanvasRenderingContext2D;

        // Particle system based on the provided example (motes + dof particles)
        let particles: Array<any> = [];
        const MOTE_COUNT = 70;
        const PARTICLE_COUNT = 100;
        let animationFrameId: number;

        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

        function resizeCanvas() {
          const w = Math.max(1, Math.floor(window.innerWidth));
          const h = Math.max(1, Math.floor(window.innerHeight));
          c.width = Math.floor(w * dpr);
          c.height = Math.floor(h * dpr);
          c.style.width = `${w}px`;
          c.style.height = `${h}px`;
          context.setTransform(dpr, 0, 0, dpr, 0, 0);
          initParticles();
        }

        class ParticleV2 {
          type: 'mote' | 'particle';
          x!: number;
          y!: number;
          z!: number;
          speedY!: number;
          speedX!: number;
          radius!: number;
          color!: string;
          glow!: number;
          glowColor!: string;

          constructor(type: 'mote' | 'particle') {
            this.type = type;
            this.reset();
          }

          reset() {
            const w = c.width / dpr;
            const h = c.height / dpr;
            this.x = Math.random() * w;

            if (this.type === 'mote') {
              this.y = h + Math.random() * 100;
              this.z = Math.random() * 0.6 + 0.4;
              this.speedY = -(this.z * 0.8 + 0.5);
              this.speedX = (Math.random() - 0.5) * 0.5;
              this.radius = (Math.random() * 1.5 + 1) * this.z;
              this.color = `rgba(220,255,230,${this.z * 0.6 + 0.1})`;
              this.glow = 15;
              this.glowColor = 'rgba(255,255,255,0.05)';
            } else {
              this.y = Math.random() * h;
              this.z = Math.random() * 0.3 + 0.1;
              this.speedY = this.z * 0.4;
              this.speedX = 0;
              this.radius = (Math.random() * 1 + 0.5) * this.z;
              this.color = `rgba(180,220,190,${this.z * 0.5 + 0.1})`;
              this.glow = 5;
              this.glowColor = this.color;
            }
          }

          update() {
            this.y += this.speedY;
            this.x += this.speedX;

            const w = c.width / dpr;
            const h = c.height / dpr;

            if (this.type === 'mote' && this.y < -this.radius) {
              this.reset();
              this.y = h + this.radius;
            } else if (this.type === 'particle' && this.y > h + this.radius) {
              this.reset();
              this.y = -this.radius;
            }

            if (this.x < -this.radius) {
              this.reset();
              this.x = w + this.radius;
            } else if (this.x > w + this.radius) {
              this.reset();
              this.x = -this.radius;
            }
          }

          draw() {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.shadowBlur = this.glow;
            context.shadowColor = this.glowColor;
            context.fillStyle = this.color;
            context.fill();
          }
        }

        function initParticles() {
          particles = [];
          for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new ParticleV2('particle'));
          for (let i = 0; i < MOTE_COUNT; i++) particles.push(new ParticleV2('mote'));
        }

        function animate() {
          const w = c.width / dpr;
          const h = c.height / dpr;
          context.clearRect(0, 0, w, h);
          context.shadowBlur = 0;
          for (const p of particles) {
            p.update();
            p.draw();
          }
          animationFrameId = requestAnimationFrame(animate);
        }

        // Init
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Start loop
        animate();

        return () => {
          window.removeEventListener('resize', resizeCanvas);
          cancelAnimationFrame(animationFrameId);
        };
  }, []);

    return (
      <>
        <div className="background-layer animatedGradient" />
        <canvas ref={canvasRef} id="particle-canvas" className="background-layer" />
        <div className="background-layer vignette" />
      </>
    );
}
