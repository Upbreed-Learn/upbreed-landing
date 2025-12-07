'use client';

import AvatarCustom from '@/components/ui/custom/avatar';
import preview from '@/public/img/course-preview.jpg';
import Location from '@/components/jsx-icons/location';
import { useQueryState } from 'nuqs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';

const Hero = () => {
  return (
    <section className="flex justify-center bg-[#305B43] text-white">
      <div className="flex w-full max-w-7xl flex-col px-9 pt-14.5 md:px-12 lg:px-18">
        <div className="flex gap-13 max-sm:flex-col sm:items-center">
          <AvatarCustom
            src={preview}
            alt="course-preview"
            fallback="JO"
            className="size-31.75"
          />
          <div className="flex flex-col gap-1.5">
            <p className="text-lg/6 font-semibold">Tope Adenola</p>
            <div className="flex items-center gap-1">
              <Location />
              <p className="text-xs/6 font-semibold text-[#E0E0E0]">
                Accra, Ghana
              </p>
            </div>
          </div>
        </div>
        <Suspense>
          <SettingsTab />
        </Suspense>
      </div>
    </section>
  );
};

export default Hero;

const SettingsTab = () => {
  const [tab, setTab] = useQueryState('section', {
    defaultValue: 'profile',
  });

  return (
    <Tabs
      defaultValue="my-courses"
      className="sm:pl-45.25"
      value={tab}
      onValueChange={setTab}
    >
      <TabsList className="h-auto gap-1 bg-transparent sm:gap-8">
        <TabsTrigger
          value="profile"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent data-[state=active]:text-[#D0EA50] data-[state=active]:shadow-none"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="subscription"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent data-[state=active]:text-[#D0EA50] data-[state=active]:shadow-none"
        >
          Subscription
        </TabsTrigger>
        <TabsTrigger
          value="privacy"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent data-[state=active]:text-[#D0EA50] data-[state=active]:shadow-none"
        >
          Privacy
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="cursor-pointer rounded-none border-x-0 border-t-0 border-b-[5px] border-transparent pb-3 text-white transition-colors data-[state=active]:border-[#D0EA50] data-[state=active]:bg-transparent data-[state=active]:text-[#D0EA50] data-[state=active]:shadow-none"
        >
          Password
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
