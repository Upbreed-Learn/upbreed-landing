import H1 from '@/components/header-text';

const Hero = () => {
  return (
    <section className="relative flex justify-center bg-[url(/img/news-hero.jpg)] bg-cover bg-center bg-no-repeat before:absolute before:size-full before:bg-black before:opacity-90">
      <div className="z-10 w-full max-w-7xl p-9 md:p-12 lg:p-18">
        <H1>
          Press <br /> Coverage
        </H1>
      </div>
    </section>
  );
};

export default Hero;
