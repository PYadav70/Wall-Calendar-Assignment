'use client';


import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from '@/lib/calendar-types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-500">
      <div key={month} className="flex-1 animate-in fade-in slide-in-from-left-4 duration-500">
        <h2 className="text-4xl font-bold text-foreground tracking-tight">
          {MONTH_NAMES[month]}
        </h2>
        <p className="text-sm text-muted-foreground/70 mt-2 font-medium">{year}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="h-10 w-10 hover:bg-accent/10 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          aria-label="Next month"
          className="h-10 w-10 hover:bg-accent/10 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
