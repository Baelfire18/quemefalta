import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFire = vi.fn();
const mockReset = vi.fn();
let lastCreatedFire: ReturnType<typeof vi.fn>;

vi.mock('canvas-confetti', () => {
  // Default confetti (no canvas) delegates to mockFire
  const defaultFire = Object.assign((...args: unknown[]) => mockFire(...args), {
    create: (_canvas: unknown, _opts: unknown) => {
      lastCreatedFire = Object.assign(vi.fn(), { reset: mockReset });
      return lastCreatedFire;
    },
  });
  return { default: defaultFire };
});

let launchFireworks: typeof import('@/lib/fireworks').launchFireworks;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  mockFire.mockClear();
  mockReset.mockClear();
  const mod = await import('@/lib/fireworks');
  launchFireworks = mod.launchFireworks;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('launchFireworks', () => {
  it('fires initial burst immediately without a canvas', () => {
    launchFireworks();
    expect(mockFire).toHaveBeenCalledTimes(1);
    expect(mockFire).toHaveBeenCalledWith(
      expect.objectContaining({ particleCount: 200, spread: 90 }),
    );
  });

  it('uses confetti.create when canvas is provided', () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    launchFireworks(canvas);
    // Should use the canvas-bound fire, not the default
    expect(mockFire).not.toHaveBeenCalled();
    expect(lastCreatedFire).toHaveBeenCalledTimes(1);
  });

  it('schedules all 6 phases over 2400ms with canvas', () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    launchFireworks(canvas);

    expect(lastCreatedFire).toHaveBeenCalledTimes(1); // phase 1

    vi.advanceTimersByTime(600);
    expect(lastCreatedFire).toHaveBeenCalledTimes(2); // +phase 2a

    vi.advanceTimersByTime(400);
    expect(lastCreatedFire).toHaveBeenCalledTimes(3); // +phase 2b

    vi.advanceTimersByTime(400);
    expect(lastCreatedFire).toHaveBeenCalledTimes(4); // +phase 2c

    vi.advanceTimersByTime(400);
    expect(lastCreatedFire).toHaveBeenCalledTimes(5); // +phase 3a

    vi.advanceTimersByTime(600);
    expect(lastCreatedFire).toHaveBeenCalledTimes(6); // +phase 3b
  });

  it('phase 3 uses square shapes (golden rain)', () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    launchFireworks(canvas);
    vi.advanceTimersByTime(2400);

    const lastCall = lastCreatedFire.mock.calls[5][0];
    expect(lastCall.shapes).toEqual(['square']);
  });

  it('returns cleanup that clears pending timers', () => {
    const cleanup = launchFireworks();
    expect(mockFire).toHaveBeenCalledTimes(1);

    cleanup();
    vi.advanceTimersByTime(5000);
    // No additional calls after cleanup
    expect(mockFire).toHaveBeenCalledTimes(1);
  });

  it('cleanup resets canvas-bound confetti instance', () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const cleanup = launchFireworks(canvas);
    cleanup();
    expect(mockReset).toHaveBeenCalled();
  });
});
