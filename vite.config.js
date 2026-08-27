import path from 'path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
  },
  build: {
    modulePreload: { polyfill: false }
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.ngrok-free.dev']
  }
})
