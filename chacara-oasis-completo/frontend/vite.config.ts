import { defineConfig } from 'vite'

export default defineConfig({
  // ... suas outras configurações do Vite
  nitro: {
    preset: 'cloudflare-module'
  }
})