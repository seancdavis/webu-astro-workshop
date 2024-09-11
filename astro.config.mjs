import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import storyblok from '@storyblok/astro'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'astro/config'
import dotEnv from 'dotenv'

dotEnv.config()

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [
    tailwind(),
    react(),
    storyblok({
      accessToken: process.env.STORYBLOK_TOKEN,
      apiOptions: { region: 'us' },
      components: {
        page: 'storyblok/Page',
        feature: 'storyblok/Feature',
        grid: 'storyblok/Grid',
        teaser: 'storyblok/Teaser',
      },
    }),
  ],
  experimental: {
    serverIslands: true,
  },
  vite:
    process.env.USE_SSL === 'true'
      ? {
          plugins: [basicSsl()],
          server: {
            https: true,
          },
        }
      : {},
})
