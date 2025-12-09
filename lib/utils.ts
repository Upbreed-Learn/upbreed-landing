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
