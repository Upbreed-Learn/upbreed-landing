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
  rating: number | null;
  reviews: number;
  sessionTypes: SessionTypeView[];
};

export type MyBooking = {
  id: number;
  status: 'REQUESTED' | 'ACCEPTED' | 'CONFIRMED' | 'COMPLETED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';
  startsAt: string;
  endsAt: string;
  sessionType: { name: string; durationMinutes: number } | null;
  instructor: { id: number; name: string } | null;
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
