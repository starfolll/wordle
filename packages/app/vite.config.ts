import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const APP_PORT = Bun.env.APP_PORT!
const APP_HOST = Bun.env.APP_HOST!

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,

  server: {
    port: +APP_PORT,
    host: APP_HOST,
  },

  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
})
