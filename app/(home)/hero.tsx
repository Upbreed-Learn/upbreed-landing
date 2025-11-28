import hero from '@/public/img/hero.png';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="flex justify-center bg-[#00230F]">
      <div className="flex w-full max-w-7xl items-center justify-between px-18 py-21.5">
        <div className="flex flex-col gap-23.5">
          <h1 className="text-[3.555625rem]/[100%] font-extrabold text-[#D0EA50]">
            Learn from{' '}
            <span className="block text-white">The {`Industry’s`}</span> Best
          </h1>
          <ul className="list-inside list-disc leading-[100%] font-extrabold text-white">
            <li>Learn anywhere</li>
            <li>anytime</li>
            <li>at your own convenience</li>
          </ul>
        </div>
        <Image src={hero} alt="hero" width={615.82} height={538.56} />
      </div>
    </section>
  );
};

export default Hero;
