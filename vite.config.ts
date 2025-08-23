import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: parseInt(env.PORT || '5173'),
      host: true
    },
    preview: {
      port: parseInt(env.PORT || '5173'),
      host: true,
      allowedHosts: [
        "*"
      ]
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
