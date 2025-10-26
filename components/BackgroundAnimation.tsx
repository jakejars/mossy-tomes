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

  let width = window.innerWidth;
  let height = window.innerHeight;
  let particleCount = 8;
  let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Recalculate particle count based on viewport area for a denser effect on larger screens
      // Keep bounds to avoid excessive work on very large screens
      particleCount = Math.min(200, Math.max(60, Math.floor((width * height) / 30000)));
    };

    const createParticle = (): Particle => {
      const particle = {
        x: Math.random() * width,
        y: Math.random() * height,
        // mix of slow drifting motes and some faster motes
        speed: 0.02 + Math.random() * 0.6,
        // mostly tiny motes with occasional larger glow
        size: 0.6 + Math.random() * 3,
        opacity: 0.06 + Math.random() * 0.25,
        drift: (Math.random() - 0.5) * 1.2,
        pulseSpeed: 0.001 + Math.random() * 0.006,
        pulseOffset: Math.random() * Math.PI * 2,
        reset() {
          this.x = Math.random() * width;
          this.y = height + (10 + Math.random() * 120);
          this.speed = 0.02 + Math.random() * 0.6;
          this.size = 0.6 + Math.random() * 3;
          this.opacity = 0.06 + Math.random() * 0.25;
          this.drift = (Math.random() - 0.5) * 1.2;
          this.pulseSpeed = 0.001 + Math.random() * 0.006;
          this.pulseOffset = Math.random() * Math.PI * 2;
        }
      };
      return particle;
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    resizeCanvas();
    initParticles();

    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now() - startTime;

      ctx.fillStyle = 'rgba(26, 37, 32, 0.05)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -50 || particle.x < -50 || particle.x > width + 50) {
          particle.reset();
        }

  const pulse = Math.sin(currentTime * particle.pulseSpeed + particle.pulseOffset) * 0.4 + 0.8;
        const currentOpacity = particle.opacity * pulse;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(159, 201, 159, ${currentOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(159, 201, 159, ${currentOpacity * 0.1})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
      // Recreate particles after resizing so density matches new size
      initParticles();
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

    return (
    <>
      <div className="background-layer animatedGradient" />
      <div className="background-layer noiseOverlay" />
      <canvas
        ref={canvasRef}
        id="subtleCanvas"
        className="background-layer"
      />
      <div className="background-layer vignette" />
    </>
  );
}
