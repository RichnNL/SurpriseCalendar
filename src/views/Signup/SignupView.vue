<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabase'
import AuthHeader from '../../components/AuthHeader.vue'

import SignupUsernameInput from './components/SignupUsernameInput.vue'
import SignupEmailInput from './components/SignupEmailInput.vue'
import SignupPasswordInput from './components/SignupPasswordInput.vue'
import SignupAgeCheckbox from './components/SignupAgeCheckbox.vue'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const isOver18 = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const isChecking = ref(false)
const usernameError = ref('')
const isUsernameAvailable = ref(false)

let debounceTimeout: any = null

async function checkUsernameAvailability(newUsername: string) {
  clearTimeout(debounceTimeout)
  usernameError.value = ''
  isUsernameAvailable.value = false

  if (newUsername.length < 3) {
    return 
  }

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

watch(username, (newVal) => {
  checkUsernameAvailability(newVal)
})

const isFormValid = computed(() => {
  return isUsernameAvailable.value && 
         email.value.trim().length > 0 && 
         password.value.length >= 6 && 
         isOver18.value &&
         !isChecking.value
})

async function handleSignUp() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (usernameError.value) {
      throw new Error(usernameError.value)
    }

    if (!isUsernameAvailable.value) {
      throw new Error('Please enter a valid, available username.')
    }

    if (!isOver18.value) {
      throw new Error('You must be at least 18 years old to sign up.')
    }
    
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value
        }
      }
    })

    if (error) throw error
    
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to sign up'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <AuthHeader />
      <p class="auth-subtitle">Join us to get started</p>

      <form @submit.prevent="handleSignUp">
        <SignupUsernameInput 
          v-model="username" 
          :isChecking="isChecking" 
          :usernameError="usernameError" 
          :isUsernameAvailable="isUsernameAvailable" 
        />
        
        <SignupEmailInput v-model="email" />
        
        <SignupPasswordInput v-model="password" />
        
        <SignupAgeCheckbox v-model="isOver18" />

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit" :disabled="loading || !isFormValid" :style="{ opacity: (!isFormValid || loading) ? 0.5 : 1, cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer' }">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <div style="text-align: center; margin-top: 2rem;">
        <span style="color: var(--color-text-muted);">Already have an account? </span>
        <RouterLink to="/login">Sign in</RouterLink>
      </div>
    </div>
  </div>
</template>
