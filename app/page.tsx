import Faqs from '@/components/faqs';
import Elevate from './(home)/elevate';
import Feedback from './(home)/feedback';
import Hero from './(home)/hero';
import OneOnOne from './(home)/one-on-one';
import Trailer from './(home)/trailer';
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
