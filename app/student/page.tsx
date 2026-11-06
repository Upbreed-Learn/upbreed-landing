import { Metadata } from 'next';
import ChooseYourPlan from '../(landing-page)/pricing/pricing';
import Hero from './(welcome)/hero';
import WhatToExpect from './(welcome)/what-to-expect';
import { Suspense } from 'react';
import Faqs from '@/components/faqs';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Student Dashboard',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Welcome = () => {
  return (
    <>
      <Suspense>
        <Hero />
      </Suspense>
      <WhatToExpect />
      <Suspense>
        <ChooseYourPlan skipHref="/student/home" />
      </Suspense>
      <Faqs />
    </>
  );
};

export default Welcome;
