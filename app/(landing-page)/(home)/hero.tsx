'use client';

import hero from '@/public/img/hero.png';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (revealRef.current) {
      ScrollTrigger.create({
        trigger: revealRef.current,
        start: 'top center',
        onEnter: () => {
          gsap.to('.reveal', {
            x: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power2.out',
          });
        },
      });
    }
  });

  return (
    <section ref={revealRef} className="flex justify-center bg-[#00230F]">
      <div className="flex w-full max-w-7xl items-center px-9 py-14 max-lg:flex-col max-lg:gap-7 md:justify-between md:px-12 md:py-21.5 lg:px-18">
        <div className="reveal flex -translate-x-96 flex-col gap-23.5 opacity-0">
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
        <Image
          src={hero}
          alt="hero"
          width={615.82}
          height={538.56}
          className="reveal translate-x-96 opacity-0"
        />
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
