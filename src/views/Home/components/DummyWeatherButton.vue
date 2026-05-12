<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../../supabase'

const isSuccess = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

async function fetchWeather() {
  isLoading.value = true
  isSuccess.value = false
  errorMsg.value = ''

  try {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    console.log(token)
    if (!token) throw new Error('No auth token found')

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(`${baseUrl}/weatherforecast`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log(response)

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    isSuccess.value = true
  } catch (error: any) {
    console.error('Weather fetch error:', error)
    errorMsg.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="weather-btn-container">
    <button class="action-placeholder" @click="fetchWeather" :disabled="isLoading">
      {{ isLoading ? 'Loading...' : 'Get Weather' }}
    </button>
    <span v-if="isSuccess" class="status-text success">Okay</span>
    <span v-else-if="errorMsg" class="status-text error">Error</span>
  </div>
</template>

<style scoped>
.weather-btn-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

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

.action-placeholder:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.15);
}

.action-placeholder:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-text {
  font-size: 0.85rem;
  font-weight: 600;
}

.success {
  color: #52c41a;
}

.error {
  color: #ff4d4f;
}
</style>
