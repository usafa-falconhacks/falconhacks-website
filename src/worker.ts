import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { handle } from "@astrojs/cloudflare/handler";

export function createExports(manifest: SSRManifest) {
  console.log("Creating exports with manifest:", manifest);
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        console.log("Handling request for:", request.url);
        // @ts-ignore 
        return handle(manifest, app, request, env, ctx);
      },
    } satisfies ExportedHandler<AppEnv>,
  };
}

