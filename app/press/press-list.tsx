'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import tubo from '@/public/img/tubo.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/custom/pagination';
import { useState } from 'react';

const PressList = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="flex justify-center bg-white">
      <div className="flex w-full max-w-7xl flex-col gap-20 px-18 py-12">
        <Button onClick={handleBack} className="w-max">
          <ArrowLeft />
          Back
        </Button>
        <div className="flex flex-col gap-20">
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <PressCard key={index} />
              ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={4}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  );
};

export default PressList;

const PressCard = () => {
  return (
    <div className="relative flex flex-col gap-2.5 rounded-[10px] bg-[#00230F] px-6 pt-4 pb-14">
      <div className="h-[8.105625rem] w-full overflow-hidden rounded-[6px]">
        <Image
          src={tubo}
          alt={'tubo'}
          className="size-full object-cover object-top"
        />
      </div>
      <Link
        href={'/press/1'}
        className="text-sm/[100%] font-semibold text-white"
      >
        <span className="absolute inset-0"></span>
        Patoranking Teams WithMasterClass to Unlock {`Everyone’s`}{' '}
        HumorSuperpower
      </Link>
      <Link
        href={'/news/1'}
        className="flex items-center gap-2 border-b-[0.88px] border-white pb-2.5 text-xs/[100%] font-semibold text-[#D0EA50]"
      >
        Read More on FORBES
      </Link>
    </div>
  );
};
