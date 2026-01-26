import { hc } from 'hono/client';
import { app } from "@/lib/api/referenceBackend"; // Path to your server's exported type

export const apiClient = hc<typeof app>("https://calendar.usafa.workers.dev", {
    init: {
        credentials: 'include',
    }
});
