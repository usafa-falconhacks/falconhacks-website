import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const calendarEvents = sqliteTable('calendar_events', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: integer('date', { mode: 'timestamp' }).notNull(), // Store as Unix timestamp
    name: text('name').notNull(),
    eventType: text('event_type', { enum: ['holiday', 'modified_soc', 'other'] }).notNull().default('other'),
});

// App configuration table
export const appConfig = sqliteTable('app_config', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull().unique(),
    value: text('value').notNull(), // Store as JSON string for complex values
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Periods table (reference data)
export const periods = sqliteTable('periods', {
    id: integer('id').primaryKey(),
    label: text('label').notNull(),
    startTime: text('start_time').notNull(), // Format: "HH:MM"
    endTime: text('end_time').notNull(), // Format: "HH:MM"
    modifiedStartTime: text('modified_start_time'), // For Modified SoC days
    modifiedEndTime: text('modified_end_time'), // For Modified SoC days
});

