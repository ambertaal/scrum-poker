import type { EstimateOption } from '@/types/estimates'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export const PLAYER_ROLES = ['player', 'spectator'] as const

/**
 * Role of a participant.
 * - player: picks a card and counts towards the result
 * - spectator: watches along, never votes and never counts
 */
export type PlayerRole = (typeof PLAYER_ROLES)[number]

export const DEFAULT_ROLE: PlayerRole = 'player'

export const isPlayerRole = (value: unknown): value is PlayerRole =>
  typeof value === 'string' && (PLAYER_ROLES as readonly string[]).includes(value)

export interface PlayerEstimate {
  id: UUID
  name: string
  estimate: EstimateOption | null
  /** Missing on records from before roles existed → treat as 'player'. */
  role?: PlayerRole
}

export type PlayersById = Record<string, PlayerEstimate>
