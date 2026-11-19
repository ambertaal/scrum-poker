import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UUID, PlayerRole } from '@/types/player'
import { DEFAULT_ROLE, isPlayerRole } from '@/types/player'

export type { UUID }

export const ROLE_STORAGE_KEY = 'playerRole'

/** Reads the last chosen role from localStorage, defaulting to 'player'. */
export const getStoredRole = (): PlayerRole => {
  const stored = localStorage.getItem(ROLE_STORAGE_KEY)
  return isPlayerRole(stored) ? stored : DEFAULT_ROLE
}

export const usePlayerStore = defineStore('player', () => {
  const storedId = (localStorage.getItem('playerId') ?? null) as UUID | null
  const username = ref('')
  const role = ref<PlayerRole>(getStoredRole())

  // Initialize userId from storage if present, else generate and persist
  const userId = ref<UUID>(
    (storedId ? storedId : (self.crypto.randomUUID() as UUID)) as UUID
  )

  if (!storedId) {
    localStorage.setItem('playerId', userId.value)
  }

  const setUsername = (name: string) => {
    username.value = name.trim()
  }

  const setRole = (newRole: PlayerRole) => {
    role.value = newRole
    localStorage.setItem(ROLE_STORAGE_KEY, newRole)
  }

  const setUserId = (newId: UUID) => {
    userId.value = newId
    localStorage.setItem('playerId', newId)
  }

  const setPlayer = (newId: UUID, name: string) => {
    userId.value = newId
    username.value = name.trim()
    localStorage.setItem('playerId', newId)
    localStorage.setItem('playerUsername', username.value)
  }

  return {
    username,
    userId,
    role,
    setUsername,
    setRole,
    setUserId,
    setPlayer,
  }
})
