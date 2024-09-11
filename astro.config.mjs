import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [tailwind(), react()],
  experimental: {
    serverIslands: true,
  },
  vite:
    process.env.DEV_SSL === 'true'
      ? {
          plugins: [basicSsl()],
          server: {
            https: true,
          },
        }
      : {},
})
