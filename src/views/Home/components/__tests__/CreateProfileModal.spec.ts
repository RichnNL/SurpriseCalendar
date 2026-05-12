import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateProfileModal from '../CreateProfileModal.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useProfileStore } from '../../../../stores/profile'
import { supabase } from '../../../../supabase'

vi.mock('../../../../supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn()
  }
}))

vi.mock('../../../../stores/profile', () => ({
  useProfileStore: vi.fn()
}))

describe('CreateProfileModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.mocked(useProfileStore).mockReturnValue({
      createProfile: vi.fn().mockResolvedValue(true)
    } as any)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('debounces username check and displays availability', async () => {
    // @ts-ignore
    vi.mocked(supabase.from('profiles').maybeSingle).mockResolvedValue({ data: null, error: null })
    
    const wrapper = mount(CreateProfileModal)
    
    const input = wrapper.find('input')
    await input.setValue('newuser')
    
    // Fast-forward debounce
    vi.advanceTimersByTime(600)
    
    // Wait for promises to resolve
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Username is available!')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('displays error if username is taken', async () => {
    // @ts-ignore
    vi.mocked(supabase.from('profiles').maybeSingle).mockResolvedValue({ data: { username: 'taken' }, error: null })
    
    const wrapper = mount(CreateProfileModal)
    
    const input = wrapper.find('input')
    await input.setValue('taken')
    
    vi.advanceTimersByTime(600)
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('This username is already taken.')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})
