import PressHeader from './header';
import PressContent from './news-content';

const Details = () => {
  return (
    <div className="flex justify-center bg-white">
      <section className="flex w-full max-w-7xl px-9 py-14 md:px-12 lg:px-18 lg:py-28">
        <article className="flex flex-col gap-8">
          <PressHeader />
          <PressContent />
        </article>
      </section>
    </div>
  );
};

export default Details;
