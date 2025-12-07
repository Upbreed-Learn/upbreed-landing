'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Dispatch, SetStateAction, useState } from 'react';

const ChooseYourPlan = () => {
  const [tab, _] = useQueryState('plan', { defaultValue: 'annually' });
  const [level, setLevel] = useState('');

  return (
    <section className="flex justify-center bg-[#00230F] pb-6">
      <div className="flex w-full max-w-7xl flex-col gap-7 px-9 pt-12 text-white max-lg:items-center lg:gap-16 lg:px-18 xl:px-36.25">
        <div className="flex flex-col gap-6 max-lg:items-center max-lg:text-center xl:ml-13.5">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl/[100%] font-medium">Choose your plan</h2>
            <p className="text-xs/[100%] font-medium">
              All membership plans come with a 30 day satisfaction guarantee
            </p>
          </div>
          <PlanTabs />
        </div>
        <PlansDesktop tab={tab} level={level} setLevel={setLevel} />
        <PlansMobile tab={tab} level={level} setLevel={setLevel} />
      </div>
    </section>
  );
};

export default ChooseYourPlan;

const PlanTabs = () => {
  const [tab, setTab] = useQueryState('plan', { defaultValue: 'annually' });

  return (
    <Tabs value={tab} defaultValue="annually" onValueChange={setTab}>
      <TabsList className="h-10 rounded-[30px] bg-[#D0EA50] p-0">
        <TabsTrigger
          value="6-months"
          className="h-full rounded-[30px] px-7 text-xs/[100%] font-medium data-[state=active]:bg-[#305B43] data-[state=active]:text-white"
        >
          6 Months
        </TabsTrigger>
        <TabsTrigger
          value="annually"
          className="h-full rounded-[30px] px-7 text-xs/[100%] font-medium data-[state=active]:bg-[#305B43] data-[state=active]:text-white"
        >
          Annually
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const PlansDesktop = (props: {
  tab: string;
  level: string;
  setLevel: Dispatch<SetStateAction<string>>;
}) => {
  const { tab, level, setLevel } = props;

  return (
    <div className="relative flex flex-col gap-29.25 max-lg:hidden">
      <ul className="text-xs/[100%] font-medium [&>li]:border-b [&>li]:border-[#305B43] [&>li]:py-7 [&>li]:pl-13.5 [&>li]:last:border-none">
        <li>Monthly Price ( billed half-year and annually)</li>
        <li>Download for Offline viewing</li>
        <li>All 200+ classes acrross 11 categories</li>
        <li>
          Access to Sessions by UPBREED <br /> Learn by doing in just 30 days.
        </li>
        <li>Watch on your computer, TV, Phone or tablet</li>
        <li>Bonus class guides & content</li>
      </ul>
      <PlanSpecCard
        plan="Standard"
        onClick={setLevel}
        selected={level}
        device="1 Device"
        offline="No Offline mode"
        monthlyPrice={tab === 'annually' ? '$60' : '$30'}
        download="No"
      />
      <PlanSpecCard
        className="right-20"
        onClick={setLevel}
        selected={level}
        plan="Premium"
        device="2 Devices"
        offline="Offline mode"
        monthlyPrice={tab === 'annually' ? '$120' : '$60'}
        download="Yes"
        allClasses="text-transparent"
        accessSessions="Check"
        watch="Check"
      />
      <Button className="w-3/5 self-center">Continue</Button>
    </div>
  );
};

const PlansMobile = (props: {
  tab: string;
  level: string;
  setLevel: Dispatch<SetStateAction<string>>;
}) => {
  const { tab, level, setLevel } = props;

  return (
    <div className="flex w-full max-w-96 flex-col gap-12 lg:hidden">
      <div className="flex justify-between text-center">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4.5 text-white">
            <p className="font-semibold">Standard</p>
            <div
              className={cn(
                'flex flex-col gap-4',
                level === 'standard' && 'text-[#D0EA50]',
              )}
            >
              <p className="text-sm/[100%] font-medium">1 Device</p>
              <p className="text-xs/[100%] font-medium">No Offline mode</p>
            </div>
          </div>
          <Button
            onClick={() => setLevel('standard')}
            className={cn(
              'w-24.25 border border-[#305B43] bg-transparent text-white',
              level === 'standard' &&
                'border-transparent bg-[#D0EA50] text-black',
            )}
          >
            {level === 'standard' ? 'Selected' : 'Select'}
          </Button>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4.5 text-white">
            <p className="font-semibold">Premium</p>
            <div
              className={cn(
                'flex flex-col gap-4',
                level === 'premium' && 'text-[#D0EA50]',
              )}
            >
              <p className="text-sm/[100%] font-medium">2 Devices</p>
              <p className="text-xs/[100%] font-medium">Offline mode</p>
            </div>
          </div>
          <Button
            onClick={() => setLevel('premium')}
            className={cn(
              'w-24.25 border border-[#305B43] bg-transparent text-white',
              level === 'premium' &&
                'border-transparent bg-[#D0EA50] text-black',
            )}
          >
            {level === 'premium' ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-sm/[100%] font-medium">
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            <p className={cn(level === 'standard' && 'text-[#D0EA50]')}>
              {tab === 'annually' ? '$60' : '$30'}
            </p>
            <p className={cn(level === 'premium' && 'text-[#D0EA50]')}>
              {tab === 'annually' ? '$120' : '$60'}
            </p>
          </div>
          <p className="text-center text-xs">Monthly Price (billed annually)</p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            <p className={cn(level === 'standard' && 'text-[#D0EA50]')}>No</p>
            <p className={cn(level === 'premium' && 'text-[#D0EA50]')}>Yes</p>
          </div>
          <p className="text-center text-xs">Download for Offline viewing</p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            <Check
              className={cn(
                level === 'standard' ? 'text-[#D0EA50]' : 'text-white',
              )}
            />
          </div>
          <p className="text-center text-xs">
            All 200+ classes acrross 11 categories
          </p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            <Check
              className={cn(
                level === 'standard' ? 'text-[#D0EA50]' : 'text-white',
              )}
            />
            <Check
              className={cn(
                level === 'premium' ? 'text-[#D0EA50]' : 'text-white',
              )}
            />
          </div>
          <p className="text-center text-xs">
            Watch on your computer, TV, Phone or tablet
          </p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            <Check
              className={cn(
                level === 'standard' ? 'text-[#D0EA50]' : 'text-white',
              )}
            />
            <Check
              className={cn(
                level === 'premium' ? 'text-[#D0EA50]' : 'text-white',
              )}
            />
          </div>
          <p className="text-center text-xs">Bonus class guides & content</p>
        </div>
        <Button>Continue</Button>
      </div>
    </div>
  );
};

const PlanSpecCard = (props: {
  className?: string;
  plan: string;
  device: string;
  offline: string;
  btnClassName?: string;
  monthlyPrice: string;
  download: string;
  allClasses?: string;
  accessSessions?: string;
  watch?: string;
  onClick: Dispatch<SetStateAction<string>>;
  selected: string;
}) => {
  const {
    className,
    plan,
    device,
    offline,
    btnClassName,
    monthlyPrice,
    download,
    allClasses,
    accessSessions,
    watch,
    onClick,
    selected,
  } = props;
  return (
    <ul
      className={cn(
        'group absolute -top-40 right-80 flex flex-col items-center bg-transparent px-10 pt-4 pb-18 text-xs/[100%] font-semibold transition-colors hover:bg-[#305B43]',
        className,
      )}
    >
      <li className="pb-4.5 font-semibold!">{plan}</li>
      <li className="pb-4">{device}</li>
      <li className="pb-5">{offline}</li>
      <li className="pb-12">
        <Button
          onClick={() => onClick(plan.toLowerCase())}
          className={cn(
            'h-8.5 w-24.25 rounded border border-[#305B43] bg-transparent text-white group-hover:border-transparent hover:bg-[#D0EA50] hover:text-black',
            btnClassName,
            selected === plan.toLowerCase() &&
              'border-transparent bg-[#D0EA50] text-black',
          )}
        >
          {selected === plan.toLowerCase() ? 'Selected' : 'Select'}
        </Button>
      </li>
      <li className="pb-12 text-xl leading-[100%] font-semibold text-[#D0EA50] group-hover:text-white">
        {monthlyPrice}
      </li>
      <li className="pb-12">{download}</li>
      <li className="pb-12">
        <Check className={cn('text-white', allClasses)} />
      </li>
      <li className="pb-12">
        <Check className={cn('text-white', accessSessions)} />
      </li>
      <li className="pb-12">
        <Check className={cn('text-white', watch)} />
      </li>
    </ul>
  );
};
