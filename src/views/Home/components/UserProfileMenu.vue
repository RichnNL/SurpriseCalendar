<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isProfileMenuOpen = ref(false)

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="user-menu-container">
    <div class="user-info" @click="isProfileMenuOpen = !isProfileMenuOpen">
      <img src="../../../assets/avatar.png" alt="User Avatar" class="avatar" />
      <span class="greeting">Hello, {{ authStore.user?.user_metadata?.username || 'User' }}</span>
    </div>
    
    <div v-if="isProfileMenuOpen" class="profile-dropdown">
      <button class="dropdown-item" @click="handleSignOut">Sign Out</button>
    </div>
  </div>
</template>

<style scoped>
.user-menu-container {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.profile-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  overflow: hidden;
  z-index: 20;
}

.dropdown-item {
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--color-text);
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(255, 107, 0, 0.1);
  color: var(--color-secondary);
}

.greeting {
  font-weight: 600;
  color: var(--color-text);
  display: none; /* Hide on very small screens */
}

@media (min-width: 600px) {
  .greeting {
    display: block;
  }
}
</style>
