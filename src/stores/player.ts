import { defineStore } from 'pinia'
import { ref } from 'vue'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export const usePlayerStore = defineStore('player', () => {
  const username = ref('')
  const userId = ref<UUID>(self.crypto.randomUUID())

  const setUsername = (name: string) => {
    username.value = name.trim()
  }

  const setUserId = (newId: UUID) => {
    userId.value = newId
  }

  const setPlayer = (newId: UUID, name: string) => {
    userId.value = newId
    username.value = name.trim()
  }

  return {
    username,
    userId,
    setUsername,
    setUserId,
    setPlayer,
  }
})
