import { describe, it, expect } from 'vitest'
import type { PlayerEstimate, UUID } from '@/types/player'
import {
  getRole,
  getSpectators,
  getVoters,
  mapRoomPlayers,
} from '@/utils/getRoomPlayers'
import { getEstimateCounts, shouldShowConfetti } from '@/utils/getEstimateCounts'
import { ESTIMATE_OPTIONS } from '@/types/estimates'

const id = (n: number) => `0000000${n}-0000-0000-0000-000000000000` as UUID

const p = (n: number, extra: Partial<PlayerEstimate> = {}): PlayerEstimate => ({
  id: id(n),
  name: `P${n}`,
  estimate: null,
  ...extra,
})

describe('roles', () => {
  it('treats a participant without role as player (legacy rooms)', () => {
    expect(getRole({})).toBe('player')
    expect(getRole({ role: undefined })).toBe('player')
    expect(getRole({ role: 'spectator' })).toBe('spectator')
  })

  it('mapRoomPlayers adds an explicit role and drops spectator estimates', () => {
    const mapped = mapRoomPlayers([id(1), id(2)], {
      [id(1)]: p(1, { estimate: '5' }),
      [id(2)]: p(2, { estimate: '8', role: 'spectator' }),
    })

    expect(mapped).toEqual([
      { id: id(1), name: 'P1', estimate: '5', role: 'player' },
      { id: id(2), name: 'P2', estimate: null, role: 'spectator' },
    ])
  })

  it('splits voters and spectators', () => {
    const all = [p(1), p(2, { role: 'spectator' }), p(3, { role: 'player' })]
    expect(getVoters(all).map((x) => x.name)).toEqual(['P1', 'P3'])
    expect(getSpectators(all).map((x) => x.name)).toEqual(['P2'])
  })

  it('counts only player estimates', () => {
    const counts = getEstimateCounts(
      [p(1, { estimate: '5' }), p(2, { estimate: '5', role: 'spectator' })],
      ESTIMATE_OPTIONS
    )
    expect(counts['5']).toBe(1)
  })

  it('a spectator without a vote never blocks "everyone has voted"', () => {
    const players = [
      p(1, { estimate: '3' }),
      p(2, { estimate: '3' }),
      p(3, { role: 'spectator' }),
    ]
    expect(shouldShowConfetti(players, true)).toBe(true)
  })

  it('a room with only spectators never triggers results', () => {
    const players = [p(1, { role: 'spectator' }), p(2, { role: 'spectator' })]
    expect(shouldShowConfetti(players, true)).toBe(false)
    expect(getVoters(players)).toEqual([])
  })
})
