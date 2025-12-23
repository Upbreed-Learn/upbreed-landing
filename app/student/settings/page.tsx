import { Suspense } from 'react';
import Content from './(content)';
import Hero from './hero';
import { Metadata } from 'next';
import SuspenseLoader from '@/components/suspense-loader';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Settings',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Settings = () => {
  return (
    <>
      <Suspense fallback={<SuspenseLoader />}>
        <Hero />
        <Content />
      </Suspense>
    </>
  );
};

export default Settings;
