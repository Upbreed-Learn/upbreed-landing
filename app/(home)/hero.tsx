import hero from '@/public/img/hero.png';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="flex justify-center bg-[#00230F]">
      <div className="flex w-full max-w-7xl items-center px-9 py-14 max-lg:flex-col max-lg:gap-7 md:justify-between md:px-12 md:py-21.5 lg:px-18">
        <div className="flex flex-col gap-23.5">
          <h1 className="text-4xl leading-[100%] font-extrabold text-[#D0EA50] max-lg:text-center lg:text-[3.555625rem]">
            Learn from{' '}
            <span className="block text-white">The {`Industry’s`}</span> Best
          </h1>
          <ul className="list-inside list-disc leading-[100%] font-extrabold text-white max-lg:hidden">
            <li>Learn anywhere</li>
            <li>Anytime</li>
            <li>At your own convenience</li>
          </ul>
        </div>
        <Image src={hero} alt="hero" width={615.82} height={538.56} />
        <ul className="list-inside list-disc text-center leading-[100%] font-extrabold text-white lg:hidden">
          <li>Learn anywhere</li>
          <li>At your own convenience</li>
          <li>Anytime</li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;
