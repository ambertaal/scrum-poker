import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const username = ref('')

  const setUsername = (name: string) => {
    username.value = name.trim()
  }

  return { username, setUsername }
})
