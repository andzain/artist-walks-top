// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://artist-walks.top",

  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});
