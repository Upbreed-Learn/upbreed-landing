import Faqs from '@/components/faqs';
import Elevate from './(home)/elevate';
import Feedback from './(home)/feedback';
import Hero from './(home)/hero';
import OneOnOne from './(home)/one-on-one';
import Trailer from './(home)/trailer';

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
