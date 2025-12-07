import preview from '@/public/img/course-preview.jpg';
import Image from 'next/image';
import Link from 'next/link';

const Others = () => {
  return (
    <section className="flex justify-center pb-20">
      <div className="w-full max-w-7xl lg:px-27.25">
        <div className="flex flex-col gap-5.5 border-t border-[#D9D9D9] pt-17">
          <h2 className="text-center text-xl/10 font-bold text-[#0A0A0A]">
            Other Classes you might like
          </h2>
          <div className="scrollbar max-lg:flex max-lg:w-full max-lg:overflow-auto max-md:px-9 md:max-lg:px-12">
            <div className="flex grid-cols-5 max-xl:gap-6 max-lg:w-max max-lg:px-5 lg:flex-wrap xl:grid xl:px-10">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Link
                    key={index}
                    href={'/student/courses/1'}
                    className="relative h-69.25 w-44.25 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={preview}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      alt="course-preview"
                      className="size-full object-cover"
                    />

                    <div
                      key={index}
                      className="absolute bottom-6 left-5 text-white"
                    >
                      <p className="text-[1.875rem]/[100%] font-bold">
                        Michelle Elegbe
                      </p>
                      <p className="text-xs/5 font-semibold text-[#D9D9D9]">
                        Learn Banking Business
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Others;
