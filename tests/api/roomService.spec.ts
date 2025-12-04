import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

// ---- Mocks must be defined before importing the module under test ----

// Firebase mocks
const refMock = vi.fn()
const getMock = vi.fn()
const setMock = vi.fn()
const updateMock = vi.fn()

vi.mock('firebase/database', () => {
  return {
    ref: (...args: unknown[]) => refMock(...args),
    get: (...args: unknown[]) => getMock(...args),
    set: (...args: unknown[]) => setMock(...args),
    update: (...args: unknown[]) => updateMock(...args),
  }
})

vi.mock('@/firebase', () => {
  return {
    db: {}, // dummy db instance
  }
})

// ---- Import after mocks ----

import { db } from '@/firebase'
import {
  createRoomWithOwner,
  addPlayerToRoom,
  setRevealEstimates,
  resetRoomEstimates,
  clearRoom,
} from '@/api/roomService' // adjust path if needed

// Local alias for the UUID type
type UUID = string

describe('roomService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createRoomWithOwner', () => {
    it('creates a room with owner, revealEstimates=false and createdAt=Date.now()', () => {
      const roomId = '123456'
      const ownerId = 'user-1' as UUID
      const fakeRef = { path: `rooms/${roomId}` }

      ;(refMock as Mock).mockReturnValueOnce(fakeRef)

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

      const result = createRoomWithOwner(roomId, ownerId)

      expect(refMock).toHaveBeenCalledWith(db, `rooms/${roomId}`)
      expect(setMock).toHaveBeenCalledWith(fakeRef, {
        players: [ownerId],
        revealEstimates: false,
        createdAt: 1700000000000,
      })

      expect(result).toBe(fakePromise)

      nowSpy.mockRestore()
    })
  })

  describe('addPlayerToRoom', () => {
    it('adds player when no players exist in the room', async () => {
      const roomId = 'room-1'
      const playerId = 'user-1' as UUID
      const playersRef = { path: `rooms/${roomId}/players` }

      ;(refMock as Mock).mockReturnValueOnce(playersRef)
      ;(getMock as Mock).mockResolvedValueOnce({
        val: () => null,
      })

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      await addPlayerToRoom(roomId, playerId)

      expect(refMock).toHaveBeenCalledWith(db, `rooms/${roomId}/players`)
      expect(getMock).toHaveBeenCalledWith(playersRef)
      expect(setMock).toHaveBeenCalledWith(playersRef, [playerId])
    })

    it('appends player when there are existing players and player is not in list', async () => {
      const roomId = 'room-2'
      const existingId = 'user-1' as UUID
      const newId = 'user-2' as UUID
      const playersRef = { path: `rooms/${roomId}/players` }

      ;(refMock as Mock).mockReturnValueOnce(playersRef)
      ;(getMock as Mock).mockResolvedValueOnce({
        val: () => [existingId],
      })

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      await addPlayerToRoom(roomId, newId)

      expect(getMock).toHaveBeenCalledWith(playersRef)
      expect(setMock).toHaveBeenCalledWith(playersRef, [existingId, newId])
    })

    it('does nothing if player is already in the room', async () => {
      const roomId = 'room-3'
      const playerId = 'user-1' as UUID
      const playersRef = { path: `rooms/${roomId}/players` }

      ;(refMock as Mock).mockReturnValueOnce(playersRef)
      ;(getMock as Mock).mockResolvedValueOnce({
        val: () => [playerId],
      })

      await addPlayerToRoom(roomId, playerId)

      expect(getMock).toHaveBeenCalledWith(playersRef)
      expect(setMock).not.toHaveBeenCalled()
    })
  })

  describe('setRevealEstimates', () => {
    it('sets revealEstimates flag for the room', () => {
      const roomId = 'room-4'
      const reveal = true
      const revealRef = { path: `rooms/${roomId}/revealEstimates` }

      ;(refMock as Mock).mockReturnValueOnce(revealRef)

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      const result = setRevealEstimates(roomId, reveal)

      expect(refMock).toHaveBeenCalledWith(db, `rooms/${roomId}/revealEstimates`)
      expect(setMock).toHaveBeenCalledWith(revealRef, reveal)
      expect(result).toBe(fakePromise)
    })
  })

  describe('resetRoomEstimates', () => {
    it('does nothing if room has no players', async () => {
      const roomId = 'room-5'
      const playersRef = { path: `rooms/${roomId}/players` }

      ;(refMock as Mock).mockReturnValueOnce(playersRef)
      ;(getMock as Mock).mockResolvedValueOnce({
        exists: () => false,
        val: () => null,
      })

      await resetRoomEstimates(roomId)

      expect(getMock).toHaveBeenCalledWith(playersRef)
      expect(updateMock).not.toHaveBeenCalled()
    })

    it('sets all player estimates to null and revealEstimates to false when players exist', async () => {
      const roomId = 'room-6'
      const playersRef = { path: `rooms/${roomId}/players` }
      const rootRef = { path: 'root' }

      // First dbRef call -> players path, second -> root dbRef(db)
      ;(refMock as Mock)
        .mockReturnValueOnce(playersRef)
        .mockReturnValueOnce(rootRef)

      ;(getMock as Mock).mockResolvedValueOnce({
        exists: () => true,
        val: () => ['user-1', 'user-2', null], // null should be filtered out
      })

      const fakePromise = Promise.resolve()
      ;(updateMock as Mock).mockReturnValueOnce(fakePromise)

      await resetRoomEstimates(roomId)

      const expectedUpdates = {
        'players/user-1/estimate': null,
        'players/user-2/estimate': null,
        [`rooms/${roomId}/revealEstimates`]: false,
      }

      expect(getMock).toHaveBeenCalledWith(playersRef)
      expect(updateMock).toHaveBeenCalledWith(rootRef, expectedUpdates)
    })
  })

  describe('clearRoom', () => {
    it('clears all players from the room', () => {
      const roomId = 'room-7'
      const playersRef = { path: `rooms/${roomId}/players` }

      ;(refMock as Mock).mockReturnValueOnce(playersRef)

      const fakePromise = Promise.resolve()
      ;(setMock as Mock).mockReturnValueOnce(fakePromise)

      const result = clearRoom(roomId)

      expect(refMock).toHaveBeenCalledWith(db, `rooms/${roomId}/players`)
      expect(setMock).toHaveBeenCalledWith(playersRef, null)
      expect(result).toBe(fakePromise)
    })
  })
})
