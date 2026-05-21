import confetti from 'canvas-confetti';

const COLORS = ['#f0b429', '#4dd0a1', '#f6f1e1']; // gold, mint, chalk

/**
 * Lanza la secuencia completa de celebración: ráfaga central,
 * fuegos artificiales y lluvia de láminas doradas.
 * Devuelve una función cleanup para cancelar los timers pendientes.
 */
export function launchFireworks(canvas?: HTMLCanvasElement | null): () => void {
  const fire = canvas ? confetti.create(canvas, { resize: true }) : confetti;

  const timers: ReturnType<typeof setTimeout>[] = [];
  function schedule(fn: () => void, ms: number) {
    timers.push(setTimeout(fn, ms));
  }

  // Phase 1: big central burst
  fire({
    particleCount: 200,
    spread: 90,
    origin: { x: 0.5, y: 0.55 },
    colors: COLORS,
    startVelocity: 45,
  });

  // Phase 2: fireworks from 3 points
  schedule(() => {
    fire({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0.15, y: 0.6 }, colors: COLORS });
  }, 600);
  schedule(() => {
    fire({ particleCount: 60, angle: 90, spread: 55, origin: { x: 0.5, y: 0.4 }, colors: COLORS });
  }, 1000);
  schedule(() => {
    fire({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.6 },
      colors: COLORS,
    });
  }, 1400);

  // Phase 3: golden rectangle rain (simulates stickers falling)
  schedule(() => {
    fire({
      particleCount: 100,
      spread: 160,
      origin: { x: 0.5, y: -0.1 },
      colors: ['#f0b429', '#c98e0c', '#fcd34d'],
      shapes: ['square'],
      gravity: 1.2,
      drift: 0.5,
      ticks: 300,
      scalar: 1.4,
    });
  }, 1800);

  // Phase 3b: second wave
  schedule(() => {
    fire({
      particleCount: 80,
      spread: 140,
      origin: { x: 0.5, y: -0.1 },
      colors: ['#f0b429', '#c98e0c', '#fcd34d'],
      shapes: ['square'],
      gravity: 1.0,
      drift: -0.5,
      ticks: 300,
      scalar: 1.2,
    });
  }, 2400);

  return () => {
    timers.forEach(clearTimeout);
    if (canvas && 'reset' in fire) (fire as confetti.CreateTypes).reset();
  };
}
