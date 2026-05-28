import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock canvas context methods
function createMockCtx() {
  return {
    beginPath: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fillText: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
    letterSpacing: '',
  };
}

let mockCtx: ReturnType<typeof createMockCtx>;
let mockToBlob: ReturnType<typeof vi.fn>;

let generateCelebrationCard: typeof import('@/lib/celebrationCard').generateCelebrationCard;
let generateCelebrationBlob: typeof import('@/lib/celebrationCard').generateCelebrationBlob;
let shareCelebrationCard: typeof import('@/lib/celebrationCard').shareCelebrationCard;

beforeEach(async () => {
  vi.resetModules();
  mockCtx = createMockCtx();
  mockToBlob = vi.fn((cb: (b: Blob) => void) => cb(new Blob(['fake'], { type: 'image/png' })));

  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: vi.fn().mockReturnValue(mockCtx),
        toBlob: mockToBlob,
      } as unknown as HTMLCanvasElement;
    }
    if (tag === 'a') {
      return { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
    }
    return document.createElement(tag);
  });

  const mod = await import('@/lib/celebrationCard');
  generateCelebrationCard = mod.generateCelebrationCard;
  generateCelebrationBlob = mod.generateCelebrationBlob;
  shareCelebrationCard = mod.shareCelebrationCard;
});

describe('generateCelebrationCard', () => {
  const data = { name: 'TestUser', owned: 980, profileUrl: 'https://example.com/u/test' };

  it('creates a 720×960 canvas', () => {
    const canvas = generateCelebrationCard(data);
    expect(canvas.width).toBe(720);
    expect(canvas.height).toBe(960);
  });

  it('draws the user name', () => {
    generateCelebrationCard(data);
    expect(mockCtx.fillText).toHaveBeenCalledWith('TestUser', expect.any(Number), expect.any(Number));
  });

  it('draws the owned count', () => {
    generateCelebrationCard(data);
    expect(mockCtx.fillText).toHaveBeenCalledWith('980', expect.any(Number), expect.any(Number));
  });

  it('draws the profile URL', () => {
    generateCelebrationCard(data);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'https://example.com/u/test',
      expect.any(Number),
      expect.any(Number),
    );
  });
});

describe('generateCelebrationBlob', () => {
  it('returns a PNG blob', async () => {
    const blob = await generateCelebrationBlob({
      name: 'User',
      owned: 100,
      profileUrl: 'https://example.com',
    });
    expect(blob).toBeInstanceOf(Blob);
    expect(mockToBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
  });
});

describe('shareCelebrationCard', () => {
  const data = { name: 'User', owned: 100, profileUrl: 'https://example.com' };

  it('uses navigator.share when available', async () => {
    const shareFn = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'canShare', {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
    });
    Object.defineProperty(navigator, 'share', {
      value: shareFn,
      configurable: true,
    });

    await shareCelebrationCard(data);
    expect(shareFn).toHaveBeenCalledWith({ files: [expect.any(File)] });
  });

  it('falls back to download when share is not available', async () => {
    Object.defineProperty(navigator, 'canShare', {
      value: undefined,
      configurable: true,
    });

    const createObjectURL = vi.fn().mockReturnValue('blob:fake');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });

    await shareCelebrationCard(data);
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake');
  });

  it('falls back to download when user cancels share', async () => {
    Object.defineProperty(navigator, 'canShare', {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
    });
    Object.defineProperty(navigator, 'share', {
      value: vi.fn().mockRejectedValue(new Error('cancelled')),
      configurable: true,
    });

    const createObjectURL = vi.fn().mockReturnValue('blob:fake');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });

    await shareCelebrationCard(data);
    // Should fall back to download link
    expect(createObjectURL).toHaveBeenCalled();
  });
});
