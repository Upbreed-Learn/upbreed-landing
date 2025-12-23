'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileType } from '@/lib/constants';
import { useGetToken, useGetUserProfile } from '@/lib/queries/hooks';
import { useQueryState } from 'nuqs';
import { Activity, Suspense } from 'react';

const Hero = () => {
  const { data } = useGetToken();
  const token = data?.data.token;

  const { data: userData, isPending, isError } = useGetUserProfile(token);
  const userProfile: UserProfileType = userData?.data.data;
  return (
    <section className="flex justify-center bg-[#00230F] pt-14.5 text-white">
      <div className="flex w-full max-w-7xl flex-col gap-14.5 px-9 md:px-12 lg:px-18">
        {isPending ? (
          <span className="mx-auto inline-block h-5 w-48 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <h1 className="text-center text-xl/[100%] font-bold">
            Welcome{' '}
            <Activity mode={isError ? 'hidden' : 'visible'}>
              {userProfile.fname} {userProfile.lname[0]}
            </Activity>
            ,
          </h1>
        )}
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
