import type { APIRoute } from "astro";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { format, addDays, isWeekend, isSameDay } from "date-fns";
import { dbClient, schema } from "@/lib/database";
import { eq, inArray } from "drizzle-orm";
import type { CalendarEvent } from "@/lib/database/types";
import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";

export const prerender = false;

interface App {
    Bindings: AppEnv;
}

// --------------------
// Admin middleware
// --------------------

const requireAdmin = createMiddleware(async (c, next) => {
    const raw = getCookie(c, "admin_session");
    if (!raw) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    let adminSessionData: { username: string; sessionId: string } | null = null;
    try {
        adminSessionData = JSON.parse(raw);
    } catch (error) {
        console.log(error)
        return c.json({ error: "Unauthorized" }, 401);
    }

    const db = dbClient(c.env);
    const adminAuthRow = await db
        .select()
        .from(schema.appConfig)
        .where(eq(schema.appConfig.key, "admin_auth"))
        .get();

    if (!adminAuthRow || !adminSessionData) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const storedAuth = JSON.parse(adminAuthRow.value) as {
        username: string;
        sessionId: string;
        csrfToken: string;
    };

    if (
        adminSessionData.username !== storedAuth.username ||
        adminSessionData.sessionId !== storedAuth.sessionId
    ) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const method = c.req.method.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        const cookieToken = getCookie(c, "admin_csrf");
        const headerToken = c.req.header("X-CSRF-Token");
        if (!cookieToken || !headerToken || cookieToken !== headerToken) {
            return c.json({ error: "Forbidden" }, 403);
        }
    }

    return next();
});


// --------------------
// Schemas
// --------------------

const icsRequestSchema = z.object({
    classes: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            location: z.string().optional(),
            periods: z.array(z.number()),
            day: z.enum(["M", "T", "Both"]),
            reminder: z.boolean(),
            isGo: z.boolean(),
            lessonCount: z.number().nullable().optional(),
            goGroup: z.enum(["A", "B", "C", "D", "E", "F", "G", "H", "Z"]),
            isAthletics: z.boolean().optional(),
        })
    ),
    generateMTMarkers: z.boolean().default(false),
});

const adminConfigSchema = z.object({
    firstDay: z.string(),
    holidays: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            date: z.string(),
            eventType: z.literal("holiday"),
        })
    ),
    modifiedSoCs: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            date: z.string(),
            eventType: z.literal("modified_soc"),
        })
    ),
    periods: z.array(
        z.object({
            id: z.number().optional(),
            label: z.string(),
            startTime: z.string(),
            endTime: z.string(),
        })
    ),
});

// --------------------
// Helpers
// --------------------

// Helper function to get UTC offset for Mountain Time on a specific date
const getUTCOffset = (date: Date): number => {
    try {
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Denver",
            timeZoneName: "shortOffset",
        });
        const parts = formatter.formatToParts(date);
        const offset = parts.find((p) => p.type === "timeZoneName")?.value;
        const offsetMatch = offset?.match(/-?\d+/);
        return offsetMatch ? Math.abs(parseInt(offsetMatch[0])) : 7;
    } catch {
        const month = date.getMonth();
        return month >= 2 && month < 10 ? 6 : 7;
    }
};

const formatICSDate = (date: Date, timeStr: string) => {
    return `${format(date, "yyyyMMdd")}${timeStr}`;
};

const getPeriodBoundaries = (
    date: Date,
    selectedPeriods: number[],
    modifiedSocDays: Date[],
    periodsFromDb: { id: number; startTime: string; endTime: string }[]
) => {
    if (selectedPeriods.length === 0) return null;

    const sorted = [...selectedPeriods].sort((a, b) => a - b);
    const earliest = sorted[0];
    const latest = sorted[sorted.length - 1];

    const utcOffset = getUTCOffset(date);
    const isModified = modifiedSocDays.some((d) => isSameDay(d, date));

    const starts: Record<number, [number, number]> = {};
    const ends: Record<number, [number, number]> = {};

    periodsFromDb.forEach((p) => {
        const [sh, sm] = p.startTime.split(":").map((n) => parseInt(n, 10));
        const [eh, em] = p.endTime.split(":").map((n) => parseInt(n, 10));

        let startH = sh;
        let startM = sm;
        let endH = eh;
        let endM = em;

        if (isModified && (p.id === 5 || p.id === 6)) {
            startH = sh - 1;
            endH = eh - 1;
        }

        starts[p.id] = [startH, startM];
        ends[p.id] = [endH, endM];
    });

    const toUTCStr = (h: number, m: number) => {
        let finalHour = h + utcOffset;
        let finalMin = m;
        if (finalMin >= 60) {
            finalHour += Math.floor(finalMin / 60);
            finalMin %= 60;
        }
        return `T${finalHour.toString().padStart(2, "0")}${finalMin
            .toString()
            .padStart(2, "0")}00Z`;
    };

    const startTuple = starts[earliest];
    const endTuple = ends[latest];
    if (!startTuple || !endTuple) return null;

    return {
        start: toUTCStr(...startTuple),
        end: toUTCStr(...endTuple),
    };
};

// Base GO start indices by letter (10-lesson blocks)
const baseGoStartIndices: Record<string, number> = {
    A: 0,
    B: 10,
    C: 20,
    D: 30, // Fall
    E: 0,
    F: 10,
    G: 20,
    H: 30, // Spring
};

const getGoStartIndex = (goGroup: string, isAthletics?: boolean): number => {
    const base = baseGoStartIndices[goGroup] ?? 0;
    if (!isAthletics) return base;
    const offsetBlocks = 1;
    return base + offsetBlocks;
};

// --------------------
// App and routes
// --------------------

export const app = new Hono<App>()
    .basePath("/api")
    .use(
        cors({
            origin: ["http://localhost:3000", "https://calendar.falconnet.us"],
            allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
            allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
            credentials: true,
        })
    )
    .post(
        "/generate-ics",
        zValidator("json", icsRequestSchema),
        async (c) => {
            const { classes, generateMTMarkers } = c.req.valid("json");
            const db = dbClient(c.env);

            try {
                const firstDayConfig = await db
                    .select()
                    .from(schema.appConfig)
                    .where(eq(schema.appConfig.key, "first_day"))
                    .get();

                const FIRST_DAY = firstDayConfig
                    ? new Date(firstDayConfig.value)
                    : new Date(2026, 0, 6);

                const holidayRecords = await db
                    .select()
                    .from(schema.calendarEvents)
                    .where(eq(schema.calendarEvents.eventType, "holiday"))
                    .all();
                const DAYS_OFF = holidayRecords.map((h) => new Date(h.date));

                const modifiedSocRecords = await db
                    .select()
                    .from(schema.calendarEvents)
                    .where(eq(schema.calendarEvents.eventType, "modified_soc"))
                    .all();
                const MODIFIED_SOC_DAYS = modifiedSocRecords.map(
                    (e) => new Date(e.date)
                );

                const periodRecords = await db.select().from(schema.periods).all();
                const PERIODS = periodRecords.map((p) => ({
                    id: p.id,
                    startTime: p.startTime,
                    endTime: p.endTime,
                }));

                const mdays: Date[] = [];
                const tdays: Date[] = [];
                let currentDay = FIRST_DAY;
                let currentDayType: "M" | "T" = "M";

                while (mdays.length < 40 || tdays.length < 40) {
                    const isHoliday = DAYS_OFF.some((d) => isSameDay(d, currentDay));
                    if (!isWeekend(currentDay) && !isHoliday) {
                        if (currentDayType === "M") {
                            mdays.push(new Date(currentDay));
                            currentDayType = "T";
                        } else {
                            tdays.push(new Date(currentDay));
                            currentDayType = "M";
                        }
                    }
                    currentDay = addDays(currentDay, 1);
                }

                let icsLines: string[] = [
                    "BEGIN:VCALENDAR",
                    "VERSION:2.0",
                    "PRODID:-//USAFA Schedule Gen//EN",
                    "CALSCALE:GREGORIAN",
                    "METHOD:PUBLISH",
                    "",
                ];

                if (generateMTMarkers) {
                    [...mdays, ...tdays].forEach((day, i) => {
                        const type = i < 40 ? "M" : "T";
                        const num = (i % 40) + 1;
                        icsLines.push("BEGIN:VEVENT");
                        icsLines.push(`SUMMARY:${type}${num}`);
                        icsLines.push(
                            `DTSTART;VALUE=DATE:${format(day, "yyyyMMdd")}`
                        );
                        icsLines.push(
                            `DTEND;VALUE=DATE:${format(addDays(day, 1), "yyyyMMdd")}`
                        );
                        icsLines.push("TRANSP:TRANSPARENT");
                        icsLines.push("X-MICROSOFT-CDO-BUSYSTATUS:FREE");
                        icsLines.push("X-MICROSOFT-CDO-ALLDAYEVENT:TRUE");
                        icsLines.push("END:VEVENT", "");
                    });
                }

                classes.forEach((cls) => {
                    let relevantDays: Date[] = [];
                    const count = cls.lessonCount ?? 10;

                    if (!cls.isGo) {
                        if (cls.day === "Both") {
                            relevantDays = [...mdays, ...tdays];
                        } else {
                            relevantDays = cls.day === "M" ? mdays : tdays;
                        }
                    } else {
                        const startIndex = getGoStartIndex(
                            cls.goGroup,
                            cls.isAthletics
                        );
                        if (cls.day === "Both") {
                            relevantDays = [
                                ...mdays.slice(startIndex, startIndex + count),
                                ...tdays.slice(startIndex, startIndex + count),
                            ];
                        } else {
                            const cycleDays = cls.day === "M" ? mdays : tdays;
                            relevantDays = cycleDays.slice(startIndex, startIndex + count);
                        }
                    }

                    relevantDays.forEach((day) => {
                        const boundaries = getPeriodBoundaries(
                            day,
                            cls.periods,
                            MODIFIED_SOC_DAYS,
                            PERIODS
                        );
                        if (!boundaries) return;

                        icsLines.push("BEGIN:VEVENT");
                        icsLines.push(`SUMMARY:${cls.name}`);
                        if (cls.location) icsLines.push(`LOCATION:${cls.location}`);
                        icsLines.push(
                            `DTSTART:${formatICSDate(day, boundaries.start)}`
                        );
                        icsLines.push(
                            `DTEND:${formatICSDate(day, boundaries.end)}`
                        );

                        if (cls.reminder) {
                            icsLines.push(
                                "BEGIN:VALARM",
                                "ACTION:DISPLAY",
                                `DESCRIPTION:Reminder: ${cls.name}`,
                                "TRIGGER:-PT15M",
                                "END:VALARM"
                            );
                        }
                        icsLines.push("END:VEVENT", "");
                    });
                });

                icsLines.push("END:VCALENDAR");
                const icsContent = icsLines.join("\n");

                return c.body(icsContent, 200, {
                    "Content-Type": "text/calendar;charset=utf-8",
                    "Content-Disposition":
                        'attachment; filename="usafa_schedule.ics"',
                });
            } catch (error) {
                console.error("Error generating ICS:", error);
                return c.json(
                    { error: "Failed to generate ICS file" },
                    500
                );
            }
        }
    )
    .get("/holidays", async (c) => {
        const db = dbClient(c.env);
        try {
            const holidays = await db
                .select()
                .from(schema.calendarEvents)
                .where(eq(schema.calendarEvents.eventType, "holiday"))
                .all();

            return c.json({
                holidays: holidays.map((h) => ({
                    id: h.id,
                    date: new Date(h.date).toISOString(),
                    name: h.name,
                })),
            });
        } catch (error) {
            console.error("Error fetching holidays:", error);
            return c.json({ error: "Failed to fetch holidays" }, 500);
        }
    })
    .get("/modified-soc", async (c) => {
        const db = dbClient(c.env);
        try {
            const events = await db
                .select()
                .from(schema.calendarEvents)
                .where(eq(schema.calendarEvents.eventType, "modified_soc"))
                .all();

            return c.json({
                modifiedSoCs: events.map((e) => ({
                    id: e.id,
                    date: new Date(e.date).toISOString(),
                    name: e.name,
                })),
            });
        } catch (error) {
            console.error("Error fetching modified SoC events:", error);
            return c.json(
                { error: "Failed to fetch modified SoC events" },
                500
            );
        }
    })
    .get("/periods", async (c) => {
        const db = dbClient(c.env);
        try {
            const periods = await db.select().from(schema.periods).all();
            return c.json({ periods });
        } catch (error) {
            console.error("Error fetching periods:", error);
            return c.json({ error: "Failed to fetch periods" }, 500);
        }
    })
    .get("/config", async (c) => {
        const db = dbClient(c.env);
        try {
            const config = await db.select().from(schema.appConfig).all();

            const configObject = config.reduce((acc, item) => {
                try {
                    acc[item.key] =
                        item.key === "generate_mt_days"
                            ? JSON.parse(item.value)
                            : item.value;
                } catch {
                    acc[item.key] = item.value;
                }
                return acc;
            }, {} as Record<string, any>);

            return c.json({ config: configObject });
        } catch (error) {
            console.error("Error fetching config:", error);
            return c.json({ error: "Failed to fetch config" }, 500);
        }
    })
    .post("/admin-logout", requireAdmin, async (c) => {
        const db = dbClient(c.env);
        await db
            .update(schema.appConfig)
            .set({ value: "" })
            .where(eq(schema.appConfig.key, "admin_auth"));

        const isProd = c.env.NODE_ENV === "production";

        setCookie(c, "admin_session", "", {
            httpOnly: true,
            secure: isProd,
            sameSite: "None",
            path: "/api",
            maxAge: 0,
        });

        setCookie(c, "admin_csrf", "", {
            httpOnly: false,
            secure: isProd,
            sameSite: "None",
            path: "/",
            maxAge: 0,
        });

        return c.json({ success: true });
    })
    .post(
        "/admin-config",
        zValidator("json", adminConfigSchema),
        requireAdmin,
        async (c) => {
            const body = c.req.valid("json");
            const db = dbClient(c.env);

            try {
                await db
                    .insert(schema.appConfig)
                    .values({
                        key: "first_day",
                        value: body.firstDay,
                    })
                    .onConflictDoUpdate({
                        target: schema.appConfig.key,
                        set: { value: body.firstDay },
                    });

                const allEvents = [
                    ...body.holidays.map((h) => ({
                        ...h,
                        eventType: "holiday" as const,
                    })),
                    ...body.modifiedSoCs.map((e) => ({
                        ...e,
                        eventType: "modified_soc" as const,
                    })),
                ];

                await db
                    .delete(schema.calendarEvents)
                    .where(
                        inArray(schema.calendarEvents.eventType, [
                            "holiday",
                            "modified_soc",
                        ])
                    );

                if (allEvents.length > 0) {
                    await db
                        .insert(schema.calendarEvents)
                        .values(
                            allEvents.map((event) => ({
                                name: event.name,
                                date: new Date(event.date),
                                eventType: event.eventType,
                            }))
                        );
                }

                await db.delete(schema.periods).run();
                if (body.periods.length > 0) {
                    await db
                        .insert(schema.periods)
                        .values(
                            body.periods.map((p) => ({
                                label: p.label,
                                startTime: p.startTime,
                                endTime: p.endTime,
                            }))
                        );
                }

                return c.json({ success: true });
            } catch (error) {
                console.error("Error saving admin config:", error);
                return c.json(
                    { error: "Failed to save admin config" },
                    500
                );
            }
        }
    )
    .post("/verify-admin-credentials", async (c) => {
        const { username, password } = await c.req.json();
        const db = dbClient(c.env);

        if (!username || !password) {
            return c.json({ valid: false }, 400);
        }
        if (
            c.env.USAFA_CALENDAR_USERNAME !== username ||
            c.env.USAFA_CALENDAR_PASSWORD !== password
        ) {
            return c.json({ valid: false }, 401);
        }

        const sessionId = crypto.randomUUID();
        const csrfToken = crypto.randomUUID();

        const adminAuth = {
            username,
            sessionId,
            csrfToken,
        };

        await db
            .insert(schema.appConfig)
            .values({
                key: "admin_auth",
                value: JSON.stringify(adminAuth),
            })
            .onConflictDoUpdate({
                target: schema.appConfig.key,
                set: { value: JSON.stringify(adminAuth) },
            });

        const isProd = c.env.NODE_ENV === "production";

        setCookie(c, "admin_session", JSON.stringify({
            username,
            sessionId,
        }), {
            httpOnly: true,
            secure: isProd,
            sameSite: "None",
            path: "/api",
            maxAge: 30 * 24 * 60 * 60,
        });

        setCookie(c, "admin_csrf", csrfToken, {
            httpOnly: false,
            secure: isProd,
            sameSite: "None",
            path: "/", // so SPA can read it
            maxAge: 30 * 24 * 60 * 60,
        });

        return c.json({ valid: true, sessionId, csrfToken });
    })
    .post("/validate-admin-session", async (c) => {
        const raw = getCookie(c, "admin_session");
        if (!raw) {
            return c.json({ valid: false }, 401);
        }
        let adminSessionData: { username: string; sessionId: string } | null = null;
        try {
            adminSessionData = JSON.parse(raw);
        } catch {
            return c.json({ valid: false }, 401);
        }
        const db = dbClient(c.env);
        const adminAuthRow = await db

            .select()
            .from(schema.appConfig)
            .where(eq(schema.appConfig.key, "admin_auth"))
            .get();
        if (!adminAuthRow || !adminSessionData) {
            return c.json({ valid: false }, 401);
        }
        const storedAuth = JSON.parse(adminAuthRow.value) as {
            username: string;
            sessionId: string;
            csrfToken: string;
        };
        if (

            adminSessionData.username !== storedAuth.username ||
            adminSessionData.sessionId !== storedAuth.sessionId
        ) {
            return c.json({ valid: false }, 401);
        }


        return c.json({ valid: true });
    })


// seed-db and init-db keep existing behavior
app.get("/seed-db", async (c) => {
    if (c.env.NODE_ENV !== "development") {
        return c.json(
            { error: "Database seeding is only allowed in development mode" },
            403
        );
    }
    const db = dbClient(c.env);

    const FIRST_DAY = new Date(2026, 0, 6);

    const HOLIDAYS: CalendarEvent[] = [
        { date: new Date(2026, 0, 1), name: "New Year's Day" },
        { date: new Date(2026, 0, 19), name: "Martin Luther King Jr Day" },
        { date: new Date(2026, 1, 16), name: "Presidents' Day" },
        { date: new Date(2026, 2, 23), name: "Spring Break" },
        { date: new Date(2026, 2, 24), name: "Spring Break" },
        { date: new Date(2026, 2, 25), name: "Spring Break" },
        { date: new Date(2026, 2, 26), name: "Spring Break" },
        { date: new Date(2026, 2, 27), name: "Spring Break" },
        { date: new Date(2026, 3, 16), name: "Crucible (No Classes)" },
        { date: new Date(2026, 3, 17), name: "Crucible (No Classes)" },
        { date: new Date(2026, 4, 25), name: "Memorial Day" },
    ];

    const MODIFIED_SOC_EVENTS: CalendarEvent[] = [
        { date: new Date(2026, 0, 23), name: "Modified SoC (Jan 23)" },
        { date: new Date(2026, 1, 6), name: "Modified SoC (Feb 6)" },
        { date: new Date(2026, 1, 27), name: "Modified SoC (Feb 27)" },
        { date: new Date(2026, 2, 13), name: "Modified SoC (Mar 13)" },
        { date: new Date(2026, 3, 3), name: "Modified SoC (Apr 3)" },
        { date: new Date(2026, 3, 15), name: "Modified SoC (Apr 15 - Crucible Begins)" },
        { date: new Date(2026, 4, 1), name: "Modified SoC (May 1)" },
    ];

    const PERIODS = [
        { label: "1", startTime: "07:30", endTime: "08:23" },
        { label: "2", startTime: "08:30", endTime: "09:23" },
        { label: "3", startTime: "09:30", endTime: "10:23" },
        { label: "4", startTime: "10:30", endTime: "11:23" },
        { label: "5", startTime: "13:30", endTime: "14:23" },
        { label: "6", startTime: "14:30", endTime: "15:23" },
    ];

    await db.insert(schema.appConfig).values([
        { key: "first_day", value: FIRST_DAY.toISOString() },
        { key: "generate_mt_days", value: JSON.stringify(true) },
    ]);
    // @ts-expect-error
    await db.insert(schema.calendarEvents).values([
        ...HOLIDAYS.map((h) => ({ ...h, eventType: "holiday" })),
    ]);
    // @ts-expect-error
    await db.insert(schema.calendarEvents).values([
        ...MODIFIED_SOC_EVENTS.map((e) => ({ ...e, eventType: "modified_soc" })),
    ]);
    await db.insert(schema.periods).values([...PERIODS]);

    return c.json({ message: "Database initialized successfully" });
});

app.get("/init-db", async (c) => {
    if (c.env.NODE_ENV !== "development") {
        return c.json(
            {
                error:
                    "Database initialization is only allowed in development mode",
            },
            403
        );
    }
    await c.env.DB.prepare("SELECT 1").run();
    return c.json({ message: "Database connection successful" });
});

export const ALL: APIRoute = (context) => {
    return app.fetch(context.request, context.locals.runtime.env);
};