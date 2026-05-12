<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  hasWon: boolean
  prizeName?: string | null
  prizeImageUrl?: string | null
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="reveal-overlay" :class="{ 'is-win': props.hasWon, 'is-lose': !props.hasWon }">
    <div class="reveal-card">
      <!-- Close Button -->
      <button class="close-button" @click="$emit('close')" aria-label="Close reveal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <!-- Animated Background Layer -->
      <div class="glow-layer"></div>

      <!-- Win State Contents -->
      <div v-if="props.hasWon" class="content animate-content">
        <div class="trophy-icon">🏆</div>
        <h2 class="reveal-title">You Won!</h2>
        <div v-if="props.prizeName" class="prize-name-label">{{ props.prizeName }}</div>
        
        <div class="prize-container">
          <div class="frame-shine"></div>
          <img 
            v-if="props.prizeImageUrl" 
            :src="props.prizeImageUrl" 
            alt="Grand Prize" 
            class="prize-img"
          />
          <div v-else class="placeholder-prize">🎁</div>
        </div>

        <div class="celebration-banner">
          Congratulations!
        </div>
      </div>

      <!-- Loss State Contents -->
      <div v-else class="content animate-content loss">
        <div class="sad-icon">💔</div>
        <h2 class="reveal-title sub">No Luck Today</h2>
        <p class="loss-subtitle">Better luck next time!</p>
        <div class="status-badge">0 Guesses Left</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reveal-overlay {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: auto;
}

.reveal-card {
  position: relative;
  width: 300px;
  background: rgba(20, 20, 24, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255,255,255,0.02);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slide-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-origin: top center;
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  width: 2.5rem;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* The glowing core/backing */
.glow-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.4;
}

.is-win .reveal-card {
  border-color: rgba(255, 215, 0, 0.25);
  box-shadow: 0 20px 50px rgba(255, 107, 0, 0.15), 0 0 30px rgba(255, 215, 0, 0.1);
}

.is-win .glow-layer {
  background: radial-gradient(circle at center, rgba(255, 165, 0, 0.4) 0%, transparent 70%);
  animation: pulse-glow 3s infinite alternate;
}

.is-lose .glow-layer {
  background: radial-gradient(circle at center, rgba(100, 100, 120, 0.2) 0%, transparent 70%);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

/* Icons and Typography */
.trophy-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  animation: scale-in-bounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
}

.sad-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  opacity: 0.7;
}

.reveal-title {
  font-size: 2rem;
  font-weight: 900;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.prize-name-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.25rem;
  padding: 0.25rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.is-win .reveal-title {
  background: linear-gradient(to bottom right, #ffffff 20%, #ffd700, #ff6b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.reveal-title.sub {
  font-size: 1.4rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

/* The main display image area */
.prize-container {
  position: relative;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.4);
  margin-bottom: 1.5rem;
  animation: pop-up-prize 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}

.frame-shine {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%);
  pointer-events: none;
}

.prize-img {
  width: 85%;
  height: 85%;
  object-fit: contain;
  filter: drop-shadow(0 8px 12px rgba(0,0,0,0.5));
  animation: hover-float 4s ease-in-out infinite;
}

.placeholder-prize {
  font-size: 4rem;
}

.celebration-banner {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.05em;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Loss specifics */
.loss-subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.status-badge {
  background: rgba(0, 0, 0, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* KEYFRAMES */
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes scale-in-bounce {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pop-up-prize {
  0% {
    transform: translateY(20px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes pulse-glow {
  0% { opacity: 0.3; transform: scale(0.9); }
  100% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes hover-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .reveal-overlay {
    top: auto;
    bottom: 2rem;
    right: 50%;
    transform: translateX(50%);
  }
  
  .reveal-card {
    width: calc(100vw - 4rem);
    max-width: 340px;
    transform-origin: bottom center;
  }
}
</style>
