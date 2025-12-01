import Image from 'next/image';
import trailer from '@/public/img/trailer.png';
import { Play } from 'lucide-react';

const Trailer = () => {
  return (
    <section className="flex justify-center">
      <div className="w-full max-w-7xl px-9 py-7 md:px-12 md:py-10 lg:px-18">
        <div className="relative size-max">
          <div className="h-123 w-[calc(100vw-4.5rem)] max-w-[66.38875rem] overflow-hidden rounded-2xl md:h-132 md:w-[calc(100vw-6rem)] lg:md:w-[calc(100vw-9rem)] xl:w-full">
            <Image
              src={trailer}
              alt="trailer"
              width={0}
              height={0}
              className="size-full object-cover"
            />
          </div>
          <div className="absolute flex flex-col gap-4 max-md:bottom-9 max-md:left-9 md:top-1/2 md:right-22.5 md:-translate-y-1/2">
            <div>
              <div className="flex flex-col gap-3">
                <span className="w-max rounded-[8.89px] border-[1.78px] border-[#D0EA50] px-2 py-1.5 text-[8.89px]/[100%] font-semibold text-white">
                  New
                </span>
                <p className="text-[2.666875rem]/[100%] font-extrabold text-white">
                  SACHAN <br /> ELEGUSHI
                </p>
              </div>
              <p className="text-sm/[100%] font-bold text-[#D0EA50]">
                How to influence right
              </p>
            </div>
            <button className="custom-gradient flex w-max cursor-pointer items-center gap-1 rounded-lg border-[1.78px] border-white px-3.5 py-2 text-sm/[100%] font-semibold text-white transition-transform active:scale-95">
              Watch Trailer
              <Play />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trailer;
