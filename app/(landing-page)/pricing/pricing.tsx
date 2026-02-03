'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/custom/skeleton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Subscription, UserProfileType } from '@/lib/constants';
import useSendRequest, {
  errorToastClassName,
} from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/lib/queries';
import {
  useGetSubscriptions,
  useGetToken,
  useGetUserProfile,
} from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

const ChooseYourPlan = () => {
  const [tab, _] = useQueryState('plan', { defaultValue: 'annually' });
  const [subChoice, setSubChoice] = useState<Subscription | null>(null);

  return (
    <section className="flex justify-center bg-[#00230F] pb-6">
      <div className="_max-w-7xl flex w-full flex-col gap-7 px-9 pt-12 text-white max-lg:items-center lg:gap-16 lg:px-18 xl:px-36.25">
        <div className="flex flex-col gap-6 max-lg:items-center max-lg:text-center xl:ml-13.5">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl/[100%] font-medium">Choose your plan</h2>
            <p className="text-xs/[100%] font-medium">
              All membership plans come with a 30 day satisfaction guarantee
            </p>
          </div>
          <PlanTabs />
          <CurrencyTabs />
        </div>
        <PlansDesktop tab={tab} level={subChoice} setLevel={setSubChoice} />
        <PlansMobile level={subChoice} setLevel={setSubChoice} />
      </div>
    </section>
  );
};

export default ChooseYourPlan;

const PlanTabs = () => {
  const { data, isPending, isError } = useGetSubscriptions();
  const subscriptions: Subscription[] = data?.data.data;

  const [tab, setTab] = useQueryState('plan', {
    defaultValue: subscriptions?.[0]?.period,
  });

  if (isPending)
    return (
      <div className="h-10 w-52 animate-pulse rounded-[30px] bg-white/40"></div>
    );

  if (isError)
    return (
      <div>
        <p className="text-destructive">
          Error fetching subscriptions. Please try again later.
        </p>
      </div>
    );

  return (
    <Tabs
      value={tab}
      defaultValue={tab}
      onValueChange={setTab}
      className={cn(isError && 'hidden')}
    >
      <TabsList className="h-10 rounded-[30px] bg-[#D0EA50] p-0">
        {subscriptions?.slice(5, 7).map(subscription => (
          <TabsTrigger
            key={subscription.id}
            value={subscription.period}
            className="h-full rounded-[30px] px-7 text-xs/[100%] font-medium capitalize data-[state=active]:bg-[#305B43] data-[state=active]:text-white"
          >
            {subscription.period}
          </TabsTrigger>
        ))}
        {/* <TabsTrigger
          value="annually"
          className="h-full rounded-[30px] px-7 text-xs/[100%] font-medium data-[state=active]:bg-[#305B43] data-[state=active]:text-white"
        >
          Annually
        </TabsTrigger> */}
      </TabsList>
    </Tabs>
  );
};

const CurrencyTabs = () => {
  const [tab, setTab] = useQueryState('currency', {
    defaultValue: 'USD',
  });

  return (
    <Tabs value={tab} defaultValue={tab} onValueChange={setTab}>
      <TabsList className="h-10 rounded-[30px] bg-[#D0EA50] p-0">
        <TabsTrigger
          value={'USD'}
          className="h-full rounded-[30px] px-7 text-xs/[100%] font-medium capitalize data-[state=active]:bg-[#305B43] data-[state=active]:text-white"
        >
          USD
        </TabsTrigger>
        <TabsTrigger
          value={'NGN'}
          className="h-full rounded-[30px] px-7 text-xs/[100%] font-medium data-[state=active]:bg-[#305B43] data-[state=active]:text-white"
        >
          NGN
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const PlansDesktop = (props: {
  tab: string;
  level: Subscription | null;
  setLevel: Dispatch<SetStateAction<Subscription | null>>;
}) => {
  const { level, setLevel } = props;
  const [currency, __] = useQueryState('currency', {
    defaultValue: 'USD',
  });
  const { data: subscriptionData, isPending: isSubscriptionPending } =
    useGetSubscriptions();
  const subscriptions: Subscription[] = subscriptionData?.data.data;

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
      {isSubscriptionPending ? (
        <>
          <div
            className={cn(
              'group absolute -top-40 right-80 flex h-151 w-44.25 animate-pulse flex-col items-center bg-white/40 px-10 pt-4 pb-18 text-xs/[100%] font-semibold transition-colors',
            )}
          ></div>
          <div
            className={cn(
              'group absolute -top-40 right-20 flex h-151 w-44.25 animate-pulse flex-col items-center bg-white/40 px-10 pt-4 pb-18 text-xs/[100%] font-semibold transition-colors',
            )}
          ></div>
        </>
      ) : (
        subscriptions
          ?.slice(5, 7)
          .map((subscription, i) => (
            <PlanSpecCard
              key={i}
              className={cn(i === 1 && 'right-20')}
              plan={subscription}
              onClick={() => setLevel(subscription)}
              selected={level}
              device={`${subscription.noDevices} Device${subscription.noDevices > 1 ? 's' : ''}`}
              offline="No Offline mode"
              monthlyPrice={
                currency === 'USD'
                  ? `$${subscription.amountUsd}`
                  : `₦${subscription.amountNaira}`
              }
              download="No"
            />
          ))
      )}
      <SubscriptionNotice level={level}>
        <Button className="w-3/5 self-center">Continue</Button>
      </SubscriptionNotice>
    </div>
  );
};

const PlansMobile = (props: {
  level: Subscription | null;
  setLevel: Dispatch<SetStateAction<Subscription | null>>;
}) => {
  const { level, setLevel } = props;
  const [currency, __] = useQueryState('currency', {
    defaultValue: 'USD',
  });
  const { data: subscriptionData, isPending: isSubscriptionPending } =
    useGetSubscriptions();
  const subscriptions: Subscription[] = subscriptionData?.data.data;

  if (isSubscriptionPending) return <SubscriptionMobileLoading />;

  return (
    <div className="flex w-full max-w-96 flex-col gap-12 lg:hidden">
      <div className="flex justify-between text-center">
        {subscriptions?.slice(5, 7)?.map((subscription, i) => (
          <div key={i} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4.5 text-white">
              <p className="font-semibold capitalize">{subscription.name}</p>
              <div
                className={cn(
                  'flex flex-col gap-4',
                  level?.id === subscription.id && 'text-[#D0EA50]',
                )}
              >
                <p className="text-sm/[100%] font-medium">
                  {subscription.noDevices} Device
                  {subscription.noDevices > 1 ? 's' : ''}
                </p>
                <p className="text-xs/[100%] font-medium">No Offline mode</p>
              </div>
            </div>
            <Button
              onClick={() => setLevel(subscription)}
              className={cn(
                'w-24.25 border border-[#305B43] bg-transparent text-white',
                level?.id === subscription.id &&
                  'border-transparent bg-[#D0EA50] text-black',
              )}
            >
              {level?.id === subscription.id ? 'Selected' : 'Select'}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 text-sm/[100%] font-medium">
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            {subscriptions?.slice(5, 7)?.map((subscription, i) => (
              <p
                key={i}
                className={cn(
                  level?.id === subscription.id && 'text-[#D0EA50]',
                )}
              >
                {currency === 'USD'
                  ? `$${Number(subscription.amountUsd).toLocaleString()}`
                  : `₦${Number(subscription.amountNaira).toLocaleString()}`}
              </p>
            ))}
          </div>
          <p className="text-center text-xs">Monthly Price (billed annually)</p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            {subscriptions?.slice(5, 7)?.map((subscription, i) => (
              <p
                key={i}
                className={cn(
                  level?.id === subscription.id && 'text-[#D0EA50]',
                )}
              >
                No
              </p>
            ))}
          </div>
          <p className="text-center text-xs">Download for Offline viewing</p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            <Check
              className={cn(
                level?.id === subscriptions[0]?.id
                  ? 'text-[#D0EA50]'
                  : 'text-white',
              )}
            />
          </div>
          <p className="text-center text-xs">
            All 200+ classes acrross 11 categories
          </p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            {subscriptions?.slice(5, 7)?.map((subscription, i) => (
              <Check
                key={i}
                className={cn(
                  level?.id === subscription.id
                    ? 'text-[#D0EA50]'
                    : 'text-white',
                )}
              />
            ))}
          </div>
          <p className="text-center text-xs">
            Watch on your computer, TV, Phone or tablet
          </p>
        </div>
        <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
          <div className="flex items-center justify-between px-8">
            {subscriptions?.slice(5, 7)?.map((subscription, i) => (
              <Check
                key={i}
                className={cn(
                  level?.id === subscription.id
                    ? 'text-[#D0EA50]'
                    : 'text-white',
                )}
              />
            ))}
          </div>
          <p className="text-center text-xs">Bonus class guides & content</p>
        </div>
        <SubscriptionNotice level={level}>
          <Button>Continue</Button>
        </SubscriptionNotice>
      </div>
    </div>
  );
};

const PlanSpecCard = (props: {
  className?: string;
  plan: Subscription;
  device: string;
  offline: string;
  btnClassName?: string;
  monthlyPrice: string;
  download: string;
  allClasses?: string;
  accessSessions?: string;
  watch?: string;
  onClick: () => void;
  selected: Subscription | null;
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
      <li className="pb-4.5 font-semibold! capitalize">{plan.name}</li>
      <li className="pb-4">{device}</li>
      <li className="pb-5">{offline}</li>
      <li className="pb-12">
        <Button
          onClick={onClick}
          className={cn(
            'h-8.5 w-24.25 rounded border border-[#305B43] bg-transparent text-white group-hover:border-transparent hover:bg-[#D0EA50] hover:text-black',
            btnClassName,
            selected?.id === plan.id &&
              'border-transparent bg-[#D0EA50] text-black',
          )}
        >
          {selected?.id === plan.id ? 'Selected' : 'Select'}
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

const SubscriptionNotice = (props: {
  children: React.ReactNode;
  level: Subscription | null;
}) => {
  const { children, level } = props;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [_, setAuth] = useQueryState('auth');
  const [currency, __] = useQueryState('currency', {
    defaultValue: 'USD',
  });
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;
  const { data } = useGetUserProfile(token);
  const userProfile: UserProfileType = data?.data.data;
  const rootUrl = typeof window !== 'undefined' && window.location.origin;
  const router = useRouter();

  const { mutate, isPending } = useSendRequest<
    {
      planId: number;
      currency: string;
      email: string;
      callbackUrl: string;
    },
    {
      data: {
        reference: string;
        amount: string;
        currency: string;
        provider: string;
        plan: {
          id: number;
          name: string;
          period: string;
          noDevices: number;
          paystackPlanCode: string;
        };
        authorizationUrl: string;
        accessCode: string;
      };
    }
  >({
    mutationFn: (data: {
      planId: number;
      currency: string;
      email: string;
      callbackUrl: string;
    }) => MUTATIONS.initiateSubscription(data),
    successToast: {
      title: 'Success',
      description: 'Your subscription has been created successfully.',
    },
    errorToast: {
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
    },
    onSuccessCallback: data => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.current(),
      });
      {
        data?.data.authorizationUrl && router.push(data?.data.authorizationUrl);
      }
      setOpen(false);
    },
  });

  const handleSubscription = () => {
    if (!level) {
      toast.error(`Cannot subscribe!`, {
        description: 'Please select a plan.',
        className: errorToastClassName,
      });
      return;
    }
    if (!token) {
      setAuth('login');
      return;
    } else {
      mutate({
        planId: level?.id!!,
        currency: currency,
        email: userProfile.email,
        callbackUrl: `${rootUrl}/student/courses`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You are about to make payment for your subscription. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
          <Button
            className="disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            onClick={handleSubscription}
          >
            {isPending ? 'Loading...' : 'Subscribe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SubscriptionColumnSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4.5">
        <Skeleton className="mx-auto h-4 w-16" />
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-9 w-24.25 rounded-md" />
    </div>
  );
};

const FeatureRowSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 border-b-[0.6px] border-[#FFFFFF1A] pb-3">
      <div className="flex items-center justify-between px-8">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="mx-auto h-3 w-48" />
    </div>
  );
};

const SubscriptionMobileLoading = () => {
  return (
    <div className="pointer-events-none flex w-full max-w-96 flex-col gap-12 lg:hidden">
      {/* Top plans */}
      <div className="flex justify-between text-center">
        <SubscriptionColumnSkeleton />
        <SubscriptionColumnSkeleton />
      </div>

      {/* Feature comparison */}
      <div className="flex flex-col gap-4 text-sm/[100%] font-medium">
        <FeatureRowSkeleton />
        <FeatureRowSkeleton />
        <FeatureRowSkeleton />
        <FeatureRowSkeleton />
        <FeatureRowSkeleton />

        {/* Continue button */}
        <Skeleton className="mt-2 h-10 w-full rounded-md" />
      </div>
    </div>
  );
};
