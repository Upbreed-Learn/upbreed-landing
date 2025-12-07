import Faqs from '@/components/faqs';
import ChooseYourPlan from './pricing';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Pricing',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Pricing = () => {
  return (
    <Suspense>
      <ChooseYourPlan />
      <Faqs />
    </Suspense>
  );
};

export default Pricing;
