<script setup lang="ts">
import { useCalendarStore } from '../../stores/calendar'
import SelectCalendarDropdown from './components/SelectCalendarDropdown.vue'
import SurpriseCalendar from './components/SurpriseCalendar.vue'
import SwitchProfileDropdown from './components/SwitchProfileDropdown.vue'
import UserProfileMenu from './components/UserProfileMenu.vue'

const calendarStore = useCalendarStore()

</script>

<template>
  <div class="home-layout">
    <!-- Top Row: User Profile & Calendar Selection -->
    <header class="top-row">
      <UserProfileMenu />

      <div class="header-actions">
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
      <div v-else class="placeholder-content">
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
  overflow: hidden; /* Important for TresJS canvas bounds */
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
