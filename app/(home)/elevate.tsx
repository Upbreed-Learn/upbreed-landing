'use client';

import Basketball from '@/components/jsx-icons/basketball';
import Dna from '@/components/jsx-icons/dna';
import Globe from '@/components/jsx-icons/globe';
import ImageIcon from '@/components/jsx-icons/image';
import Screen from '@/components/jsx-icons/screen';
import Sound from '@/components/jsx-icons/sound';
import Star1 from '@/components/jsx-icons/star-1';
import TrendingUp from '@/components/jsx-icons/trending-up';
import UsersMore from '@/components/jsx-icons/users-more';
import Link from 'next/link';
import tubo from '@/public/img/tubo.jpg';
import Image from 'next/image';
import StarIcon from '@/components/jsx-icons/star';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useRef } from 'react';

const Elevate = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current?.scrollLeft - 100,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current?.scrollLeft + 100,
      behavior: 'smooth',
    });
  };

  return (
    <section className="flex justify-center px-8 py-7">
      <div className="flex w-full max-w-7xl flex-col items-center gap-10 pt-11 pb-8">
        <h2 className="text-center text-4xl/[100%] font-extrabold text-[#D0EA50]">
          Elevate Your Skills
        </h2>
        <ul className="flex w-full max-w-[60.819375rem] flex-wrap items-center justify-center gap-[18px] text-sm/[100%] font-semibold text-white [&_a]:flex [&_a]:size-full [&_a]:items-center [&_a]:gap-2 [&_a]:px-6 [&_a]:py-3 [&>li]:rounded-lg [&>li]:border-[1.78px] [&>li]:border-[#474747] [&>li]:transition-colors [&>li]:hover:bg-slate-100 [&>li]:hover:text-black">
          <li>
            <Link href={'#'}>
              Sports & Athletics
              <Basketball />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Trending
              <Star1 />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Business and Enterpreneurship
              <TrendingUp />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Community & Government
              <UsersMore />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Art & Design
              <ImageIcon />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Music
              <Sound />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Health & Wellness
              <Dna />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Film & TV
              <Screen />
            </Link>
          </li>
          <li>
            <Link href={'#'}>
              Science & Technology
              <Globe />
            </Link>
          </li>
        </ul>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2.5 text-sm/[100%] font-bold">
            <p className="text-[#D0EA50]">Trending Courses</p>
            <Link
              href={'#'}
              className="text-[#6C724F] transition-colors hover:text-[#D0EA50]"
            >
              See all
            </Link>
          </div>
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex w-full gap-[1.38875rem] overflow-auto"
            >
              <button
                onClick={handleScrollLeft}
                className="-transition-y-1/2 absolute top-1/2 -left-6 z-10 cursor-pointer transition-transform active:scale-95"
              >
                <ChevronLeftCircle className="size-10 text-[#FFFFFF]" />
              </button>
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="relative size-max shrink-0 overflow-hidden rounded-lg ease-in-out hover:brightness-125"
                  >
                    <span className="absolute top-4 right-5 z-10 rounded-lg border border-[#D0EA50] px-2 py-1 text-[8px]/[100%] font-semibold text-white">
                      New
                    </span>
                    <Image
                      src={tubo}
                      alt="tubo"
                      width={206.67}
                      height={316.44}
                    />
                    <div className="absolute bottom-5 left-1/2 flex w-11/12 -translate-x-1/2 flex-col gap-4">
                      <div>
                        <p className="text-[2rem]/[100%] font-extrabold text-white">
                          TUBO- BERENI
                        </p>
                        <p className="text-[10.67px]/[100%] text-[#D0EA50]">
                          Selling to the world
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[8px]/[100%] font-semibold text-white">
                          1H 32mins
                        </p>
                        <div className="flex items-center gap-0.5">
                          <StarIcon fill="#FFC700" />
                          <StarIcon fill="#FFC700" />
                          <StarIcon fill="#FFC700" />
                          <StarIcon fill="#FFC700" />
                          <StarIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={handleScrollRight}
              className="-transition-y-1/2 absolute top-1/2 -right-6 z-10 cursor-pointer transition-transform active:scale-95"
            >
              <ChevronRightCircle className="size-10 text-[#FFFFFF]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Elevate;
