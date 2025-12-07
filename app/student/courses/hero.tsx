'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryState } from 'nuqs';
import { Suspense } from 'react';

const Hero = () => {
  return (
    <section className="flex justify-center bg-[#00230F] pt-14.5 text-white">
      <div className="flex w-full max-w-7xl flex-col gap-14.5 px-9 md:px-12 lg:px-18">
        <h1 className="text-center text-xl/[100%] font-bold">
          Welcome Jennifer O,
        </h1>
        <Suspense>
          <CourseTab />
        </Suspense>
      </div>
    </section>
  );
};

export default Hero;

const CourseTab = () => {
  const [tab, setTab] = useQueryState('category', {
    defaultValue: 'my-courses',
  });

  return (
    <Tabs
      defaultValue="my-courses"
      className="w-full max-w-[400px]"
      value={tab}
      onValueChange={setTab}
    >
      <TabsList className="h-auto gap-2 bg-transparent md:gap-8">
        <TabsTrigger
          value="my-courses"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent"
        >
          My Courses
        </TabsTrigger>
        <TabsTrigger
          value="saved"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent"
        >
          Saved Courses
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent"
        >
          History
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
