import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import InstructorProfile from './profile';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Instructor',
  description: 'Book a private 1-on-1 video session with an Upbreed Learn instructor.',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return (
    <Suspense>
      <InstructorProfile id={id} />
    </Suspense>
  );
};

export default Page;
