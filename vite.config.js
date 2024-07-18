import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': `${dirname(fileURLToPath(import.meta.url))}/src`
    }
  },
  plugins: [vue(), vueJsx()],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './src/lib.js',
      name: 'v-map',
      fileName: (format) => `v-map.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
