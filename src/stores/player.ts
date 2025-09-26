import { defineStore } from 'pinia'
import { ref } from 'vue'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export const usePlayerStore = defineStore('player', () => {
  const username = ref('')
  const id = ref<UUID>(self.crypto.randomUUID())

  const setUsername = (name: string) => {
    username.value = name.trim()
  }

  const setUserId = (newId: UUID) => {
    id.value = newId
  }

  const setPlayer = (newId: UUID, name: string) => {
    id.value = newId
    username.value = name.trim()
  }

  return {
    username,
    id,
    setUsername,
    setUserId,
    setPlayer,
  }
})
