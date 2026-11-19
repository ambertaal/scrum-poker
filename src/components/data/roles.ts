import type { PlayerRole } from '@/types/player'

interface RoleText {
  label: string
  description: string
}

export const roleText = {
  player: {
    label: 'Player',
    description: 'You pick a card and your estimate counts towards the result. You can switch later.',
  },
  spectator: {
    label: 'Spectator',
    description:
      "You watch along and see the results, but you don't vote. You can switch later.",
  },
} as const satisfies Record<PlayerRole, RoleText>

export const switchToSpectatorNote = 'Switching to spectator removes your estimate.'

export const joinedAsPlayerMessage =
  'You joined as a player. Pick a card to estimate.'
