<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { db } from '@/firebase'
  import { ref as dbRef, onValue, set } from 'firebase/database'

  const route = useRoute()
  const roomId = (route.params as { roomId: string }).roomId
  const username = route.query.user as string

  const players = ref<{ name: string; vote: string | null }[]>([])
  const roomName = ref('')

  onMounted(() => {
    // Haal de spelers op uit de kamer
    const playersRef = dbRef(db, `rooms/${roomId}/players`)
    onValue(playersRef, snapshot => {
      const data = snapshot.val()
      players.value = data ? Object.values(data) : []
    })

    // Haal de kamernaam op
    const roomNameRef = dbRef(db, `rooms/${roomId}/name`)
    onValue(roomNameRef, snapshot => {
      roomName.value = snapshot.val()
    })
  })

  const voteOptions = ['?','☕','0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100']

  const castVote = async (vote: string) => {
    console.log(vote)
    const voteRef = dbRef(db, `rooms/${roomId}/players/${username}/vote`)
    await set(voteRef, vote)
  }
</script>

<template>
  <div class="room">
    <h1>{{ roomName }}</h1>
    <p>Welkom, {{ username }}</p>

    <div class="vote-buttons">
      <button v-for="option in voteOptions" :key="option" @click="castVote(option)">
        {{ option }}
      </button>
    </div>

    <h2>Names:</h2>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        {{ player.name }} — storypoints: {{ player.vote ?? '⏳' }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.room {
  max-width: 600px;
  margin: 2rem auto;
  font-family: sans-serif;
}

button {
  margin: 2px;
  padding: 0.5rem;
  font-weight: bold;
  color: white;
  background-color:cadetblue;
}
</style>
