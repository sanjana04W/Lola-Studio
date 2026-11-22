'use client';

import React, { useEffect, useRef } from 'react';

/**
 * ZenBackgroundAnimation
 * Renders a serene, spacious atmospheric background animation:
 * 1. Gentle floating golden Zen motes with soft glowing auras (sunlit temple dust / incense aura)
 * 2. Grand drifting warm gold and mineral auroras across the viewport
 * - Non-intrusive: pointer-events-none, hardware-accelerated, paused when tab is inactive.
 */
export default function ZenBackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Larger, more visible golden ambient motes
    const particleCount = Math.min(42, Math.max(24, Math.floor(width / 32)));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.2 + 1.8, // Larger radius (1.8px to 5px)
      speedY: -(Math.random() * 0.4 + 0.18), // Gentle upward drift
      speedX: (Math.random() - 0.5) * 0.35, // Gentle horizontal sway
      opacity: Math.random() * 0.45 + 0.25, // Richer opacity
      pulseSpeed: Math.random() * 0.025 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.35 ? '197, 160, 89' : '224, 185, 120', // #C5A059 warm gold
    }));

    let step = 0;
    const render = () => {
      step += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(step * 0.015 + p.pulseOffset) * 0.25;

        // Wrap around screen edges
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Breathing opacity
        const currentOpacity =
          p.opacity * (0.65 + 0.35 * Math.sin(step * p.pulseSpeed + p.pulseOffset));

        // Larger soft glowing halo
        const haloRadius = p.radius * 3.6;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
        gradient.addColorStop(0, `rgba(${p.color}, ${currentOpacity})`);
        gradient.addColorStop(0.35, `rgba(${p.color}, ${currentOpacity * 0.55})`);
        gradient.addColorStop(0.7, `rgba(${p.color}, ${currentOpacity * 0.18})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core bright point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 230, ${currentOpacity * 0.8})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* ── Fixed Floating Canvas Motes Layer ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* ── Larger Atmospheric Ambient Shifting Orbs Layer ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
      >
        {/* Top-Right Grand Golden Bloom */}
        <div
          className="absolute -top-32 -right-32 w-[46rem] h-[46rem] sm:w-[58rem] sm:h-[58rem] rounded-full bg-[#C5A059]/[0.11] blur-[120px] sm:blur-[150px] animate-zen-drift-slow"
          style={{ willChange: 'transform' }}
        />

        {/* Center-Left Grand Warm Sand Glow */}
        <div
          className="absolute top-1/4 -left-36 w-[42rem] h-[42rem] sm:w-[52rem] sm:h-[52rem] rounded-full bg-[#D6BFA0]/[0.12] blur-[120px] sm:blur-[150px] animate-zen-drift-reverse"
          style={{ willChange: 'transform' }}
        />

        {/* Center Radiant Ambient Halo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] sm:w-[60rem] sm:h-[60rem] rounded-full bg-[#C5A059]/[0.055] blur-[140px] sm:blur-[180px] animate-zen-pulse"
          style={{ willChange: 'transform' }}
        />

        {/* Bottom-Right Warm Clay Light */}
        <div
          className="absolute -bottom-36 right-1/6 w-[48rem] h-[48rem] sm:w-[60rem] sm:h-[60rem] rounded-full bg-[#E8E4DC]/[0.55] blur-[130px] sm:blur-[160px] animate-zen-pulse"
          style={{ willChange: 'transform' }}
        />
      </div>
    </>
  );
}
