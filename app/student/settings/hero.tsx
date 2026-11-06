'use client';

import AvatarCustom from '@/components/ui/custom/avatar';
import Location from '@/components/jsx-icons/location';
import { useQueryState } from 'nuqs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import { useGetToken, useGetUserProfile } from '@/lib/queries/hooks';
import { UserProfileType } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { https } from '@/lib/https';
import { queryKeys } from '@/lib/queries/query-keys';
import { apiError } from '@/lib/sessions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, LoaderCircle } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

const Hero = () => {
  const { data } = useGetToken();
  const token = data?.data.token;

  const { data: userData, isPending, isError } = useGetUserProfile(token);
  const userProfile: UserProfileType = userData?.data.data;

  return (
    <section className="flex justify-center bg-[#305B43] text-white">
      <div className="flex w-full max-w-7xl flex-col gap-6 px-6 pt-8 sm:px-9 md:px-12 lg:px-18">
        {isPending ? (
          <ProfileLoader />
        ) : (
          <div
            className={cn(
              'flex items-center gap-6 sm:gap-10',
              isError && 'hidden',
            )}
          >
            <PhotoPicker profile={userProfile} />
            <div className="flex flex-col gap-1.5">
              <p className="text-lg/6 font-semibold">
                {userProfile?.fname} {userProfile?.lname}
              </p>
              {/* <div className="flex items-center gap-1">
                <Location />
                <p className="text-xs/6 font-semibold text-[#E0E0E0]">
                  Accra, Ghana
                </p>
              </div> */}
            </div>
          </div>
        )}
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
      className="max-w-full overflow-x-auto sm:pl-34"
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

function PhotoPicker({ profile }: { profile?: UserProfileType }) {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const upload = useMutation({
    mutationFn: (file: File) => {
      const body = new FormData();
      body.append('image', file);
      return https.post('/user/avatar', body, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => {
      toast.success('Photo updated');
      qc.invalidateQueries({ queryKey: queryKeys.userProfile.all });
    },
    onError: e => toast.error('Could not upload photo', { description: apiError(e) }),
  });
  const pick = (file?: File) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return toast.error('Use a JPG, PNG, WEBP or GIF photo');
    if (file.size > 5 * 1024 * 1024) return toast.error('Photo must be 5 MB or smaller');
    upload.mutate(file);
  };
  return (
    <div className="relative shrink-0">
      <AvatarCustom
        src={profile?.avatarUrl ?? undefined}
        alt="avatar"
        fallback={`${profile?.fname?.[0] ?? ''}${profile?.lname?.[0] ?? ''}`}
        className={cn('size-20 sm:size-24', upload.isPending && 'opacity-60')}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={upload.isPending}
        aria-label="Change profile photo"
        className="absolute right-0 bottom-0 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-[#305B43] bg-[#D0EA50] text-[#00230F] shadow transition-transform hover:scale-105"
      >
        {upload.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => {
          pick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

const ProfileLoader = () => {
  return (
    <div className="flex items-center gap-6 sm:gap-10">
      <div className="size-20 animate-pulse rounded-full bg-gray-200 sm:size-24" />

      <div className="flex flex-col gap-2">
        {/* Name skeleton */}
        <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />

        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
