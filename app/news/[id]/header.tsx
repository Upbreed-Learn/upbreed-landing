import Facebook from '@/components/jsx-icons/facebook';
import Twitter from '@/components/jsx-icons/twitter';
import tubo from '@/public/img/tubo.jpg';
import Image from 'next/image';

const NewsHeader = () => {
  return (
    <section className="flex flex-col gap-6 border-b-[0.88px] border-[#00000033] pb-4">
      <div className="h-79 w-full overflow-hidden rounded-[10px]">
        <Image
          src={tubo}
          alt="tubo"
          className="size-full object-cover object-top"
        />
      </div>
      <p className="text-xs/[100%] font-bold text-[#9C9C9C]">10TH JUNE, 2024</p>
      <h2 className="text-[2rem]/[100%] font-extrabold text-[#305B43]">
        Patoranking Teams With Upbreed Learn to Unlock Everyone’s Humor
        Superpower
      </h2>
      <div className="flex items-center gap-4.5">
        <p className="text-xs/[100%] font-bold text-[#9B9B9B] uppercase">
          Share
        </p>
        <div className="flex items-center gap-1">
          <button className="cursor-pointer p-2">
            <Twitter fill="#9C9C9C" width="19" height="17.61" />
          </button>
          <button className="cursor-pointer p-2">
            <Facebook fill="#9C9C9C" width="8.86" height="16.9" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsHeader;
