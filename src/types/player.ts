import type { EstimateOption } from '@/types/estimates'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface PlayerEstimate {
  id: UUID
  name: string
  estimate: EstimateOption | null
}

export type PlayersById = Record<string, PlayerEstimate>
