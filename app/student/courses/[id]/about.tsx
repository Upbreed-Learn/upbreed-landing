import preview from '@/public/img/course-preview.jpg';
import play from '@/public/gifs/play.gif';
import { PlayIcon } from 'lucide-react';
import StarIcon from '@/components/jsx-icons/star';
import Image from 'next/image';

const About = () => {
  return (
    <section className="flex justify-center pt-11 pb-[12.6675rem] md:pt-20.5">
      <div className="flex w-full max-w-7xl flex-col gap-5 max-md:px-9">
        <h2 className="text-xl/6 font-semibold max-md:hidden md:pl-12 lg:pl-27.25">
          About this Class
        </h2>
        <div className="flex flex-col gap-11 md:gap-6">
          <div className="flex items-center max-md:flex-col max-md:gap-4 md:h-126 md:bg-[#00230F]">
            <div className="relative h-45.25 max-md:w-full max-md:overflow-hidden max-md:rounded-[10px] sm:h-80 md:h-full md:flex-2/3 lg:flex-3/4">
              <Image
                src={preview}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                alt="course-preview"
                className="size-full object-cover"
              />
              <Image
                src={play}
                alt="play"
                className="absolute top-1/2 left-1/2 -translate-1/2"
              />
            </div>
            <div className="scrollbar-custom flex h-97.25 flex-col gap-6 overflow-auto max-md:w-full max-md:px-5 md:h-full md:flex-1/3 md:gap-11 md:p-7.5 md:py-11 lg:flex-1/4">
              <div className="flex flex-col gap-2">
                <span className="text-xs/6 font-semibold text-[#7D1E1E] md:hidden">
                  65 Lessons
                </span>
                <div className="flex items-center justify-between rounded-[10px] bg-[#305B43] px-9 py-3.5 text-[#D0EA50]">
                  <p className="text-xs/6 font-semibold">Trailer </p>
                  <PlayIcon size={24} />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 rounded-[10px] bg-[#305B43] px-9 py-3.5 text-white"
                    >
                      <p className="text-xs/6 font-semibold">Trailer</p>
                      <PlayIcon size={24} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:gap-8 md:pl-12 lg:pl-27.25">
            <p className="w-full max-w-201.75 text-sm/5 tracking-[0.14px] text-black max-md:border-b max-md:border-[#0000000D] max-md:pb-2.5">
              Learn the art and science of game design with Will Wright, the
              mind behind SimCity and The Sims. <br /> In this game design
              class, Will teaches you how to create games that empower players
              and unleash their imagination. <br /> {`You’ll`} develop a tool
              set for understanding player psychology, as well as learn{' '}
              {`Will’s`} approach to generating and <br /> pitching ideas,
              prototyping, playtesting, and building a community.
            </p>
            <div className="flex flex-col gap-2">
              <ul className="flex flex-col gap-2 text-xs text-[#6F6F6F] md:text-sm/6 [&_span]:font-bold">
                <li>
                  Instructor(s): <span>Tony Elumelu</span>
                </li>
                <li>
                  Class Length: <span>21 Video Lessons (1 Hour 32 Mins)</span>
                </li>
                <li>
                  Category: <span>Business</span>
                </li>
              </ul>
              <div className="flex items-center gap-0.5 max-md:hidden">
                <StarIcon fill="#FFC700" />
                <StarIcon fill="#FFC700" />
                <StarIcon fill="#FFC700" />
                <StarIcon fill="#FFC700" />
                <StarIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
