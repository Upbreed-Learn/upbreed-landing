import H1 from '@/components/header-text';

const Hero = () => {
  return (
    <section className="flex justify-center">
      <div className="flex w-full max-w-7xl flex-col gap-6 px-9 py-8 md:gap-12 md:px-18 md:py-16">
        <H1>Career</H1>
        <p className="text-justify text-sm/[30px] font-medium text-white">
          Join us at Upbreed Learn, where we are redefining online education by
          bringing experts and learners together through engaging and
          high-quality courses. As we continue to expand, we're looking for
          passionate, creative, and driven individuals to join our dynamic team.{' '}
          <br />
          Our mission is to provide exceptional learning experiences that
          inspire and empower our subscribers. Whether it's helping someone
          discover a new passion, advance their career, or simply learn
          something new, our goal is to impact lives positively. We are a
          fast-growing startup with a vision to build a{' '}
          <span className="text-xl/[30px] font-bold text-[#D0EA50]">
            global community of learners
          </span>
          . With our headquarters in Lagos, Nigeria, and plans for future
          offices in key locations around the world, {`we’re`} excited about the
          road ahead. If you're ready to be part of a team that's making a
          difference in the world of online learning, {`we’d`} love to hear from
          you!
        </p>
      </div>
    </section>
  );
};

export default Hero;
