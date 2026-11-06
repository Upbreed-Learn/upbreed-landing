'use client';

import { CurrentSubscription, UserProfileType } from '@/lib/constants';
import { useGetCurrentSubscription, useGetToken, useGetUserProfile } from '@/lib/queries/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Welcome page after sign-in. Members who have already paid go straight to their dashboard. */
const Hero = () => {
  const router = useRouter();
  const { data: tokenData } = useGetToken();
  const { data: userData } = useGetUserProfile(tokenData?.data.token);
  const me: UserProfileType | undefined = userData?.data.data;
  const { data: subData } = useGetCurrentSubscription();
  const subs: CurrentSubscription[] | undefined = subData?.data;
  const paid = subs?.some(s => new Date(s.expiresAt).getTime() > Date.now());

  useEffect(() => {
    if (paid) router.replace('/student/home');
  }, [paid, router]);

  return (
    <section className="flex justify-center bg-[#00230F]">
      <div className="relative flex w-full max-w-7xl flex-col items-center gap-4 px-6 pt-14 pb-10 text-center text-white sm:px-9">
        <h1 className="text-3xl font-medium md:text-5xl/[110%]">Welcome{me?.fname ? ` ${me.fname}` : ''},</h1>
        <p className="text-xs font-medium md:text-sm">You are about to become the best version of yourself</p>
        <Link href="/student/home" className="text-xs underline underline-offset-4 md:absolute md:right-18 md:bottom-12">
          Go to dashboard
        </Link>
      </div>
    </section>
  );
};

export default Hero;
