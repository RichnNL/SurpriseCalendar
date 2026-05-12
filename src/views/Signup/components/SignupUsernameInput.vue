<script setup lang="ts">
const model = defineModel<string>()
defineProps<{
  isChecking: boolean
  usernameError: string
  isUsernameAvailable: boolean
}>()
</script>

<template>
  <div class="form-group">
    <label class="form-label" for="username">Username</label>
    <input
      id="username"
      v-model="model"
      type="text"
      placeholder="Enter a username"
      required
      minlength="3"
      maxlength="12"
    />
    <div style="font-size: 0.85rem; margin-top: 0.25rem; min-height: 1.2rem;">
      <span v-if="isChecking" style="color: var(--color-text-muted);">Checking availability...</span>
      <span v-else-if="usernameError" style="color: #ff4d4f;">{{ usernameError }}</span>
      <span v-else-if="isUsernameAvailable" style="color: #52c41a;">Username is available!</span>
    </div>
  </div>
</template>
