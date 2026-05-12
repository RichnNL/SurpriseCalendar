<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabase'
import AuthHeader from '../../components/AuthHeader.vue'

import LoginEmailInput from './components/LoginEmailInput.vue'
import LoginPasswordInput from './components/LoginPasswordInput.vue'
import LoginSubmitButton from './components/LoginSubmitButton.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <AuthHeader />
      <p class="auth-subtitle">Sign in to your account</p>

      <form @submit.prevent="handleLogin">
        <LoginEmailInput v-model="email" />
        <LoginPasswordInput v-model="password" />

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <LoginSubmitButton :loading="loading" />
      </form>

      <div style="text-align: center; margin-top: 2rem;">
        <span style="color: var(--color-text-muted);">Don't have an account? </span>
        <RouterLink to="/signup">Sign up</RouterLink>
      </div>
    </div>
  </div>
</template>
