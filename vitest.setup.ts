import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()], // Zorgt ervoor dat Vue .vue-bestanden correct verwerkt
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vuetify'], // Zorgt ervoor dat Vuetify correct geladen wordt
    },
    css: false, // Voorkomt CSS-verwerkingsfouten
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
})
