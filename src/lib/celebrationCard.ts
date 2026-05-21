import { TOTAL_SECTIONS } from '@/lib/albumData';

interface CardData {
  name: string;
  owned: number;
  profileUrl: string;
}

/** Genera un canvas 720×960 con la card de "Álbum Completo" estilo story. */
export function generateCelebrationCard(data: CardData): HTMLCanvasElement {
  const W = 720;
  const H = 960;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const cx = W / 2;

  // Background
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 24);
  ctx.fillStyle = '#141c2b';
  ctx.fill();

  // Gold border
  ctx.beginPath();
  ctx.roundRect(10, 10, W - 20, H - 20, 20);
  ctx.strokeStyle = '#f0b429';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Trophy emoji
  ctx.font = '120px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏆', cx, 180);

  // Title
  ctx.textBaseline = 'alphabetic';
  ctx.font = '700 46px "Barlow Condensed"';
  ctx.fillStyle = '#f0b429';
  ctx.fillText('ÁLBUM MUNDIAL 2026', cx, 320);
  ctx.font = '700 56px "Barlow Condensed"';
  ctx.fillText('COMPLETO!', cx, 385);

  // User name
  ctx.font = '600 30px Barlow';
  ctx.fillStyle = '#f0ece4';
  ctx.fillText(data.name, cx, 460);

  // Divider line
  ctx.beginPath();
  ctx.moveTo(cx - 120, 500);
  ctx.lineTo(cx + 120, 500);
  ctx.strokeStyle = 'rgba(240, 180, 41, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Stats
  ctx.font = '700 54px "JetBrains Mono"';
  ctx.fillStyle = '#f0ece4';
  ctx.fillText(String(data.owned), cx - 120, 580);
  ctx.fillText(String(TOTAL_SECTIONS), cx + 120, 580);

  ctx.font = '600 14px "JetBrains Mono"';
  ctx.fillStyle = 'rgba(240, 236, 228, 0.5)';
  ctx.letterSpacing = '2px';
  ctx.fillText('LÁMINAS', cx - 120, 608);
  ctx.fillText('PÁGINAS', cx + 120, 608);

  // Separator dot
  ctx.beginPath();
  ctx.arc(cx, 575, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(240, 180, 41, 0.4)';
  ctx.fill();

  // Profile URL
  ctx.font = '500 22px Barlow';
  ctx.fillStyle = '#4dd0a1';
  ctx.fillText(data.profileUrl, cx, 720);

  // Branding
  ctx.font = '400 15px "JetBrains Mono"';
  ctx.fillStyle = 'rgba(240, 236, 228, 0.3)';
  ctx.fillText('quemefalta.vercel.app', cx, H - 50);

  return canvas;
}

/** Genera la card como Blob PNG. */
export async function generateCelebrationBlob(data: CardData): Promise<Blob> {
  const canvas = generateCelebrationCard(data);
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png');
  });
}

/** Comparte la card como imagen (share sheet en mobile, descarga en desktop). */
export async function shareCelebrationCard(data: CardData): Promise<void> {
  const blob = await generateCelebrationBlob(data);
  const file = new File([blob], 'album-completo.png', { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch {
      // User cancelled
    }
  }

  // Fallback: download
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'album-completo.png';
  a.click();
  URL.revokeObjectURL(a.href);
}
