import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import tubo from '@/public/img/tubo.jpg';
import Image from 'next/image';

const Feedback = () => {
  return (
    <section className="custom-gradient-2 flex justify-center pt-17.5 pb-41">
      <div className="w-full max-w-191.25">
        <div className="flex flex-col gap-24">
          <h2 className="text-center text-[2rem]/[100%] font-bold text-white">
            Feedback from our learners
          </h2>
          <div className="flex items-center justify-center gap-10">
            <button className="cursor-pointer transition-transform active:scale-95">
              <ChevronLeftCircle className="size-10 text-[#FFFFFF]" />
            </button>
            <div className="grid-stack grid">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <FeedbackCard key={index} />
                ))}
            </div>
            <button className="cursor-pointer transition-transform active:scale-95">
              <ChevronRightCircle className="size-10 text-[#FFFFFF]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;

const FeedbackCard = () => {
  return (
    <div className="grid-area-stack flex items-center gap-8 rounded-lg border-2 border-[#949494] bg-[#393939] pt-12 pr-14 pb-12 pl-11 odd:-rotate-2 even:rotate-6">
      <div className="flex w-full max-w-[14.219375rem] flex-col gap-4 text-white">
        <p className="leading-[100%] font-bold">
          One of the best platform for me to learn, my best class was from
          Jennifer Okhori, the way she analysed the class, i am happy to be part
          of this platform
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-xs/[100%]">Nse Etukpe</p>
          <p className="text-[8px]/[100%] font-bold text-[#C0C0C0]">UGANDA</p>
        </div>
      </div>
      <div className="h-48.25 w-45 overflow-hidden rounded-[10px]">
        <Image src={tubo} alt="tubo" className="size-full object-cover" />
      </div>
    </div>
  );
};
