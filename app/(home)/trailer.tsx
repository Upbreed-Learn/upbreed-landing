import Image from 'next/image';
import trailer from '@/public/img/trailer.png';
import { Play } from 'lucide-react';

const Trailer = () => {
  return (
    <section className="flex justify-center">
      <div className="w-full max-w-7xl px-18 py-10">
        <div className="relative size-max">
          <Image src={trailer} alt="trailer" width={1062.22} height={528} />
          <div className="absolute top-1/2 right-22.5 flex -translate-y-1/2 flex-col gap-4">
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
