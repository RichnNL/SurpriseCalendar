<script setup lang="ts">
import { useCalendarStore, type Calendar } from '../../../stores/calendar'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const calendarStore = useCalendarStore()

function selectCalendar(calendar: Calendar) {
  calendarStore.setActiveCalendar(calendar)
  emit('close')
}

function isGameOver(calendar: Calendar) {
  return calendar.selected_cells_count >= calendar.prizes_count
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content auth-card" style="margin: 0; max-width: 500px; width: 90%; max-height: 80vh; display: flex; flex-direction: column;">
      <h2 style="color: var(--color-text); text-align: center; margin-bottom: 1.5rem;">Select Calendar</h2>
      
      <div v-if="calendarStore.isLoading" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">
        Loading calendars...
      </div>
      
      <div v-else class="calendar-list">
        <div 
          v-for="calendar in calendarStore.calendars" 
          :key="calendar.id"
          class="calendar-item"
          :class="{ 'active': calendar.id === calendarStore.activeCalendar?.id }"
          @click="selectCalendar(calendar)"
        >
          <div class="calendar-info">
            <h3 class="calendar-name">{{ calendar.name }}</h3>
            <span class="creator-name">Created by: {{ calendar.creator_username }}</span>
          </div>
          
          <div class="calendar-status">
            <span v-if="isGameOver(calendar)" class="status-badge game-over">Game Over</span>
            <span v-else class="status-badge active">Active</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button type="button" @click="$emit('close')" style="background: transparent; border: 1px solid var(--color-border); color: var(--color-text); width: auto; padding: 0.5rem 1.5rem;">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom Scrollbar for the list */
.calendar-list::-webkit-scrollbar {
  width: 6px;
}
.calendar-list::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}
.calendar-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.calendar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-item:hover {
  background-color: rgba(255, 107, 0, 0.05);
  border-color: var(--color-primary);
}

.calendar-item.active {
  background-color: rgba(255, 107, 0, 0.1);
  border-color: var(--color-secondary);
}

.calendar-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.calendar-name {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text);
  font-weight: 600;
}

.creator-name {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background-color: rgba(82, 196, 26, 0.2);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.4);
}

.status-badge.game-over {
  background-color: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.4);
}
</style>
