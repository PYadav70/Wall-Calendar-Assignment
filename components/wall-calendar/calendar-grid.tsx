'use client';

import { CalendarMonth, DateRange, WEEKDAY_NAMES } from '@/lib/calendar-types';
import { DayCell } from './day-cell';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  calendarMonth: CalendarMonth;
  dateRange: DateRange;
  onDateClick: (date: Date) => void;
  onDateHover?: (date: Date | null) => void;
  hoverPreview?: Date | null;
}

export const CalendarGrid = ({
  calendarMonth,
  dateRange,
  onDateClick,
  onDateHover,
  hoverPreview,
}: CalendarGridProps) => {
  // Create grid with padding for days before first day of month
  const gridDays = [];

  // Add empty cells for days before the start of the month
  for (let i = 0; i < calendarMonth.firstDayOfWeek; i++) {
    gridDays.push(null);
  }

  // Add all days of the month
  for (const day of calendarMonth.days) {
    gridDays.push(day);
  }

  return (
    <div
      className="space-y-4 animate-in fade-in duration-500"
      key={`${calendarMonth.year}-${calendarMonth.month}`}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAY_NAMES.map((name) => (
          <div
            key={name}
            className="text-xs font-semibold text-muted-foreground/70 text-center py-3 uppercase tracking-wider"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid with smooth transitions */}
      <div className="grid grid-cols-7 gap-2">
        {gridDays.map((day, index) =>
          day ? (
            <div
              key={`${day.date.getTime()}`}
              className="animate-in fade-in zoom-in-95 duration-300"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <DayCell
                day={day}
                dateRange={dateRange}
                onDateClick={onDateClick}
                onDateHover={onDateHover}
                hoverPreview={hoverPreview}
              />
            </div>
          ) : (
            <div
              key={`empty-${index}`}
              className="aspect-square"
              aria-hidden="true"
            />
          ),
        )}
      </div>
    </div>
  );
};
