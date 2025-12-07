import { Metadata } from 'next';
import NewsList from './news-list';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Upbreed Learn | News',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const News = () => {
  return (
    <Suspense>
      <NewsList />
    </Suspense>
  );
};

export default News;
