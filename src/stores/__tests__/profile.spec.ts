import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '../profile'
import { useAuthStore } from '../auth'
import { supabase } from '../../supabase'

vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    overrideTypes: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }
}))

vi.mock('../auth', () => ({
  useAuthStore: vi.fn()
}))

describe('Profile Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    // Mock default auth user
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: 'test-user-id' }
    } as any)
  })

  it('fetches and maps profiles, setting active profile', async () => {
    const store = useProfileStore()
    
    // Mock supabase response
    const mockData = [
      { id: '1', user_id: 'test-user-id', username: 'Old', created_at: '2023-01-01T00:00:00Z', last_switched_at: '2023-01-02T00:00:00Z' },
      { id: '2', user_id: 'test-user-id', username: 'New', created_at: '2023-01-01T00:00:00Z', last_switched_at: '2023-01-05T00:00:00Z' }
    ]
    
    // @ts-ignore
    vi.mocked(supabase.from('profiles').overrideTypes).mockResolvedValue({ data: mockData, error: null })

    await store.fetchProfiles()

    expect(store.profiles.length).toBe(2)
    // Check Date conversion
    expect(store.profiles[0].created_at).toBeInstanceOf(Date)
    
    expect(store.activeProfile?.id).toBe('1')
    expect(store.isLoading).toBe(false)
  })

  it('setActiveProfile updates the store and calls supabase update', async () => {
    const store = useProfileStore()
    // @ts-ignore
    vi.mocked(supabase.from('profiles').eq).mockResolvedValue({ error: null })
    
    const mockProfile = { id: '1', user_id: '123', username: 'Test', created_at: new Date(), last_switched_at: null }
    
    await store.setActiveProfile(mockProfile)
    
    expect(store.activeProfile?.id).toBe('1')
    expect(store.activeProfile?.last_switched_at).toBeInstanceOf(Date)
    
    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(supabase.from('profiles').update).toHaveBeenCalled()
  })
})
