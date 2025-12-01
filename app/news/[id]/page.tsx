import NewsHeader from './header';
import More from './more';
import NewsContent from './news-content';

const Details = () => {
  return (
    <div className="flex justify-center bg-white">
      <section className="flex w-full max-w-7xl gap-16 px-9 py-14 max-lg:flex-col md:px-12 lg:gap-20 lg:px-18 lg:py-28 xl:gap-35">
        <article className="flex flex-col gap-8">
          <NewsHeader />
          <NewsContent />
        </article>
        <More />
      </section>
    </div>
  );
};

export default Details;
