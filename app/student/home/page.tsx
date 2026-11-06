import { Metadata } from 'next';
import Courses from './courses';
import Hero from './hero';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Student Dashboard',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Home = () => {
  return (
    <>
      <Hero />
      <Courses />
    </>
  );
};

export default Home;
