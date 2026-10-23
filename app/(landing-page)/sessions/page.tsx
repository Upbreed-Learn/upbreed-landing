import { Metadata } from 'next';
import { Suspense } from 'react';
import BookSession from './book-session';

export const metadata: Metadata = {
  title: 'Upbreed Learn | 1-on-1 Sessions',
  description: 'Book a private 1-on-1 video session with an Upbreed Learn industry expert.',
};

const SessionsPage = () => (
  <Suspense>
    <BookSession />
  </Suspense>
);

export default SessionsPage;
