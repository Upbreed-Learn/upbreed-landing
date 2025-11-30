import { Metadata } from 'next';
import PressList from './press-list';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Press Coverage',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Press = () => {
  return (
    <>
      <PressList />
    </>
  );
};

export default Press;
