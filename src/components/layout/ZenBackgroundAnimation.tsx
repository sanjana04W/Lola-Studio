'use client';

import React, { useEffect, useRef } from 'react';

/**
 * ZenBackgroundAnimation
 * Renders a serene, subtle atmospheric background animation:
 * 1. Gentle floating golden Zen motes (sunlit temple dust / incense aura)
 * 2. Soft drifting warm gold and mineral auroras
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

    // Create 32 subtle golden motes
    const particleCount = Math.min(36, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.35 + 0.15), // Gentle upward drift
      speedX: (Math.random() - 0.5) * 0.25, // Gentle horizontal sway
      opacity: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? '197, 160, 89' : '214, 191, 160', // #C5A059 or #D6BFA0
    }));

    let step = 0;
    const render = () => {
      step += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(step * 0.015 + p.pulseOffset) * 0.15;

        // Wrap around screen edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Breathing opacity
        const currentOpacity =
          p.opacity * (0.65 + 0.35 * Math.sin(step * p.pulseSpeed + p.pulseOffset));

        // Soft glowing particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `rgba(${p.color}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${p.color}, ${currentOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
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
      {/* ── Fixed Floating Canvas Motes Layer (floats above page backgrounds, below nav) ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* ── Atmospheric Ambient Shifting Orbs Layer ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
      >
        {/* Top-Right Golden Bloom */}
        <div
          className="absolute -top-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-[#C5A059]/[0.08] blur-[100px] animate-zen-drift-slow"
          style={{ willChange: 'transform' }}
        />

        {/* Center-Left Warm Sand Glow */}
        <div
          className="absolute top-1/3 -left-28 w-[32rem] h-[32rem] rounded-full bg-[#D6BFA0]/[0.09] blur-[110px] animate-zen-drift-reverse"
          style={{ willChange: 'transform' }}
        />

        {/* Bottom-Right Warm Clay Light */}
        <div
          className="absolute -bottom-28 right-1/4 w-[38rem] h-[38rem] rounded-full bg-[#E8E4DC]/[0.45] blur-[120px] animate-zen-pulse"
          style={{ willChange: 'transform' }}
        />
      </div>
    </>
  );
}
