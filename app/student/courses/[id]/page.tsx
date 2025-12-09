import { Metadata } from 'next';
import About from './about';
import Hero from './hero';
import Others from './others';
import { CourseDetailsData } from '@/lib/constants';
import { getCourseByIdServer } from '@/lib/server/course';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseByIdServer(id);
  const post: CourseDetailsData = course?.data;

  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      title: post?.title,
      description: post?.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/student/courses/${id}`,
      images: [
        {
          url: post?.thumbnail,
          width: 1200,
          height: 630,
          alt: `${post?.title} — cover`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
      description: post?.description,
      images: [post?.thumbnail],
    },
  };
}

const CourseDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <>
      <Hero id={id} />
      <div className="bg-white">
        <About id={id} />
        <Others id={id} />
      </div>
    </>
  );
};

export default CourseDetails;
