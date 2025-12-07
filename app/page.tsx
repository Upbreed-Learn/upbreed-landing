import Faqs from '@/components/faqs';
import Elevate from './(landing-page)/(home)/elevate';
import Feedback from './(landing-page)/(home)/feedback';
import Hero from './(landing-page)/(home)/hero';
import OneOnOne from './(landing-page)/(home)/one-on-one';
import Trailer from './(landing-page)/(home)/trailer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Home',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

export default function Home() {
  return (
    <>
      <Hero />
      <div className="bg-[#232323]">
        <Trailer />
        <Elevate />
      </div>
      <Feedback />
      <OneOnOne />
      <Faqs />
    </>
  );
}
