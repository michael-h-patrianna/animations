import { RewardBasicBadgeGlint } from '@/components/rewards/reward-basic/framer/RewardBasicBadgeGlint'
import { RewardBasicBadgeSweep } from '@/components/rewards/reward-basic/framer/RewardBasicBadgeSweep'
import { RewardBasicBounceEnergy } from '@/components/rewards/reward-basic/framer/RewardBasicBounceEnergy'
import { RewardBasicBounceSoft } from '@/components/rewards/reward-basic/framer/RewardBasicBounceSoft'
import { RewardBasicCoinSpinFast } from '@/components/rewards/reward-basic/framer/RewardBasicCoinSpinFast'
import { RewardBasicGlowOrbit } from '@/components/rewards/reward-basic/framer/RewardBasicGlowOrbit'
import { RewardBasicGlowPulse } from '@/components/rewards/reward-basic/framer/RewardBasicGlowPulse'
import { RewardBasicStarBurst } from '@/components/rewards/reward-basic/framer/RewardBasicStarBurst'
import { RewardBasicStarRadiate } from '@/components/rewards/reward-basic/framer/RewardBasicStarRadiate'
import { withAnimationCard } from '@/test/utils/animationTestUtils'
import { render } from '@testing-library/react'

describe('Rewards • Basic', () => {
  it('renders Badge Glint', () => {
    const { container, getByText } = render(
      withAnimationCard(<RewardBasicBadgeGlint />, { id: 'reward-basic__badge-glint', title: 'Glint', description: 'd', infinite: true })
    )
    expect(container.querySelector('[data-animation-id="reward-basic__badge-glint"]')).toBeTruthy()
    expect(getByText('Badge Glint')).toBeInTheDocument()
  })

  it('renders Badge Sweep', () => {
    const { container, getByText } = render(
      withAnimationCard(<RewardBasicBadgeSweep />, { id: 'reward-basic__badge-sweep', title: 'Sweep', description: 'd', infinite: true })
    )
    expect(container.querySelector('[data-animation-id="reward-basic__badge-sweep"]')).toBeTruthy()
    expect(getByText('Badge Sweep')).toBeInTheDocument()
  })

  it('renders Glow Orbit', () => {
    const { container, getByText } = render(
      withAnimationCard(<RewardBasicGlowOrbit />, { id: 'reward-basic__glow-orbit', title: 'Glow', description: 'd', infinite: true })
    )
    expect(container.querySelector('[data-animation-id="reward-basic__glow-orbit"]')).toBeTruthy()
    expect(getByText('Glow Orbit')).toBeInTheDocument()
  })

  it('renders remaining basic variants', async () => {
    const cases = [
      ['reward-basic__bounce-energy', <RewardBasicBounceEnergy />, 'Bounce Energy'],
      ['reward-basic__bounce-soft', <RewardBasicBounceSoft />, 'Bounce Soft'],
      ['reward-basic__coin-spin-fast', <RewardBasicCoinSpinFast />, 'Coin Spin'],
      ['reward-basic__glow-pulse', <RewardBasicGlowPulse />, 'Glow Pulse'],
      ['reward-basic__star-burst', <RewardBasicStarBurst />, 'Star Burst'],
      ['reward-basic__star-radiate', <RewardBasicStarRadiate />, 'Star Radiate'],
    ] as const

    for (const [id, node, title] of cases) {
      const { container, unmount } = render(
        withAnimationCard(node, { id, title, description: 'Test', infinite: true })
      )
      expect(container.querySelector(`[data-animation-id="${id}"]`)).toBeInTheDocument()
      unmount()
    }
  })
})
