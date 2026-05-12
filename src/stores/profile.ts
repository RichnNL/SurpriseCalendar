import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useAuthStore } from './auth'

export interface ProfileRow {
  id: string
  user_id: string
  username: string
  last_switched_at: string | null
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  username: string
  last_switched_at: Date | null
  created_at: Date
}

export const useProfileStore = defineStore('profile', () => {
  const profiles = ref<Profile[]>([])
  const activeProfile = ref<Profile | null>(null)
  const isLoading = ref(false)

  async function fetchProfiles() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('last_switched_at', { ascending: false, nullsFirst: false })
        .overrideTypes<Array<ProfileRow>, { merge: false }>()

      if (error) throw error

      profiles.value = (data || []).map((p) => ({
        ...p,
        created_at: new Date(p.created_at),
        last_switched_at: p.last_switched_at ? new Date(p.last_switched_at) : null
      }))
      
      if (activeProfile.value) {
        const stillExists = profiles.value.find(p => p.id === activeProfile.value?.id)
        if (!stillExists) activeProfile.value = profiles.value[0] || null
      } else {
        activeProfile.value = profiles.value[0] || null
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function setActiveProfile(profile: Profile) {
    activeProfile.value = profile

    try {
      const now = new Date()
      const { error } = await supabase
        .from('profiles')
        .update({ last_switched_at: now.toISOString() })
        .eq('id', profile.id)

      if (error) throw error
      
      profile.last_switched_at = now
    } catch (error) {
      console.error('Error updating last_switched_at:', error)
    }
  }

  async function createProfile(username: string) {
    const authStore = useAuthStore()
    if (!authStore.user) return null

    try {
      const now = new Date()
      const { data, error } = await supabase
        .from('profiles')
        .insert({ 
          username: username,
          user_id: authStore.user.id,
          last_switched_at: now.toISOString()
        })
        .select()
        .single<ProfileRow>();

      if (error) throw error

      if (data) {
        const newProfile: Profile = {
          ...data,
          created_at: new Date(data.created_at),
          last_switched_at: data.last_switched_at ? new Date(data.last_switched_at) : null
        }
        profiles.value.push(newProfile)
        activeProfile.value = newProfile
      }
      return data
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  return {
    profiles,
    activeProfile,
    isLoading,
    fetchProfiles,
    setActiveProfile,
    createProfile
  }
})
