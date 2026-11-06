import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrettyDate(iso: string): string {
  const date = new Date(iso);

  const day = date.getUTCDate();
  const month = date
    .toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
    .toUpperCase();
  const year = date.getUTCFullYear();

  const getOrdinal = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 13) return `${n}TH`;
    if (mod10 === 1) return `${n}ST`;
    if (mod10 === 2) return `${n}ND`;
    if (mod10 === 3) return `${n}RD`;
    return `${n}TH`;
  };

  return `${getOrdinal(day)} ${month}, ${year}`;

  // 10TH JUNE, 2024
}

export const handleShareToTwitter = () => {
  const text = encodeURIComponent('Check out this amazing page!');
  const url = encodeURIComponent(window.location.href);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterUrl, '_blank', 'noopener,noreferrer');
};

export const handleShareToFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

  window.open(facebookUrl, '_blank', 'noopener,noreferrer');
};

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const h = hours > 0 ? `${hours}h` : '';
  const m = minutes > 0 ? `${minutes}m` : '';

  return `${h} ${m}`.trim();
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hourLabel = hours === 1 ? 'Hour' : 'Hours';
  const minuteLabel = minutes === 1 ? 'Min' : 'Mins';

  if (hours > 0 && minutes > 0) {
    return `${hours} ${hourLabel} ${minutes} ${minuteLabel}`;
  }
  if (hours > 0) {
    return `${hours} ${hourLabel}`;
  }
  return `${minutes} ${minuteLabel}`;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** 5520 → "1 Hour 32 Mins"; 45 → "45 Secs". Uses the exact total, not a rounded one. */
export function formatLength(totalSeconds = 0): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (!h && !m) return plural(s % 60, 'Sec');
  return [h && plural(h, 'Hour'), m && plural(m, 'Min')].filter(Boolean).join(' ');
}

/** 5525 → "1:32:05"; 225 → "3:45". */
export function formatClock(totalSeconds = 0): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
}

/** Always H:MM:SS, e.g. 78 → "0:01:18", 5525 → "1:32:05". */
export function formatHMS(totalSeconds = 0): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** Exact length of a course in seconds (older API responses only had minutes). */
export const courseSeconds = (c?: { preview?: { durationInSeconds?: number; durationInMinutes?: number } }) =>
  c?.preview?.durationInSeconds ?? (c?.preview?.durationInMinutes ?? 0) * 60;

/** Image for a course card: the trailer's thumbnail when there is one. */
export const courseCover = (c?: { coverUrl?: string | null; thumbnail?: string | null }) => c?.coverUrl || c?.thumbnail || '';
