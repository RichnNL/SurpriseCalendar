<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
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
