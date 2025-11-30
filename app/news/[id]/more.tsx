import { Button } from '@/components/ui/button';
import { NewsCard } from '../news-list';

const More = () => {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-end text-xs/[100%] font-semibold">
        MORE AMAZING ARTICLES
      </h3>
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-8">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <NewsCard key={index} />
            ))}
        </div>
        <Button>Sign Up</Button>
      </div>
    </section>
  );
};

export default More;
