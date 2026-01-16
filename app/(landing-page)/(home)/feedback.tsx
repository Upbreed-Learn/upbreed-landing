'use client';

import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import tubo from '@/public/img/tubo.jpg';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useHorizontalScrollPercentage } from '@/lib/hooks/useHorizontalScroll';

const Feedback = () => {
  const feedbackLength = 4;
  const [items, setItems] = useState(0);
  const { percentage, ref } = useHorizontalScrollPercentage<HTMLDivElement>();

  const scrollToLength = (percentage / 100) * 3;

  const handleScrollLeft = () => {
    if (items === 0) {
      setItems(feedbackLength - 1);
    } else {
      setItems(items - 1);
    }
  };

  const handleScrollRight = () => {
    if (items === 3) {
      setItems(0);
    } else {
      setItems(items + 1);
    }
  };

  const isEven = (num = items) => num % 2 === 0;

  return (
    <section className="custom-gradient-2 flex h-[calc(100vh-89px)] justify-center pt-17.5 pb-14 md:pb-41">
      <div className="w-full max-w-191.25">
        <div className="flex flex-col items-center gap-12 md:gap-24">
          <h2 className="text-center text-xl leading-[100%] font-bold text-white md:text-[2rem]">
            Feedback from our learners
          </h2>
          <div className="flex w-full items-center justify-center gap-10">
            <button
              onClick={handleScrollLeft}
              className="cursor-pointer transition-transform active:scale-95 max-md:hidden"
            >
              <ChevronLeftCircle className="size-10 text-[#FFFFFF]" />
            </button>
            <div ref={ref} className="scrollbar-hidden max-md:overflow-auto">
              <div className="grid-stack max-md:flex max-md:w-max max-md:gap-10 max-md:px-9 md:grid">
                {Array(feedbackLength)
                  .fill(0)
                  .map((_, index) => (
                    <FeedbackCard
                      key={index}
                      className={cn(
                        'transition-[rotate] md:rotate-6',
                        items === index &&
                          isEven(index) &&
                          'odd:md:-rotate-2 even:md:rotate-6',
                      )}
                    />
                  ))}
              </div>
            </div>
            <button
              onClick={handleScrollRight}
              className="cursor-pointer transition-transform active:scale-95 max-md:hidden"
            >
              <ChevronRightCircle className="size-10 text-[#FFFFFF]" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'block w-4 rounded border-2 border-[#737373]',
                    items === i && 'md:border-white',
                    Math.ceil(scrollToLength) === i && 'max-md:border-white',
                  )}
                ></span>
              ))}
            {/* <span className="block w-8 rounded border-2 border-white"></span>
            <span className="block w-4 rounded border-2 border-[#737373]"></span>
            <span className="block w-4 rounded border-2 border-[#737373]"></span>
            <span className="block w-4 rounded border-2 border-[#737373]"></span> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;

const FeedbackCard = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div
      className={cn(
        'grid-area-stack _odd:md:-rotate-2 _even:md:rotate-6 flex items-center gap-8 rounded-lg border-2 border-[#949494] bg-[#393939] p-6 max-md:h-76 max-md:flex-col max-md:justify-between md:pt-12 md:pr-14 md:pb-12 md:pl-11',
        className,
      )}
    >
      <div className="flex w-full max-w-[14.219375rem] flex-col gap-4 text-white">
        <p className="leading-[100%] font-bold max-md:text-sm">
          One of the best platform for me to learn, my best class was from
          Jennifer Okhori, the way she analysed the class, i am happy to be part
          of this platform
        </p>
        <div className="flex flex-col gap-2 max-md:hidden">
          <p className="text-xs/[100%]">Nse Etukpe</p>
          <p className="text-[8px]/[100%] font-bold text-[#C0C0C0]">UGANDA</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2 md:hidden">
          <p className="text-xs/[100%] text-white">Nse Etukpe</p>
          <p className="text-[8px]/[100%] font-bold text-[#C0C0C0]">UGANDA</p>
        </div>
        <div className="h-26 w-24.25 overflow-hidden rounded-[10px] md:h-48.25 md:w-45">
          <Image
            src={tubo}
            alt="tubo"
            width={0}
            height={0}
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
