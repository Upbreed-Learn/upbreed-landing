import { Suspense } from 'react';
import CourseList from './course-list';
import Hero from './hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Courses',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const Courses = () => {
  return (
    <>
      <Hero />
      <Suspense>
        <CourseList />
      </Suspense>
    </>
  );
};

export default Courses;
