import { Metadata } from 'next';
import Hero from './hero';
import Roles from './roles';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Career',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Career = () => {
  return (
    <>
      <Hero />
      <Roles />
    </>
  );
};

export default Career;
