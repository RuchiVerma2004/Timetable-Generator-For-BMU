import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // ensure JSX is transformed in .js/.jsx files under src
      include: ['src/**/*.{js,jsx,ts,tsx}']
    }),
    tailwindcss(),
  ],
})
