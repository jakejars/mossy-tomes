@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --moss-bg: #1a2f1c;
  --moss-text: #e8e6d9;
  --moss-accent: #90ee90;
}

html, body {
  height: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

body {
  background: radial-gradient(ellipse at bottom, #3a5a40 0%, #1a2a1f 70%, #0a1a0f 100%);
  color: var(--moss-text);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.background-layer, .animatedGradient, .noiseOverlay, .vignette {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.animatedGradient {
  background:
    radial-gradient(ellipse at 20% 30%, rgba(76, 140, 74, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(34, 139, 34, 0.06) 0%, transparent 50%);
  animation: gradientShift 20s ease-in-out infinite alternate;
  z-index: 2;
}

@keyframes gradientShift {
  0% {
    opacity: 0.3;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0.5;
    transform: scale(1.1) rotate(2deg);
  }
}

.noiseOverlay {
  opacity: 0.15;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGZpbHRlciBpZD0ibm9pc2UiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjciIG51bU9jdGF2ZXM9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2UpIiBvcGFjaXR5PSIwLjEzIi8+PC9zdmc+');
  mix-blend-mode: soft-light;
  animation: noiseMove 0.2s steps(10) infinite;
  z-index: 4;
}

body::after {
  content: "";
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  z-index: 9;
  pointer-events: none;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGZpbHRlciBpZD0ibm9pc2UiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjciIG51bU9jdGF2ZXM9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2UpIiBvcGFjaXR5PSIwLjEzIi8+PC9zdmc+');
  animation: grain 1.5s steps(1, end) infinite;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  30% { transform: translate(3%, -15%); }
  50% { transform: translate(12%, 9%); }
  70% { transform: translate(-10%, 7%); }
  90% { transform: translate(8%, 13%); }
}

@keyframes noiseMove {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -5%); }
  20% { transform: translate(-10%, 5%); }
  30% { transform: translate(5%, -10%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-10%, 5%); }
  60% { transform: translate(15%, 0); }
  70% { transform: translate(0, 10%); }
  80% { transform: translate(-15%, 0); }
  90% { transform: translate(10%, 5%); }
  100% { transform: translate(5%, 0); }
}

.vignette {
  box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.7), inset 0 0 300px rgba(0, 0, 0, 0.4);
  z-index: 6;
}

#subtleCanvas {
  opacity: 0.6;
}

#particle-canvas {
  z-index: 3;
  opacity: 0.85;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  min-height: 100vh;
}

@layer components {
  .card {
    @apply bg-moss-800/50 border border-moss-700/20 rounded-xl backdrop-blur-sm;
  }

  .btn-primary {
    @apply bg-moss-600 hover:bg-moss-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }

  .btn-secondary {
    @apply bg-moss-800/60 hover:bg-moss-700/60 text-moss-200 font-medium py-2 px-4 rounded-lg border border-moss-700/30 transition-colors duration-200;
  }
}
