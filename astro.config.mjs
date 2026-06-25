// @ts-check
import { defineConfig , fontProviders } from "astro/config";
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: "https://rivetrisk.com.au",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],

  fonts: [
       {
           provider: fontProviders.local(),
           name: 'Atkinson',
           cssVariable: '--font-atkinson',
           fallbacks: ['sans-serif'],
           options: {
               variants: [
                   { src: ['./src/assets/fonts/atkinson-regular.woff'], weight: 400, style: 'normal', display: 'swap' },
                   { src: ['./src/assets/fonts/atkinson-bold.woff'], weight: 700, style: 'normal', display: 'swap' },
               ],
           },
       },
   ],

  adapter: node({
    mode: 'standalone',
  }),
});