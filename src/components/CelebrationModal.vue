<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useStickers } from '@/composables/useStickers';
import { useAuth } from '@/composables/useAuth';
import { TOTAL_SECTIONS } from '@/lib/albumData';
import { track } from '@/lib/analytics';
import { launchFireworks } from '@/lib/fireworks';
import { shareCelebrationCard } from '@/lib/celebrationCard';

const emit = defineEmits<{ close: [] }>();

const { stats } = useStickers();
const { profile } = useAuth();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let cleanup: (() => void) | null = null;

const profileUrl = computed(() => {
  const username = profile.value?.username;
  return username
    ? `https://quemefalta.vercel.app/u/${username}`
    : 'https://quemefalta.vercel.app/';
});

async function shareAchievement() {
  track('share_album_complete');
  const name = profile.value?.display_name?.trim() || profile.value?.username || '';
  await shareCelebrationCard({
    name,
    owned: stats.value.owned,
    profileUrl: profileUrl.value,
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => {
  track('album_complete_celebration');
  cleanup = launchFireworks(canvasRef.value);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  cleanup?.();
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="cel-root">
    <canvas ref="canvasRef" class="cel-canvas" />
    <div class="cel-bg" @click="emit('close')">
      <div class="cel" @click.stop>
        <!-- Close button -->
        <button class="cel-close" aria-label="Cerrar" @click="emit('close')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Trophy -->
        <div class="cel-trophy">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gold)"
            stroke-width="1.5"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="cel-title">ÁLBUM MUNDIAL 2026 COMPLETO!</h2>
        <p class="cel-sub">Vamos a celebrar.</p>

        <!-- Stats -->
        <div class="cel-stats">
          <div class="cel-stat">
            <span class="cel-stat-val">{{ stats.owned }}</span>
            <span class="cel-stat-lbl">láminas</span>
          </div>
          <div class="cel-stat-sep" />
          <div class="cel-stat">
            <span class="cel-stat-val">{{ TOTAL_SECTIONS }}</span>
            <span class="cel-stat-lbl">páginas</span>
          </div>
        </div>

        <!-- Share button -->
        <button class="cel-share" @click="shareAchievement">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartir logro
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cel-root {
  position: fixed;
  inset: 0;
  z-index: 200;
}

.cel-bg {
  position: absolute;
  inset: 0;
  background: rgba(12, 18, 32, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: celFadeIn 0.3s ease-out;
}

.cel-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.cel {
  position: relative;
  background: var(--pitch);
  border: 1px solid rgba(240, 180, 41, 0.25);
  border-radius: 16px;
  padding: 40px 28px 32px;
  width: 100%;
  max-width: 360px;
  text-align: center;
  box-shadow:
    0 0 60px rgba(240, 180, 41, 0.15),
    0 30px 60px rgba(0, 0, 0, 0.5);
  animation: celPopIn 0.4s ease-out;
}

.cel-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: rgba(246, 241, 225, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.cel-close:hover {
  color: var(--chalk);
}

.cel-trophy {
  margin-bottom: 16px;
  animation: celTrophy 1.5s ease-in-out infinite;
}

.cel-title {
  font-family: var(--display);
  font-size: 32px;
  letter-spacing: 0.06em;
  color: var(--gold);
  margin: 0 0 6px;
  line-height: 1;
}

.cel-sub {
  font-size: 14px;
  color: rgba(246, 241, 225, 0.6);
  margin: 0 0 24px;
}

.cel-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
}

.cel-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cel-stat-val {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--chalk);
}

.cel-stat-lbl {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(246, 241, 225, 0.45);
}

.cel-stat-sep {
  width: 1px;
  height: 28px;
  background: var(--line);
}

.cel-share {
  width: 100%;
  padding: 14px;
  background: var(--gold);
  color: var(--pitch-deep);
  border: none;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
}
.cel-share:hover {
  background: var(--gold-deep);
}

@keyframes celFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes celPopIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes celTrophy {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px rgba(240, 180, 41, 0.3));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 0 20px rgba(240, 180, 41, 0.6));
  }
}
</style>
