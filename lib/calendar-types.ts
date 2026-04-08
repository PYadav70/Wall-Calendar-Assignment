// Types for WallCalendar component

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  text: string;
  dateRange: DateRange;
  forEntireMonth: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarDay {
  date: Date;
  dayOfWeek: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
  firstDayOfWeek: number;
  daysInMonth: number;
}

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Mock holidays (US federal holidays)
export const HOLIDAYS: Record<string, string> = {
  '2024-01-01': "New Year's Day",
  '2024-07-04': 'Independence Day',
  '2024-12-25': 'Christmas',
  '2025-01-01': "New Year's Day",
  '2025-07-04': 'Independence Day',
  '2025-12-25': 'Christmas',
  '2026-01-01': "New Year's Day",
  '2026-07-04': 'Independence Day',
  '2026-12-25': 'Christmas',
};
