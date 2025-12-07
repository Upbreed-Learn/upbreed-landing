import preview from '@/public/img/course-preview.jpg';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="flex justify-center bg-[#305B43]">
      <div className="w-full max-w-7xl md:px-12 md:pt-21.75 md:pb-7 lg:pl-27.25">
        <div className="items-center gap-12 max-md:relative max-md:h-max md:flex">
          <div className="relative h-123.75 w-full shrink-0 md:h-67.25 md:w-40.5 md:overflow-hidden md:rounded-[10px]">
            <Image
              src={preview}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              alt="course-preview"
              className="size-full object-cover"
            />
          </div>
          <div className="bottom-7 flex flex-col gap-4 text-white max-md:absolute max-md:w-full max-md:items-center max-md:text-center md:gap-9">
            <h1 className="text-xl/6 font-semibold max-md:hidden">
              About the Instructor
            </h1>
            <div className="flex flex-col gap-3 md:hidden">
              <h1 className="text-[2.5rem]/9 font-semibold text-[#D0EA50] max-md:w-full max-md:max-w-42.75">
                Michelle Elegbe
              </h1>
              <p className="leading-4 font-semibold">Business Development</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="w-full max-w-79 leading-6 max-md:line-clamp-3 max-md:text-center max-md:text-[10px] max-md:leading-4 max-md:text-ellipsis md:max-w-218.25">
                Elumelu was born in Jos, Plateau, Nigeria, on 22 March 1963, to
                Suzanne and Dominic Elumelu from Onicha-Ukwu in Aniocha North
                Local Government Area of Delta State. He grew up with four
                siblings, one of whom is Ndudi Elumelu, a minority leader in the
                Nigerian Federal House of Representatives. Elumelu was born in
                Jos, Plateau, Nigeria, on 22 March 1963, to Suzanne and Dominic
                Elumelu from Onicha-Ukwu in Aniocha North Local Government Area
                of Delta State. He grew up with four siblings, one of whom is
                Ndudi Elumelu, a minority leader in the Nigerian Federal House
                of Representatives.
              </p>
              <button className="text-[7px]/4 md:hidden">Read more...</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
