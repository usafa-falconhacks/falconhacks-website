// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: "wrangler.jsonc",
      persist: {
        path: ".wrangler/state/v3",
      },
    },
    imageService: "compile",
    workerEntryPoint: {
      path: "src/worker.ts",
    },
  }),

  server: {
    port: 3000,
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },
});
