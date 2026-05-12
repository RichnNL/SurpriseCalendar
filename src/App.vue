<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useProfileStore } from './stores/profile'
import { useCalendarStore } from './stores/calendar'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const calendarStore = useCalendarStore()

async function loadInitialData() {
  await profileStore.fetchProfiles()
  await calendarStore.fetchCalendars()
  calendarStore.initializeRealtime()
  
  // Find the user's active profile
  const activeProf = profileStore.activeProfile
  if (activeProf && calendarStore.calendars.length > 0) {
    const userCalendars = calendarStore.calendars.filter(c => c.created_by === activeProf.id)
    if (userCalendars.length > 0 && userCalendars[0] != null) {
      calendarStore.setActiveCalendar(userCalendars[0])
    }
  }
}

onMounted(async () => {
  await authStore.initialize()
  if (authStore.user) {
    await loadInitialData()
  }
})

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    loadInitialData()
  } else {
    profileStore.profiles = []
    profileStore.activeProfile = null
    calendarStore.calendars = []
    calendarStore.activeCalendar = null
  }
})
</script>

<template>
  <div v-if="!authStore.isInitialized" class="auth-container">
    <div style="text-align: center; color: var(--color-text-muted);">
      Loading...
    </div>
  </div>
  <RouterView v-else />
</template>

<style>
/* Global App Styles if needed, most are in main.css */
</style>
