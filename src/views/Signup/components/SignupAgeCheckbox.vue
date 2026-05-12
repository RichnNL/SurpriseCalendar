<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
    <input
      id="isOver18"
      v-model="model"
      type="checkbox"
      required
      style="width: auto; margin-bottom: 0;"
    />
    <label class="form-label" for="isOver18" style="margin-bottom: 0;">I confirm that I am 18 years or older.</label>
  </div>
</template>
