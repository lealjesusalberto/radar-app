import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Orbit',
        short_name: 'Orbit',
        description: 'Encuentra personas cerca de ti',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'radar_icon.png',
            sizes: '192x192 512x512 1024x1024 any',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
