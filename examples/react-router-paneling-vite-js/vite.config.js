import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    }
  },
})
