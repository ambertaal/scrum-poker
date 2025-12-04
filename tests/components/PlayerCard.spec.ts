import { afterEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PlayerCard from '../../src/components/PlayerCard.vue'
import type { ComponentPublicInstance } from 'vue'

interface PlayerCardProps {
  playerName: string
  estimate?: string | null
  reveal: boolean
}

type PlayerCardComponent = ComponentPublicInstance<PlayerCardProps>

describe('PlayerCard component', () => {
  let wrapper: VueWrapper<PlayerCardComponent>

  const defaultProps: PlayerCardProps = {
    playerName: 'Amber',
    estimate: null,
    reveal: false,
  }

  const mountPlayerCard = (props: Partial<PlayerCardProps> = {}) => {
    return mount(PlayerCard, {
      props: { ...defaultProps, ...props },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  test('renders the player name', () => {
    wrapper = mountPlayerCard()
    expect(wrapper.text()).toContain('Amber')
  })

  test('estimate is null and reveal is false → no User icon and empty estimate text', () => {
    wrapper = mountPlayerCard({ estimate: null, reveal: false })

    // Front: no User icon (lucide renders as <svg />)
    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBe(0)

    // Back: estimate span (second span) should be empty
    const spans = wrapper.findAll('span')
    const estimateSpan = spans[1] // front span, back span, name span
    expect(estimateSpan.text()).toBe('')
  })

  test('estimate is set and reveal is false → shows User icon and has estimate text in DOM', () => {
    wrapper = mountPlayerCard({ estimate: '5', reveal: false })

    // Front: User icon rendered as an <svg>
    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBeGreaterThan(0)

    // Back: estimate should be present somewhere in text
    expect(wrapper.text()).toContain('5')
  })

  test('estimate is set and reveal is true → flip class is applied and estimate is visible', () => {
    wrapper = mountPlayerCard({ estimate: '8', reveal: true })

    // Flip container is the div with transition-transform in its class list
    const flipContainer = wrapper.find('div[class*="transition-transform"]')
    expect(flipContainer.exists()).toBe(true)
    expect(flipContainer.attributes('class')).toContain('[transform:rotateY(180deg)]')

    // Back: estimate text should be present
    const spans = wrapper.findAll('span')
    const estimateSpan = spans[1] // second span is the back estimate
    expect(estimateSpan.text()).toBe('8')
  })

  test('estimate is empty string → renders empty estimate on the back', () => {
    wrapper = mountPlayerCard({ estimate: '', reveal: true })

    const spans = wrapper.findAll('span')
    const estimateSpan = spans[1]
    expect(estimateSpan.text()).toBe('')
  })
})
