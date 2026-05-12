<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendar'
import { useProfileStore } from '../../stores/profile'
import RevealOutcome from './components/RevealOutcome.vue'
import SelectCalendarDropdown from './components/SelectCalendarDropdown.vue'
import SurpriseCalendar from './components/SurpriseCalendar.vue'
import SwitchProfileDropdown from './components/SwitchProfileDropdown.vue'
import UserProfileMenu from './components/UserProfileMenu.vue'

const calendarStore = useCalendarStore()
const profileStore = useProfileStore()

const hasGuessLeft = computed(() => {
  if (!calendarStore.activeCalendar || !profileStore.activeProfile) return false
  return !calendarStore.activeCells.some((c) => c.selected_by === profileStore.activeProfile?.id)
})

const mySelectedCell = computed(() => {
  if (!profileStore.activeProfile) return null
  return calendarStore.activeCells.find((c) => c.selected_by === profileStore.activeProfile?.id)
})

const hasWon = computed(() => !!mySelectedCell.value?.prize_id)

const prizeImageUrl = computed(() => {
  if (!mySelectedCell.value) return null
  const rawPrize = mySelectedCell.value.prizes as any
  const prizeObj = Array.isArray(rawPrize) ? rawPrize[0] : rawPrize
  return prizeObj?.image_url || null
})

const prizeName = computed(() => {
  if (!mySelectedCell.value) return null
  const rawPrize = mySelectedCell.value.prizes as any
  const prizeObj = Array.isArray(rawPrize) ? rawPrize[0] : rawPrize
  return prizeObj?.name || null
})
</script>

<template>
  <div class="home-layout">
    <!-- Top Row: User Profile & Calendar Selection -->
    <header class="top-row">
      <UserProfileMenu />

      <div class="header-actions">
        <div v-if="calendarStore.activeCalendar && hasGuessLeft" class="guess-status-container">
          <div class="guess-status" :class="{ 'has-guess': hasGuessLeft }">1 guess left!</div>
          <span class="guess-hint">Double click to guess</span>
        </div>
        <SwitchProfileDropdown />
        <SelectCalendarDropdown />
      </div>
    </header>

    <!-- Main Calendar Area -->
    <main class="calendar-area">
      <SurpriseCalendar
        v-if="calendarStore.activeCalendar"
        :cell-count="calendarStore.activeCalendar.cell_count"
      />

      <RevealOutcome
        v-if="calendarStore.activeCalendar && !hasGuessLeft && mySelectedCell"
        :has-won="hasWon"
        :prize-name="prizeName"
        :prize-image-url="prizeImageUrl"
      />

      <div v-else-if="!calendarStore.activeCalendar" class="placeholder-content">
        <h2>No Calendar Selected</h2>
        <p>Select a calendar from the top right to begin.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--color-background);
  overflow: hidden;
}

/* Top Row */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Main Calendar Area */
.calendar-area {
  flex: 1; /* Takes up all remaining space */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden; /* Important for canvas bounds */
}

.guess-status {
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-text-muted);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.guess-status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.guess-hint {
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.guess-status.has-guess {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  box-shadow: 0 4px 16px rgba(255, 107, 0, 0.2);
}

.calendar-area .placeholder-content {
  text-align: center;
  padding: 3rem;
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  color: var(--color-text-muted);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
