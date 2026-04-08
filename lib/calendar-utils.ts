import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isSameMonth,
  isWeekend,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
} from 'date-fns';
import { CalendarDay, CalendarMonth, DateRange, HOLIDAYS } from './calendar-types';

/**
 * Generate calendar data for a given month
 */
export const generateCalendarMonth = (year: number, month: number): CalendarMonth => {
  const date = new Date(year, month, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const allDays = eachDayOfInterval({ start, end });

  const calendarDays: CalendarDay[] = allDays.map((day) => ({
    date: day,
    dayOfWeek: getDay(day),
    isToday: isToday(day),
    isCurrentMonth: isSameMonth(day, date),
    isWeekend: isWeekend(day),
    isHoliday: isHolidayDate(day),
  }));

  return {
    year,
    month,
    days: calendarDays,
    firstDayOfWeek: getDay(start),
    daysInMonth: allDays.length,
  };
};

/**
 * Check if a date is a holiday
 */
export const isHolidayDate = (date: Date): boolean => {
  const dateString = format(date, 'yyyy-MM-dd');
  return dateString in HOLIDAYS;
};

/**
 * Get the holiday name for a date
 */
export const getHolidayName = (date: Date): string | null => {
  const dateString = format(date, 'yyyy-MM-dd');
  return HOLIDAYS[dateString] || null;
};

/**
 * Check if a date is within a date range (inclusive)
 */
export const isDateInRange = (date: Date, range: DateRange): boolean => {
  if (!range.start || !range.end) return false;

  const start = isBefore(range.start, range.end) ? range.start : range.end;
  const end = isAfter(range.start, range.end) ? range.start : range.end;

  return (
    (isAfter(date, start) || isSameDay(date, start)) &&
    (isBefore(date, end) || isSameDay(date, end))
  );
};

/**
 * Check if a date is the start of a range
 */
export const isRangeStart = (date: Date, range: DateRange): boolean => {
  if (!range.start) return false;
  return isSameDay(date, range.start);
};

/**
 * Check if a date is the end of a range
 */
export const isRangeEnd = (date: Date, range: DateRange): boolean => {
  if (!range.end) return false;
  return isSameDay(date, range.end);
};

/**
 * Get a random hero image URL for a given month
 */
export const getHeroImageUrl = (year: number, month: number): string => {
  // Using Unsplash API with consistent seeding based on year/month
  const seed = year * 12 + month;
  const imageIds = [
    'photo-1506905925346-21bda4d32df4', // mountains
    'photo-1506905925346-21bda4d32df4', // landscape
    'photo-1441974231531-c6227db76b6e', // sunset
    'photo-1469022563149-aa64dbd37dae', // nature
    'photo-1505142468610-359e7d316be0', // ocean
    'photo-1506704720897-c6b0b8ef6dba', // forest
    'photo-1504280390367-361c6d9f38f4', // beach
    'photo-1469854523086-cc02fe5d8800', // aerial
    'photo-1441974231531-c6227db76b6e', // sunrise
    'photo-1506905925346-21bda4d32df4', // landscape
    'photo-1506704720897-c6b0b8ef6dba', // nature
    'photo-1505142468610-359e7d316be0', // ocean
  ];

  const imageId = imageIds[seed % imageIds.length];
  return `https://images.unsplash.com/${imageId}?w=500&h=500&fit=crop&q=80`;
};

/**
 * Save date range to localStorage
 */
export const saveDateRangeToStorage = (range: DateRange): void => {
  try {
    const data = {
      start: range.start ? range.start.toISOString() : null,
      end: range.end ? range.end.toISOString() : null,
    };
    localStorage.setItem('wallcalendar_daterange', JSON.stringify(data));
  } catch {
    // Silently fail in case localStorage is unavailable
    console.error('[WallCalendar] Failed to save date range');
  }
};

/**
 * Load date range from localStorage
 */
export const loadDateRangeFromStorage = (): DateRange => {
  try {
    const data = localStorage.getItem('wallcalendar_daterange');
    if (!data) return { start: null, end: null };

    const parsed = JSON.parse(data);
    return {
      start: parsed.start ? new Date(parsed.start) : null,
      end: parsed.end ? new Date(parsed.end) : null,
    };
  } catch {
    return { start: null, end: null };
  }
};

/**
 * Save notes to localStorage
 */
export const saveNotesToStorage = (notes: any[]): void => {
  try {
    const data = notes.map((note) => ({
      ...note,
      dateRange: {
        start: note.dateRange.start ? note.dateRange.start.toISOString() : null,
        end: note.dateRange.end ? note.dateRange.end.toISOString() : null,
      },
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }));
    localStorage.setItem('wallcalendar_notes', JSON.stringify(data));
  } catch {
    console.error('[WallCalendar] Failed to save notes');
  }
};

/**
 * Load notes from localStorage
 */
export const loadNotesFromStorage = (): any[] => {
  try {
    const data = localStorage.getItem('wallcalendar_notes');
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.map((note: any) => ({
      ...note,
      dateRange: {
        start: note.dateRange.start ? new Date(note.dateRange.start) : null,
        end: note.dateRange.end ? new Date(note.dateRange.end) : null,
      },
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch {
    return [];
  }
};

/**
 * Save current month view to localStorage
 */
export const saveCurrentMonthToStorage = (year: number, month: number): void => {
  try {
    localStorage.setItem('wallcalendar_current_month', JSON.stringify({ year, month }));
  } catch {
    console.error('[WallCalendar] Failed to save current month');
  }
};

/**
 * Load current month from localStorage
 */
export const loadCurrentMonthFromStorage = (): { year: number; month: number } => {
  try {
    const data = localStorage.getItem('wallcalendar_current_month');
    if (!data) {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() };
    }
    return JSON.parse(data);
  } catch {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }
};
