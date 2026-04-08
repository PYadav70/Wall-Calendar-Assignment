'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

import { X, Plus, Edit2, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Note, DateRange } from '@/lib/calendar-types';
import { cn } from '@/lib/utils';

interface NotesPanelProps {
  notes: Note[];
  dateRange: DateRange;
  currentMonth: number;
  currentYear: number;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, text: string) => void;
}

export const NotesPanel = ({
  notes,
  dateRange,
  currentMonth,
  currentYear,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
}: NotesPanelProps) => {
  const [noteText, setNoteText] = useState('');
  const [forEntireMonth, setForEntireMonth] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValidDateRange =
    dateRange.start &&
    dateRange.end &&
    (dateRange.start.getTime() !== dateRange.end.getTime() || forEntireMonth);

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    if (forEntireMonth) {
      onAddNote({
        text: noteText,
        dateRange: { start: null, end: null },
        forEntireMonth: true,
      });
    } else if (hasValidDateRange) {
      onAddNote({
        text: noteText,
        dateRange: {
          start: dateRange.start,
          end: dateRange.end,
        },
        forEntireMonth: false,
      });
    }

    setNoteText('');
    setForEntireMonth(false);
    inputRef.current?.focus();
  };

  const handleUpdateNote = (noteId: string) => {
    if (!editingText.trim()) return;
    onUpdateNote(noteId, editingText);
    setEditingNoteId(null);
    setEditingText('');
  };

  const filteredNotes = notes.filter((note) => {
    if (note.forEntireMonth) {
      return note.dateRange.start === null;
    }
  
    if (note.dateRange.start) {
      return (
        note.dateRange.start.getMonth() === currentMonth &&
        note.dateRange.start.getFullYear() === currentYear
      );
    }
    return false;
  });

  const formatNoteDate = (note: Note) => {
    if (note.forEntireMonth) {
      return 'Entire Month';
    }
    if (note.dateRange.start && note.dateRange.end) {
      if (note.dateRange.start.getTime() === note.dateRange.end.getTime()) {
        return format(note.dateRange.start, 'MMM d');
      }
      return `${format(note.dateRange.start, 'MMM d')} - ${format(
        note.dateRange.end,
        'MMM d'
      )}`;
    }
    return 'No date';
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-border/50">
        <h3 className="text-xl font-bold text-foreground mb-1">Notes</h3>
        <p className="text-xs text-muted-foreground/70">Organize your schedule</p>
      </div>

      {/* Input section */}
      <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="What's on your mind?"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNote();
                }
              }}
              disabled={!hasValidDateRange && !forEntireMonth}
              className={cn(
                'flex-1 text-sm',
                !hasValidDateRange && !forEntireMonth && 'opacity-50 cursor-not-allowed'
              )}
            />
            <Button
              onClick={handleAddNote}
              disabled={!noteText.trim() || (!hasValidDateRange && !forEntireMonth)}
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>

          {/* Date context display */}
          {!forEntireMonth && hasValidDateRange && (
            <div className="flex items-center gap-2 text-xs bg-accent/10 rounded-lg p-3 border border-accent/20 animate-in fade-in duration-300">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <span className="text-foreground/70 font-medium">
                Note for: {formatNoteDate({ forEntireMonth: false, dateRange } as Note)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="entire-month"
              checked={forEntireMonth}
              onChange={(e) => setForEntireMonth(e.target.checked)}
              className="h-4 w-4 rounded cursor-pointer accent-primary"
            />
            <label htmlFor="entire-month" className="text-muted-foreground cursor-pointer font-medium">
              Entire month
            </label>
          </div>

          {!forEntireMonth && !hasValidDateRange && (
            <p className="text-xs text-muted-foreground/60 italic animate-in fade-in duration-300">
              Select dates or check "entire month" to add notes
            </p>
          )}
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredNotes.length === 0 ? (
          <div className="text-sm text-muted-foreground/60 italic py-8 text-center animate-in fade-in duration-500">
            No notes yet. Start planning!
          </div>
        ) : (
          filteredNotes.map((note, index) => (
            <div
              key={note.id}
              className="animate-in fade-in zoom-in-95 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="p-4 bg-gradient-to-br from-secondary/40 to-secondary/20 border border-border/50 hover:border-accent/30 transition-all shadow-sm hover:shadow-md group">
                {editingNoteId === note.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateNote(note.id);
                        }
                      }}
                      className="text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateNote(note.id)}
                      className="px-2 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground mb-2 font-medium">{note.text}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground/70 font-medium">
                        {formatNoteDate(note)}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditingText(note.text);
                          }}
                          className="px-2 h-6 hover:bg-accent/10 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteNote(note.id)}
                          className="px-2 h-6 hover:bg-red-500/10 hover:text-red-500 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
