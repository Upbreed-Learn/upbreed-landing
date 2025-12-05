import { Metadata, ResolvingMetadata } from 'next';
import PressHeader from './header';
import PressContent from './press-content';
import { getBlogByIdServer } from '@/lib/server/blogs';
import { BlogDetailsData } from '@/lib/constants';

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
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
      <section className="flex w-full max-w-7xl px-9 py-14 md:px-12 lg:px-18 lg:py-28">
        <article className="flex w-full flex-col gap-8">
          <PressHeader id={id} />
          <PressContent id={id} />
        </article>
      </section>
    </div>
  );
};

export default Details;
