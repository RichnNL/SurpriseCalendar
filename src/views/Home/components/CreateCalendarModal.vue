<script setup lang="ts">
import { ref, watch } from 'vue'
import { supabase } from '../../../supabase'
import { useProfileStore } from '../../../stores/profile'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'back'): void
}>()

const profileStore = useProfileStore()
const newCalendarName = ref('')
const isChecking = ref(false)
const isAvailable = ref<boolean | null>(null)
const isSubmitting = ref(false)
const errorMsg = ref('')

let debounceTimeout: any = null

watch(newCalendarName, (newVal) => {
  isAvailable.value = null
  errorMsg.value = ''
  if (!newVal.trim()) return

  isChecking.value = true
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(async () => {
    try {
      const { data, error } = await supabase
        .from('calendars')
        .select('name')
        .eq('name', newVal.trim())
        .maybeSingle()

      if (error) throw error
      isAvailable.value = !data
    } catch (err: any) {
      errorMsg.value = err.message
      isAvailable.value = null
    } finally {
      isChecking.value = false
    }
  }, 500)
})

async function submitCalendar() {
  if (!isAvailable.value || !newCalendarName.value.trim() || !profileStore.activeProfile) return

  isSubmitting.value = true
  errorMsg.value = ''

  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token

    if (!token) throw new Error('No auth token found')

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(`${baseUrl}/calendar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: profileStore.activeProfile.id,
        CalendarName: newCalendarName.value.trim()
      })
    })
    console.log(response)
    if (!response.ok) {
      const txt = await response.text()
      throw new Error(txt || `HTTP error: ${response.status}`)
    }

    // Success, go back to list
    emit('back')
  } catch (error: any) {
    console.log(error);
    console.error('Create calendar error:', error)
    errorMsg.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="create-container">
    <h2 style="color: var(--color-text); text-align: center; margin-bottom: 1.5rem;">Create New Calendar</h2>
    
    <form @submit.prevent="submitCalendar" class="create-form">
      <div class="input-group">
        <label for="calendarName">Calendar Name</label>
        <input 
          id="calendarName"
          v-model="newCalendarName" 
          type="text" 
          placeholder="e.g. My Awesome Calendar" 
          required
          :disabled="isSubmitting"
        />
        <div style="min-height: 20px; margin-top: 0.25rem;">
          <span v-if="isChecking" class="status-text checking">Checking availability...</span>
          <span v-else-if="isAvailable === true" class="status-text success">Name is available!</span>
          <span v-else-if="isAvailable === false" class="status-text error">This name is already taken.</span>
        </div>
      </div>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$emit('back')" :disabled="isSubmitting">Cancel</button>
        <button 
          type="submit" 
          class="btn-submit auth-button"
          :disabled="isSubmitting || isChecking || !isAvailable || !newCalendarName.trim()"
        >
          {{ isSubmitting ? 'Creating...' : 'Create Calendar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-container {
  display: flex;
  flex-direction: column;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.input-group input {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.status-text {
  font-size: 0.85rem;
}
.checking { color: var(--color-text-muted); }
.success { color: #52c41a; }
.error { color: #ff4d4f; }

.error-msg {
  padding: 0.75rem;
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-submit {
  flex: 1;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
