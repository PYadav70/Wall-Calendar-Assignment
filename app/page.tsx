import { WallCalendar } from '@/components/wall-calendar';

export const metadata = {
  title: 'Wall Calendar',
  description: 'A stunning, production-ready wall calendar with date range selection, smart notes, dark mode, and smooth animations.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <WallCalendar />
    </main>
  );
}
