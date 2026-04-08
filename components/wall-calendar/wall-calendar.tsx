'use client';

import { useState, useEffect, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { DateRange, Note } from '@/lib/calendar-types';
import {
  generateCalendarMonth,
  saveDateRangeToStorage,
  loadDateRangeFromStorage,
  saveNotesToStorage,
  loadNotesFromStorage,
  saveCurrentMonthToStorage,
  loadCurrentMonthFromStorage,
  isDateInRange,
} from '@/lib/calendar-utils';
import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';
import { HeroImage } from './hero-image';
import { NotesPanel } from './notes-panel';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

interface WallCalendarProps {
  className?: string;
}

export const WallCalendar = ({ className }: WallCalendarProps) => {
  // State
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>([]);
  const [hoverPreview, setHoverPreview] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const { year, month } = loadCurrentMonthFromStorage();
    setCurrentDate(new Date(year, month, 1));

    const loadedDateRange = loadDateRangeFromStorage();
    setDateRange(loadedDateRange);

    const loadedNotes = loadNotesFromStorage();
    setNotes(loadedNotes);

    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    saveDateRangeToStorage(dateRange);
  }, [dateRange, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveNotesToStorage(notes);
  }, [notes, isInitialized]);

  useEffect(() => {
    if (!isInitialized || !currentDate) return;
    saveCurrentMonthToStorage(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate, isInitialized]);

  // Calculate calendar data
  const calendarMonth = currentDate
    ? generateCalendarMonth(currentDate.getFullYear(), currentDate.getMonth())
    : null;

  // Handle month navigation
  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((prev) => (prev ? subMonths(prev, 1) : null));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => (prev ? addMonths(prev, 1) : null));
  }, []);

  // Handle date selection
  const handleDateClick = useCallback((date: Date) => {
    setDateRange((prev) => {
      // If no start date, set it
      if (!prev.start) {
        return { start: date, end: null };
      }

      // If start date exists but no end date
      if (prev.start && !prev.end) {
        // If clicked date is same as start, reset
        if (date.getTime() === prev.start.getTime()) {
          return { start: null, end: null };
        }

        // If clicked date is before start, reset and set as new start
        if (date.getTime() < prev.start.getTime()) {
          return { start: date, end: null };
        }

        // Otherwise set as end date
        return { start: prev.start, end: date };
      }

      // If both dates exist, reset and start new selection
      return { start: date, end: null };
    });

    // Clear hover preview
    setHoverPreview(null);
  }, []);

  // Handle hover preview for range selection
  const handleDateHover = useCallback((date: Date | null) => {
    if (!date || !dateRange.start || dateRange.end) {
      setHoverPreview(null);
      return;
    }

    // Show preview of range from start date to hovered date
    if (date.getTime() >= dateRange.start.getTime()) {
      setHoverPreview(date);
    }
  }, [dateRange]);

  // Handle add note
  const handleAddNote = useCallback(
    (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newNote: Note = {
        ...noteData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes((prev) => [newNote, ...prev]);
    },
    []
  );

  // Handle delete note
  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  // Handle update note
  const handleUpdateNote = useCallback((noteId: string, text: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, text, updatedAt: new Date() }
          : note
      )
    );
  }, []);

  if (!isInitialized || !currentDate || !calendarMonth) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-12 bg-secondary rounded mb-6" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square bg-secondary rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full min-h-screen flex flex-col gap-6 p-4 md:p-8 lg:p-12 animate-in fade-in duration-500',
        className
      )}
    >
      {/* Top bar with theme toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground/60 font-medium animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
          Calendar Planner
        </div>
        <ThemeToggle />
      </div>

      {/* Main layout - responsive grid with better spacing */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-6 auto-rows-max lg:auto-rows-min animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {/* Hero image section - 2 columns on tablet/desktop */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 animate-in fade-in zoom-in-95 duration-500 delay-200">
          <HeroImage year={currentDate.getFullYear()} month={currentDate.getMonth()} />
        </div>

        {/* Calendar section - 3 columns on tablet, 2 on desktop */}
        <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
          <CalendarHeader
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 hover:border-accent/20 transition-all hover:shadow-xl">
            <CalendarGrid
              calendarMonth={calendarMonth}
              dateRange={dateRange}
              onDateClick={handleDateClick}
              onDateHover={handleDateHover}
              hoverPreview={hoverPreview}
            />
          </div>
        </div>

        {/* Notes panel section - full width on mobile, side column on desktop */}
        <div className="col-span-1 md:col-span-5 lg:col-span-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 hover:border-accent/20 transition-all hover:shadow-xl flex-1 flex flex-col min-h-96">
            <NotesPanel
              notes={notes}
              dateRange={dateRange}
              currentMonth={currentDate.getMonth()}
              currentYear={currentDate.getFullYear()}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
