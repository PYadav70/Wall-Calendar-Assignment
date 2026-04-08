'use client';

import { format } from 'date-fns';

import { CalendarDay, DateRange } from '@/lib/calendar-types';
import { isDateInRange, isRangeStart, isRangeEnd, getHolidayName } from '@/lib/calendar-utils';
import { cn } from '@/lib/utils';

interface DayCellProps {
  day: CalendarDay;
  dateRange: DateRange;
  onDateClick: (date: Date) => void;
  onDateHover?: (date: Date | null) => void;
  hoverPreview?: Date | null;
}

export const DayCell = ({
  day,
  dateRange,
  onDateClick,
  onDateHover,
  hoverPreview,
}: DayCellProps) => {
  const isInRange = isDateInRange(day.date, dateRange);
  const isStart = isRangeStart(day.date, dateRange);
  const isEnd = isRangeEnd(day.date, dateRange);
  const isHoveredAsEnd = hoverPreview && isDateInRange(day.date, {
    start: dateRange.start,
    end: hoverPreview,
  });

  const holidayName = getHolidayName(day.date);

  return (
    <button
      onClick={() => onDateClick(day.date)}
      onMouseEnter={() => onDateHover?.(day.date)}
      onMouseLeave={() => onDateHover?.(null)}
      aria-label={`${format(day.date, 'EEEE, MMMM d, yyyy')}${holidayName ? ` - ${holidayName}` : ''}`}
      aria-pressed={isStart || isEnd}
      className={cn(
        'relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        day.isCurrentMonth && 'hover:scale-105 active:scale-95',

      
        !day.isCurrentMonth && 'text-muted-foreground/40 bg-transparent cursor-default',

        
        day.isCurrentMonth && [
          'text-foreground cursor-pointer hover:bg-accent/10',
        ],

        
        day.isToday && 'ring-2 ring-primary font-bold shadow-sm',

    
        isInRange && !isStart && !isEnd && 'bg-accent/20 text-foreground',
        isStart && 'bg-primary text-primary-foreground rounded-l-full font-bold shadow-lg',
        isEnd && 'bg-primary text-primary-foreground rounded-r-full font-bold shadow-lg',

        
        isHoveredAsEnd && !isStart && !isEnd && 'bg-accent/35 font-medium',

        
        day.isWeekend && day.isCurrentMonth && !isInRange && 'text-foreground/70',

        
        day.isHoliday && 'relative',
      )}
    >
      <span className="relative z-10">{format(day.date, 'd')}</span>

    
      {day.isToday && !isInRange && (
        <div className="absolute -bottom-1 h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
      )}

      
      {day.isHoliday && !isInRange && (
        <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full shadow-sm" />
      )}
    </button>
  );
};
