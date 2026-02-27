import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UUID } from '@/types/player'

export type { UUID }

export const usePlayerStore = defineStore('player', () => {
  const storedId = (localStorage.getItem('playerId') ?? null) as UUID | null
  const username = ref('')

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
    setUsername,
    setUserId,
    setPlayer,
  }
})
