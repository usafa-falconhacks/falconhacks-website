import type { APIRoute } from "astro";
import { Hono } from "hono";

export const prerender = false;

interface App {
  Bindings: AppEnv;
}




export const app = new Hono<App>()
  .basePath("/api")

// If we need a database

// app.get("/init-db", async (c) => {
//   if (c.env.NODE_ENV !== "development") {
//     return c.json(
//       {
//         error:
//           "Database initialization is only allowed in development mode",
//       },
//       403
//     );
//   }
//   await c.env.DB.prepare("SELECT 1").run();
//   return c.json({ message: "Database connection successful" });
// });

export const ALL: APIRoute = (context) => {
  return app.fetch(context.request, context.locals.runtime.env);
};
