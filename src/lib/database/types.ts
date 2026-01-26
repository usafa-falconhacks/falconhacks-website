
export enum DayType {
    M = 'M',
    T = 'T',
    Both = 'Both'
}

export enum GOGroup {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H',
    Z = 'Z' // Full semester
}

export interface USAFAClass {
    id: string;
    name: string;
    location?: string;
    periods: number[];
    day: DayType;
    reminder: boolean;
    isGo: boolean;
    lessonCount?: number;
    goGroup: GOGroup;
    isAthletics?: boolean
}

export interface CalendarEvent {
    date: Date;
    name: string;
}

export interface AppConfig {
    generateMTDays: boolean;
    semesterName: string;
}

