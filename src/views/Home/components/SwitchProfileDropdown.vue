<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore, type Profile } from '../../../stores/profile'
import CreateProfileModal from './CreateProfileModal.vue'

const profileStore = useProfileStore()
const isOpen = ref(false)
const showCreateModal = ref(false)

function selectProfile(profile: Profile) {
  profileStore.setActiveProfile(profile)
  isOpen.value = false
}
</script>

<template>
  <div class="dropdown-container">
    <div class="action-placeholder" @click="isOpen = !isOpen">
      {{ profileStore.activeProfile ? profileStore.activeProfile.username : 'Switch Profile' }} ▾
    </div>

    <div v-if="isOpen" class="dropdown-menu">
      <div 
        v-for="profile in profileStore.profiles" 
        :key="profile.id"
        class="dropdown-item"
        :class="{ 'active': profile.id === profileStore.activeProfile?.id }"
        @click="selectProfile(profile)"
      >
        {{ profile.username }}
      </div>
      
      <div class="dropdown-divider"></div>
      
      <div class="dropdown-item create-action" @click="showCreateModal = true; isOpen = false">
        + Create new profile
      </div>
    </div>
  </div>

  <CreateProfileModal v-if="showCreateModal" @close="showCreateModal = false" />
</template>

<style scoped>
.dropdown-container {
  position: relative;
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

.action-placeholder:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  overflow: hidden;
  z-index: 50;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  color: var(--color-text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(255, 107, 0, 0.1);
  color: var(--color-secondary);
}

.dropdown-item.active {
  background-color: rgba(255, 107, 0, 0.2);
  color: var(--color-secondary);
  font-weight: 600;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.25rem 0;
}

.create-action {
  color: var(--color-secondary);
  font-weight: 500;
}
</style>
