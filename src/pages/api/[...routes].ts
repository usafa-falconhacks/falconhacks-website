import type { APIRoute } from "astro";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../lib/database/schemas";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const prerender = false;

interface App {
  Bindings: AppEnv;
}

export const app = new Hono<App>()
  .basePath("/api")

// .post(
//   "/register",
//   zValidator(
//     "json",
//     z.object({
//       name: z.string().min(2),
//       email: z.string().email(),
//       school: z.string().optional(),
//       dietaryRestrictions: z.string().optional(),
//     }),
//   ),
//   async (c) => {
//     const db = drizzle(c.env.DB, { schema });
//     const body = c.req.valid("json");

//     try {
//       await db.insert(schema.registrations).values({
//         name: body.name,
//         email: body.email,
//         school: body.school,
//         dietaryRestrictions: body.dietaryRestrictions,
//       });

//       return c.json({ message: "Registration successful" }, 201);
//     } catch (error: any) {
//       if (error.message?.includes("UNIQUE constraint failed")) {
//         return c.json({ error: "Email already registered" }, 400);
//       }
//       return c.json({ error: "Internal server error" }, 500);
//     }
//   },
// );

export const ALL: APIRoute = (context) => {
  return app.fetch(context.request, context.locals.runtime.env);
};
