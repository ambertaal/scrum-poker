import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

// Mocks must be defined before importing the module under test
const refMock = vi.fn()
const setMock = vi.fn()

vi.mock('firebase/database', () => {
  return {
    ref: (...args: unknown[]) => refMock(...args),
    set: (...args: unknown[]) => setMock(...args),
  }
})

vi.mock('@/firebase', () => {
  return {
    db: {}, 
  }
})

// Now import after mocks
import { db } from '@/firebase'
import { savePlayer, setPlayerEstimate } from '@/api/playerService'
import type { UUID } from '@/stores/player'

describe('playerService', () => {
  beforeEach(() => {
    refMock.mockReset()
    setMock.mockReset()
  })

  describe('savePlayer', () => {
    it('writes the full player object to the correct path', () => {
      const userId = 'user-123' as UUID
      const username = 'Amber'
      const fakeRef = { key: 'players/user-123' }

      refMock.mockReturnValueOnce(fakeRef)

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      const result = savePlayer(userId, username)

      // Uses correct Firebase path
      expect(refMock).toHaveBeenCalledWith(db, `players/${userId}`)

      // Writes expected payload
      expect(setMock).toHaveBeenCalledWith(fakeRef, {
        id: userId,
        name: username,
        estimate: null,
      })

      // Returns whatever `set` returns
      expect(result).toBe(fakePromise)
    })
  })

  describe('setPlayerEstimate', () => {
    it('writes the estimate to the correct player estimate path', () => {
      const userId = 'user-456' as UUID
      const estimate = '8'
      const fakeRef = { key: 'players/user-456/estimate' }

      refMock.mockReturnValueOnce(fakeRef)

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      const result = setPlayerEstimate(userId, estimate)

      // Uses correct Firebase path
      expect(refMock).toHaveBeenCalledWith(db, `players/${userId}/estimate`)

      // Writes plain estimate value
      expect(setMock).toHaveBeenCalledWith(fakeRef, estimate)

      // Returns whatever `set` returns
      expect(result).toBe(fakePromise)
    })

    it('supports setting estimate to null', () => {
      const userId = 'user-789' as UUID
      const estimate = null
      const fakeRef = { key: 'players/user-789/estimate' }

      refMock.mockReturnValueOnce(fakeRef)

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      setPlayerEstimate(userId, estimate)

      expect(refMock).toHaveBeenCalledWith(db, `players/${userId}/estimate`)
      expect(setMock).toHaveBeenCalledWith(fakeRef, null)
    })
  })
})
