import { Button } from '@/components/ui/button';
import { NewsCard } from '../news-list';

const More = () => {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-xs/[100%] font-semibold lg:text-end">
        MORE AMAZING ARTICLES
      </h3>
      <div className="scrollbar-hidden flex flex-col gap-8 overflow-auto max-lg:w-full lg:gap-32">
        <div className="flex gap-8 max-lg:w-140 lg:flex-col">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <NewsCard key={index} />
            ))}
        </div>
        <Button className="max-lg:hidden">Sign Up</Button>
      </div>
    </section>
  );
};

export default More;
