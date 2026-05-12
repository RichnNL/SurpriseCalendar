<script setup lang="ts">
import { ref } from 'vue'
import { useCalendarStore } from '../../../stores/calendar'
import SelectCalendarModal from './SelectCalendarModal.vue'

const calendarStore = useCalendarStore()
const showModal = ref(false)
</script>

<template>
  <div>
    <div class="action-placeholder" @click="showModal = true">
      {{ calendarStore.activeCalendar?.name || 'Select Calendar' }} ▾
    </div>

    <SelectCalendarModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<style scoped>
.action-placeholder {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background-color 0.2s;
}

.action-placeholder:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
