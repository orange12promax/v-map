import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': `${dirname(fileURLToPath(import.meta.url))}/src`
    }
  },
  plugins: [vue(), vueJsx(), cssInjectedByJsPlugin()],
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
