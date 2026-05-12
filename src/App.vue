<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useProfileStore } from './stores/profile'

const authStore = useAuthStore()
const profileStore = useProfileStore()

onMounted(async () => {
  await authStore.initialize()
  if (authStore.user) {
    await profileStore.fetchProfiles()
  }
})

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    profileStore.fetchProfiles()
  } else {
    profileStore.profiles = []
    profileStore.activeProfile = null
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
