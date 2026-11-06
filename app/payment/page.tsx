import { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentStatus from './payment-status';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Payment',
  description: 'Checking your payment.',
  robots: { index: false },
};

const Page = () => (
  <Suspense>
    <PaymentStatus />
  </Suspense>
);

export default Page;
