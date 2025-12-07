import { Button } from '@/components/ui/button';

const Subscription = () => {
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
          <p className="text-sm font-semibold">
            You are currently on <span className="font-extrabold">BASIC</span>{' '}
            plan
          </p>
          <p className="text-xs font-semibold text-[#949494]">
            Click on Upgrade plan below to change plan
          </p>
          {/* <p className="text-xs font-semibold text-[#949494]">
            You don’t have any active subscriptions
          </p> */}
        </div>
        <Button className="w-max self-end">Upgrade plan</Button>
      </div>
    </div>
  );
};

export default Subscription;
