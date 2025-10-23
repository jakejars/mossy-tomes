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
    const particleCount = 8;
    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const particle = {
        x: Math.random() * width,
        y: height + 50,
        speed: 0.1 + Math.random() * 0.2,
        size: 2 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 0.5,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        pulseOffset: Math.random() * Math.PI * 2,
        reset() {
          this.x = Math.random() * width;
          this.y = height + 50;
          this.speed = 0.1 + Math.random() * 0.2;
          this.size = 2 + Math.random() * 3;
          this.opacity = 0.1 + Math.random() * 0.15;
          this.drift = (Math.random() - 0.5) * 0.5;
          this.pulseSpeed = 0.002 + Math.random() * 0.003;
          this.pulseOffset = Math.random() * Math.PI * 2;
        }
      };
      particle.y = Math.random() * height;
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

        const pulse = Math.sin(currentTime * particle.pulseSpeed + particle.pulseOffset) * 0.3 + 0.7;
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
      <div className="background-layer bg-gradient" />
      <div className="background-layer texture-overlay" />
      <canvas
        ref={canvasRef}
        id="subtleCanvas"
        className="background-layer"
      />
      <div className="background-layer vignette" />
    </>
  );
}
