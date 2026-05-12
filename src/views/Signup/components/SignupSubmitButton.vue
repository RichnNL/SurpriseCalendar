<script setup lang="ts">
defineProps<{
  loading: boolean
  isFormValid: boolean
}>()
</script>

<template>
  <button type="submit" :disabled="loading || !isFormValid" :style="{ opacity: (!isFormValid || loading) ? 0.5 : 1, cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer' }">
    {{ loading ? 'Creating account...' : 'Sign Up' }}
  </button>
</template>
