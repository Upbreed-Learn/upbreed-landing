import NewsHeader from './header';
import More from './more';
import NewsContent from './news-content';

const Details = () => {
  return (
    <div className="flex justify-center bg-white">
      <section className="flex w-full max-w-7xl gap-35 px-18 py-28">
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
