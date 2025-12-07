import { Metadata } from 'next';
import Courses from './courses';
import Hero, { MobileHero } from './hero';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Student Dashboard',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Home = () => {
  return (
    <>
      <Hero />
      <MobileHero />
      <Courses />
    </>
  );
};

export default Home;
