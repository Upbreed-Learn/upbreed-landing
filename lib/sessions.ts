import type { PlanPrice } from './constants';

export type SessionTypeView = {
  id: number;
  instructorId: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: Omit<PlanPrice, 'id'> | null;
  prices: Omit<PlanPrice, 'id'>[];
};

export type SessionInstructor = {
  id: number;
  name: string;
  title: string | null;
  expertise: string | null;
  profilePictureUrl: string | null;
  about: string | null;
  rating: number | null;
  reviews: number;
  /** First open start time (UTC ISO), or null when fully booked / no hours set. */
  nextAvailable: string | null;
  timezone: string;
  sessionTypes: SessionTypeView[];
};

export type MyBooking = {
  id: number;
  status: 'REQUESTED' | 'ACCEPTED' | 'CONFIRMED' | 'COMPLETED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';
  startsAt: string;
  endsAt: string;
  sessionType: { name: string; durationMinutes: number } | null;
  instructor: { id: number; name: string; profilePictureUrl?: string | null } | null;
  note: string | null;
  declineReason: string | null;
  price: { amount: number; currency: string };
  meetingUrl: string | null;
  review: { rating: number; comment: string | null } | null;
};

export const STATUS_TEXT: Record<MyBooking['status'], string> = {
  REQUESTED: 'Waiting for the instructor',
  ACCEPTED: 'Accepted — pay to confirm',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
};

/** "Mon 27 Oct" — a day label in the visitor's own time zone. */
export const dayLabel = (d: Date) => new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
export const timeLabel = (d: Date) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
export const fullDate = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));

export const apiError = (e: any) => {
  const m = e?.response?.data?.message;
  return Array.isArray(m) ? m.join(', ') : m || 'Something went wrong. Please try again.';
};

/** "$600/30 Mins", "₦40,000/Hour" */
export function priceLabel(t: Pick<SessionTypeView, 'price' | 'durationMinutes'> | undefined | null, format: (p: { currency: string; amount: number }) => string) {
  if (!t?.price) return '—';
  const per = t.durationMinutes === 60 ? 'Hour' : t.durationMinutes % 60 === 0 ? `${t.durationMinutes / 60} Hours` : `${t.durationMinutes} Mins`;
  return `${format(t.price)}/${per}`;
}

/** Price for one hour of this type, for sorting. */
export const hourlyRate = (t: Pick<SessionTypeView, 'price' | 'durationMinutes'>) => (t.price ? (Number(t.price.amount) / t.durationMinutes) * 60 : Infinity);

/** True when the next open time is within the next 7 days. */
export const availableSoon = (i: Pick<SessionInstructor, 'nextAvailable'>, days = 7) =>
  Boolean(i.nextAvailable && new Date(i.nextAvailable).getTime() - Date.now() < days * 86_400_000);

/** "26/01/2026" in the visitor's time zone. */
export const shortDate = (iso: string) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));

export const initials = (name?: string | null) =>
  (name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('');
