import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

// Mocks must be defined before importing the module under test
const refMock = vi.fn()
const setMock = vi.fn()
const updateMock = vi.fn()
const ensureAuthUidMock = vi.fn()

vi.mock('firebase/database', () => {
  return {
    ref: (...args: unknown[]) => refMock(...args),
    set: (...args: unknown[]) => setMock(...args),
    update: (...args: unknown[]) => updateMock(...args),
  }
})

vi.mock('@/firebase', () => {
  return {
    db: {},
    ensureAuthUid: () => ensureAuthUidMock(),
  }
})

// Now import after mocks
import { db } from '../../src/firebase'
import { savePlayer, setPlayerEstimate, setPlayerRole } from '../../src/api/playerService'
import type { UUID } from '../../src/stores/player'

describe('playerService', () => {
  beforeEach(() => {
    refMock.mockReset()
    setMock.mockReset()
    updateMock.mockReset()
    ensureAuthUidMock.mockReset()
    ensureAuthUidMock.mockResolvedValue('auth-uid-1')
    localStorage.clear()
  })

  describe('savePlayer', () => {
    it('writes the full player object (role + owner) to the correct path', async () => {
      const userId = 'user-123' as UUID
      const username = 'Amber'
      const fakeRef = { key: 'players/user-123' }

      refMock.mockReturnValueOnce(fakeRef)
      setMock.mockResolvedValueOnce(undefined)

      await savePlayer(userId, username)

      expect(refMock).toHaveBeenCalledWith(db, `players/${userId}`)
      expect(setMock).toHaveBeenCalledWith(fakeRef, {
        id: userId,
        name: username,
        estimate: null,
        role: 'player',
        ownerUid: 'auth-uid-1',
      })
    })

    it('stores the chosen role and persists name + role to localStorage', async () => {
      const userId = 'user-123' as UUID
      refMock.mockReturnValueOnce({})
      setMock.mockResolvedValueOnce(undefined)

      await savePlayer(userId, 'Tim', 'spectator')

      expect(setMock.mock.calls[0]![1]).toMatchObject({ role: 'spectator', estimate: null })
      expect(localStorage.getItem('playerUsername')).toBe('Tim')
      expect(localStorage.getItem('playerRole')).toBe('spectator')
    })

    it('omits ownerUid when anonymous auth is unavailable', async () => {
      ensureAuthUidMock.mockResolvedValueOnce(null)
      refMock.mockReturnValueOnce({})
      setMock.mockResolvedValueOnce(undefined)

      await savePlayer('user-1' as UUID, 'Lisa')

      expect(setMock.mock.calls[0]![1]).not.toHaveProperty('ownerUid')
    })
  })

  describe('setPlayerRole', () => {
    it('switching to spectator clears the estimate', async () => {
      const fakeRef = { key: 'players/user-1' }
      refMock.mockReturnValueOnce(fakeRef)
      updateMock.mockResolvedValueOnce(undefined)

      await setPlayerRole('user-1' as UUID, 'spectator')

      expect(refMock).toHaveBeenCalledWith(db, 'players/user-1')
      expect(updateMock).toHaveBeenCalledWith(fakeRef, { role: 'spectator', estimate: null })
      expect(localStorage.getItem('playerRole')).toBe('spectator')
    })

    it('joining as player starts without a selection', async () => {
      refMock.mockReturnValueOnce({})
      updateMock.mockResolvedValueOnce(undefined)

      await setPlayerRole('user-1' as UUID, 'player')

      expect(updateMock.mock.calls[0]![1]).toEqual({ role: 'player', estimate: null })
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
