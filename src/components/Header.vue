<script setup lang="ts">
  import DarkModeToggle from './DarkModeToggle.vue'

  const toggleMenu = () => {
    alert('Open menu - nog te implementeren')
  }
</script>

<template>
  <header class="app-header">
    <div class="left">
      <router-link class="title" to="/">Planning poker</router-link>
    </div>
    <div class="right">
      <DarkModeToggle />
      <button class="menu-button" @click="toggleMenu">
        ☰
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5vh;
  padding-right: 5vh;
  border-bottom: 1px solid #ddd;
  background-color: var(--header-background, #fff);
}

.left .title {
  font-size: 1.5rem;
  font-weight: bold;
  color: inherit;
  text-decoration: none;
}

.left .title:hover {
  text-decoration: none;
  cursor: pointer;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
