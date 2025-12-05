import { Metadata } from 'next';
import NewsHeader from './header';
import More from './more';
import NewsContent from './news-content';
import { BlogDetailsData } from '@/lib/constants';
import { getBlogByIdServer } from '@/lib/server/blogs';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const post: BlogDetailsData = await getBlogByIdServer(id);

  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      title: post?.title,
      description: post?.description,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${id}`,
      images: [
        {
          url: post?.previewImage,
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
      images: [post?.previewImage],
    },
  };
}

const Details = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div className="flex justify-center bg-white">
      <section className="flex w-full max-w-7xl gap-16 px-9 py-14 max-lg:flex-col md:px-12 lg:gap-20 lg:px-18 lg:py-28 xl:gap-35">
        <article className="flex flex-3/4 flex-col gap-8">
          <NewsHeader id={id} />
          <NewsContent id={id} />
        </article>
        <More id={id} />
      </section>
    </div>
  );
};

export default Details;
