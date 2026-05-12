<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { supabase } from '../../../supabase'
import { useProfileStore } from '../../../stores/profile'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const profileStore = useProfileStore()

const username = ref('')
const isChecking = ref(false)
const usernameError = ref('')
const isUsernameAvailable = ref(false)
const isSubmitting = ref(false)

let debounceTimeout: any = null

async function checkUsernameAvailability(newUsername: string) {
  clearTimeout(debounceTimeout)
  usernameError.value = ''
  isUsernameAvailable.value = false

  if (newUsername.length < 3) return

  debounceTimeout = setTimeout(async () => {
    isChecking.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        usernameError.value = 'This username is already taken.'
      } else {
        isUsernameAvailable.value = true
      }
    } catch (error) {
      console.error('Error checking username:', error)
    } finally {
      isChecking.value = false
    }
  }, 500)
}

watch(username, (newVal) => checkUsernameAvailability(newVal))

const isFormValid = computed(() => {
  return isUsernameAvailable.value && !isChecking.value
})

async function handleCreateProfile() {
  if (!isFormValid.value) return
  isSubmitting.value = true
  try {
    await profileStore.createProfile(username.value)
    emit('close')
  } catch (error) {
    usernameError.value = 'Failed to create profile.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content auth-card" style="margin: 0; max-width: 400px; width: 90%;">
      <h2 style="color: var(--color-text); text-align: center; margin-bottom: 1.5rem;">Create New Profile</h2>
      
      <form @submit.prevent="handleCreateProfile">
        <div class="form-group">
          <label class="form-label" for="new-username">Username</label>
          <input
            id="new-username"
            v-model="username"
            type="text"
            placeholder="Enter a new username"
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

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button type="button" @click="$emit('close')" style="background: transparent; border: 1px solid var(--color-border); color: var(--color-text);">Cancel</button>
          <button type="submit" :disabled="isSubmitting || !isFormValid" :style="{ opacity: (!isFormValid || isSubmitting) ? 0.5 : 1, cursor: (!isFormValid || isSubmitting) ? 'not-allowed' : 'pointer' }">
            {{ isSubmitting ? 'Creating...' : 'Create Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
</style>
