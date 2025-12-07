import DualDisplay from '@/components/jsx-icons/dual-display';
import { Download, Star, Volume2Icon } from 'lucide-react';
import expect01 from '@/public/img/expect-01.jpg';
import expect02 from '@/public/img/expect-02.jpg';
import expect03 from '@/public/img/expect-03.png';
import expect04 from '@/public/img/expect-04.png';
import expect05 from '@/public/img/expect-05.png';
import Image from 'next/image';

const WhatToExpect = () => {
  return (
    <section className="flex justify-center bg-[#305B43]">
      <div className="flex w-full max-w-7xl justify-center gap-7 px-9 py-7 max-lg:flex-col-reverse md:px-12 lg:px-20 xl:px-50.75">
        <div className="flex flex-col gap-5 text-white sm:max-lg:self-center">
          <h2 className="ml-7 text-2xl/6 font-extrabold">What to expect</h2>
          <ul className="flex w-full flex-col gap-3 md:w-116 [&>li]:flex [&>li]:items-center [&>li]:gap-3">
            <li>
              <DualDisplay />
              <span>All 10+ classes, sessions</span>
            </li>
            <li>
              <Volume2Icon />
              <span>Spatial Audio</span>
            </li>
            <li>
              <Download />
              <span>Download and watch offline (select plans)</span>
            </li>
            <li>
              <DualDisplay />
              <span>All 10+ classes, sessions</span>
            </li>
            <li>
              <Star />
              <span>New classes added every month</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-0.5 sm:max-lg:self-center">
          <div className="relative ml-11 h-[3.76125rem] w-[8.62rem] overflow-hidden rounded-lg md:ml-13.25 md:h-18 md:w-41.25">
            <Image
              fill
              className="object-cover"
              sizes={'100vw'}
              src={expect01}
              alt="expect-01"
            />
          </div>
          <div className="flex items-center gap-0.5">
            <div className="relative h-[3.76125rem] w-[8.62rem] overflow-hidden rounded-lg md:h-18 md:w-41.25">
              <Image
                fill
                className="object-cover"
                sizes={'100vw'}
                src={expect02}
                alt="expect-02"
              />
            </div>
            <div className="relative h-[3.76125rem] w-[8.62rem] overflow-hidden rounded-lg md:h-18 md:w-41.25">
              <Image
                fill
                className="object-cover"
                sizes={'100vw'}
                src={expect03}
                alt="expect-03"
              />
            </div>
          </div>
          <div className="ml-11 flex items-center gap-0.5 md:ml-13.25">
            <div className="relative h-[3.76125rem] w-[8.62rem] overflow-hidden rounded-lg md:h-18 md:w-41.25">
              <Image
                fill
                className="object-cover"
                sizes={'100vw'}
                src={expect04}
                alt="expect-04"
              />
            </div>
            <div className="relative h-[3.76125rem] w-[8.62rem] overflow-hidden rounded-lg md:h-18 md:w-41.25">
              <Image
                fill
                className="object-cover"
                sizes={'100vw'}
                src={expect05}
                alt="expect-05"
              />
            </div>
          </div>
          <div className="relative ml-36 h-[3.76125rem] w-[8.62rem] overflow-hidden rounded-lg md:ml-50.25 md:h-18 md:w-41.25">
            <Image
              fill
              className="object-cover"
              sizes={'100vw'}
              src={expect05}
              alt="expect-05"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatToExpect;
