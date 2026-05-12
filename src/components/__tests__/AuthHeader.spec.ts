import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AuthHeader from '../AuthHeader.vue'

describe('AuthHeader', () => {
  it('renders properly', () => {
    const wrapper = mount(AuthHeader)
    expect(wrapper.text()).toContain('Surprise Calendar')
    expect(wrapper.find('img').exists()).toBe(true)
  })
})
