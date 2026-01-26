
import type { CalendarEvent } from '@/lib/database/types';

export const FIRST_DAY = new Date(2026, 0, 6);

// Holidays / No Class Days from the provided Spring 2026 PDF
export const HOLIDAYS: CalendarEvent[] = [
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

export const DAYS_OFF = HOLIDAYS.map(h => h.date);

// "Modified SoC - Afternoon Sections Start 1 Hour Early" dates from the PDF
export const MODIFIED_SOC_EVENTS: CalendarEvent[] = [
    { date: new Date(2026, 0, 23), name: "Modified SoC (Jan 23)" },
    { date: new Date(2026, 1, 6), name: "Modified SoC (Feb 6)" },
    { date: new Date(2026, 1, 27), name: "Modified SoC (Feb 27)" },
    { date: new Date(2026, 2, 13), name: "Modified SoC (Mar 13)" },
    { date: new Date(2026, 3, 3), name: "Modified SoC (Apr 3)" },
    { date: new Date(2026, 3, 15), name: "Modified SoC (Apr 15 - Crucible Begins)" },
    { date: new Date(2026, 4, 1), name: "Modified SoC (May 1)" },
];

export const MODIFIED_SOC_DAYS = MODIFIED_SOC_EVENTS.map(e => e.date);

export const DST_BEGIN_2026 = new Date(2026, 2, 8);

export const PERIODS = [
    { id: 1, label: '1', start: '07:30', end: '08:23' },
    { id: 2, label: '2', start: '08:30', end: '09:23' },
    { id: 3, label: '3', start: '09:30', end: '10:23' },
    { id: 4, label: '4', start: '10:30', end: '11:23' },
    { id: 5, label: '5', start: '13:30', end: '14:23' }, // Note: Shifts to 12:30 on Modified SoC
    { id: 6, label: '6', start: '14:30', end: '15:23' }, // Note: Shifts to 13:30 on Modified SoC
];
