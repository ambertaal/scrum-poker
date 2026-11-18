// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Fonts from 'unplugin-fonts/vite'
import AutoImport from 'unplugin-auto-import/vite'
import tailwindcss from '@tailwindcss/vite'

// Utilities
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/scrum-poker/',
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    tailwindcss(),
    Vuetify({
      autoImport: true,
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [400, 500],
            styles: ['normal', 'italic'],
            subset: 'latin',
          },
        ],
      },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'pinia': ['defineStore', 'storeToRefs'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.d.ts', 'src/components/ui/**'],
    },
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
})
