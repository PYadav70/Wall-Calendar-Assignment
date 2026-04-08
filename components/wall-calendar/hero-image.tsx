'use client';

import Image from 'next/image';

import { MONTH_NAMES } from '@/lib/calendar-types';
import { getHeroImageUrl } from '@/lib/calendar-utils';

interface HeroImageProps {
  year: number;
  month: number;
}

export const HeroImage = ({ year, month }: HeroImageProps) => {
  const imageUrl = getHeroImageUrl(year, month);
  const monthName = MONTH_NAMES[month];

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-secondary/20 to-accent/10 group animate-in fade-in zoom-in-95 duration-500">
      <Image
        src={imageUrl}
        alt={`${monthName} ${year} calendar`}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

     
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h3 className="text-5xl font-bold mb-1 text-balance">{monthName}</h3>
        <p className="text-xl font-light opacity-90">{year}</p>
      </div>

    
      <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-r from-white/40 to-transparent" />
    </div>
  );
};
