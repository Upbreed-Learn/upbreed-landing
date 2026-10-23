import { Metadata } from 'next';
import { Suspense } from 'react';
import MySessions from './my-sessions';

export const metadata: Metadata = {
  title: 'Upbreed Learn | My 1-on-1 Sessions',
  description: 'Your 1-on-1 session requests and bookings.',
};

const Page = () => (
  <Suspense>
    <MySessions />
  </Suspense>
);

export default Page;
