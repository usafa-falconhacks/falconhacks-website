import { drizzle } from "drizzle-orm/d1";
export * as schema from "./schemas";


export const dbClient = (env: Env) => {
    return drizzle(env.DB);
}