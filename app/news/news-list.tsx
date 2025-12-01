'use client';

import { cn } from '@/lib/utils';
import { ArrowRightCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import tubo from '@/public/img/tubo.jpg';
import Link from 'next/link';
import { Pagination } from '@/components/ui/custom/pagination';

const CATEGORIES = [
  {
    id: 1,
    category: 'BUSINESS',
  },
  {
    id: 2,
    category: 'ENTERTAINMENT',
  },
  {
    id: 3,
    category: 'TECHNOLOGY',
  },
  {
    id: 4,
    category: 'SCIENCE',
  },
  {
    id: 5,
    category: 'SPORTS',
  },
  {
    id: 6,
    category: 'HEALTH',
  },
  {
    id: 7,
    category: 'TRAVEL',
  },
  {
    id: 8,
    category: 'GAMING',
  },
  {
    id: 9,
    category: 'FASHION',
  },
  //   {
  //     id: 10,
  //     category: 'ART',
  //   },
  //   {
  //     id: 11,
  //     category: 'BEAUTY',
  //   },
  //   {
  //     id: 12,
  //     category: 'ALL',
  //   },
  //   {
  //     id: 13,
  //     category: 'NEWS',
  //   },
];

const NewsList = () => {
  const [category, setCategory] = useQueryState('category', {
    defaultValue: 'all',
  });
  const [page, setPage] = useState(1);

  const handleSetCategory = (category: string) => {
    setCategory(category.toLowerCase());
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
      setIsAtEnd(atEnd);
    };

    // run once on mount
    handleScroll();

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return (
    <section className="flex justify-center bg-white pt-5 pb-36 md:pt-10">
      <div className="flex w-full max-w-7xl flex-col gap-14 px-9 md:px-12 lg:px-18">
        <div className="relative">
          <div
            ref={ref}
            className="scrollbar-hidden flex w-full overflow-auto xl:justify-center"
          >
            <div
              className={cn(
                'flex gap-11 border-b border-[#9B9B9B7A] py-3 md:items-center',
                CATEGORIES.length > 12 && 'pl-18',
              )}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSetCategory(cat.category)}
                  className={cn(
                    'cursor-pointer text-xs/[100%] font-bold text-[#9C9C9C] uppercase',
                    cat.category.toLowerCase() === category && 'text-black',
                  )}
                >
                  {cat.category}
                </button>
              ))}
              <ArrowRightCircleIcon
                className={cn(
                  'absolute -right-9 z-10 animate-bounce',
                  //   CATEGORIES.length < 12 && 'hidden',
                  isAtEnd && 'hidden',
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-20">
          <div className="grid gap-x-9 gap-y-7 sm:grid-cols-2 md:grid-cols-3">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <NewsCard key={index} />
              ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={12}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  );
};

export default NewsList;

export const NewsCard = () => {
  return (
    <div className="relative flex flex-col gap-2.5">
      <div className="h-[10.661875rem] w-full overflow-hidden rounded-lg">
        <Image
          src={tubo}
          alt="tubo"
          className="size-full object-cover object-top"
        />
      </div>
      <div className="flex flex-col gap-2 border-b-[0.88px] border-[#00000033] pb-3">
        <p className="text-xs/[100%] font-bold text-[#9C9C9C]">
          10TH JUNE, 2024
        </p>
        <Link
          href={'/news/1'}
          className="line-clamp-2 leading-[100%] font-extrabold text-ellipsis text-[#305B43]"
        >
          <span className="absolute inset-0"></span>
          Patoranking Teams With Upbreed Learn to Unlock Everyone’s Humor
          Superpower
        </Link>
        <p className="text-sm/[100%] font-medium text-[#949494]">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitationut aliqui
        </p>
      </div>
    </div>
  );
};
