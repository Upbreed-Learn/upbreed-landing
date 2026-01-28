import { Button } from '@/components/ui/button';
import { type Subscription } from '@/lib/constants';
import { useGetCurrentSubscription } from '@/lib/queries/hooks';
import { useRouter } from 'next/navigation';
import { Activity } from 'react';

const Subscription = () => {
  const { data } = useGetCurrentSubscription();
  const subscriptions: Subscription[] = data?.data;
  const router = useRouter();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold">Subscriptions</h1>
        <p className="text-sm font-semibold">
          Manage your Upbreed Learn Subscription{' '}
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <h2 className="text-sm font-extrabold text-black">Active plans</h2>
        <div className="flex h-66 flex-col items-center justify-center gap-5 bg-[#D9D9D9]">
          <Activity mode={subscriptions?.length > 0 ? 'visible' : 'hidden'}>
            <p className="text-sm font-semibold">
              You are currently on <span className="font-extrabold">BASIC</span>{' '}
              plan
            </p>
            <p className="text-xs font-semibold text-[#949494]">
              Click on Upgrade plan below to change plan
            </p>
          </Activity>
          <Activity mode={subscriptions?.length < 1 ? 'visible' : 'hidden'}>
            <p className="text-xs font-semibold text-[#949494]">
              You don’t have any active subscriptions
            </p>
          </Activity>
        </div>
        <Button
          onClick={() => router.push('/pricing')}
          className="w-max self-end"
        >
          Upgrade plan
        </Button>
      </div>
    </div>
  );
};

export default Subscription;
