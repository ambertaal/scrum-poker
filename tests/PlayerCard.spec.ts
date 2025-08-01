import { afterEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PlayerCard from '../src/components/PlayerCard.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ComponentPublicInstance } from 'vue'

interface PlayerCardProps {
  name: string
  estimate: string | null
  reveal: boolean
}

type PlayerCardComponent = ComponentPublicInstance<PlayerCardProps>;

const vuetify = createVuetify({
  components,
  directives,
})

describe('PlayerCard component', () => {
  let wrapper: VueWrapper<PlayerCardComponent>

  const defaultProps: PlayerCardProps = {
    name: 'Amber',
    estimate: null,
    reveal: false,
  }

  const mountPlayerCard = (props = {}) => {
    return mount(PlayerCard, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  test('renders the player name', () => {
    wrapper = mountPlayerCard()
    expect(wrapper.text()).toContain('Amber')
  })

  test('Estimate is null and reveal is false > shows "?"', () => {
    wrapper = mountPlayerCard()
    expect(wrapper.find('.flip-card-front').text()).toContain('?')
  })

  test('Estimate is set and reveal is false > shows card icon', () => {
    wrapper = mountPlayerCard({ estimate: '5' })
    expect(wrapper.findComponent({ name: 'v-icon' }).exists()).toBe(true)
    expect(wrapper.find('.flip-card').classes()).not.toContain('flipped')
  })

  test('Estimate is set and reveal is true > flips card and shows estimate', () => {
    wrapper = mountPlayerCard({ estimate: '8', reveal: true })
    expect(wrapper.find('.flip-card').classes()).toContain('flipped')
    expect(wrapper.find('.flip-card-back .player-estimate').text()).toBe('8')
  })

  test('Estimate is empty > renders empty estimate', () => {
    wrapper = mountPlayerCard({ estimate: '', reveal: true })
    expect(wrapper.find('.flip-card-back .player-estimate').text()).toBe('')
  })
})
