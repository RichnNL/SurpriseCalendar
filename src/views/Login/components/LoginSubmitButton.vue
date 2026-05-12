<script setup lang="ts">
defineProps<{
  loading: boolean
}>()
</script>

<template>
  <button type="submit" :disabled="loading">
    {{ loading ? 'Signing in...' : 'Sign In' }}
  </button>
</template>
