<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <div class="form-group">
    <label class="form-label" for="password">Password</label>
    <input
      id="password"
      v-model="model"
      type="password"
      placeholder="••••••••"
      required
      minlength="6"
    />
  </div>
</template>
