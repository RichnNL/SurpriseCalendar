import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfileMenu from '../UserProfileMenu.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../../../stores/auth'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

vi.mock('../../../../stores/auth', () => ({
  useAuthStore: vi.fn()
}))

describe('UserProfileMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders user email properly', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: vi.fn()
    } as any)

    const wrapper = mount(UserProfileMenu)
    expect(wrapper.text()).toContain('test@example.com')
  })

  it('toggles dropdown and handles sign out', async () => {
    const signOutMock = vi.fn().mockResolvedValue(true)
    vi.mocked(useAuthStore).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: signOutMock
    } as any)

    const wrapper = mount(UserProfileMenu)
    
    // Dropdown initially closed
    expect(wrapper.find('.profile-dropdown').exists()).toBe(false)
    
    // Click to open
    await wrapper.find('.user-info').trigger('click')
    expect(wrapper.find('.profile-dropdown').exists()).toBe(true)
    
    // Click sign out
    await wrapper.find('.dropdown-item').trigger('click')
    expect(signOutMock).toHaveBeenCalled()
  })
})
