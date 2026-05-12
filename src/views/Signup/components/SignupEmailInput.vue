<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <div class="form-group">
    <label class="form-label" for="email">Email</label>
    <input
      id="email"
      v-model="model"
      type="email"
      placeholder="you@example.com"
      required
    />
  </div>
</template>
