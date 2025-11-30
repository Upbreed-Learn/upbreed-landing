import PressHeader from './header';
import PressContent from './news-content';

const Details = () => {
  return (
    <div className="flex justify-center bg-white">
      <section className="flex w-full max-w-7xl px-18 py-28">
        <article className="flex flex-col gap-8">
          <PressHeader />
          <PressContent />
        </article>
      </section>
    </div>
  );
};

export default Details;
