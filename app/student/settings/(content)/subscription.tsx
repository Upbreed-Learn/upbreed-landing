import { Button } from '@/components/ui/button';
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
import { CurrentSubscription, type Subscription } from '@/lib/constants';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/lib/queries';
import { useGetCurrentSubscription } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const fmtDate = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(iso));

const Subscription = () => {
  const { data, isPending } = useGetCurrentSubscription();
  const subscriptions: CurrentSubscription[] = data?.data ?? [];
  const router = useRouter();
  const current = subscriptions[0];
  const active = current?.status === 'ACTIVE';
  const cancelled = current?.status === 'CANCELLED';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Subscription</h1>
        <p className="text-sm text-[#737373]">Manage your Upbreed Learn membership.</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-[#F2F2F2] px-6 py-12 text-center">
        {isPending ? (
          <p className="text-sm text-[#949494]">Loading…</p>
        ) : !current ? (
          <>
            <p className="text-sm font-semibold">You don&apos;t have a membership yet</p>
            <p className="text-xs text-[#949494]">Subscribe to watch every class.</p>
            <Button className="mt-2" onClick={() => router.push('/pricing')}>
              See plans
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">
              You are on the <span className="font-extrabold">{current.plan.name}</span> plan
            </p>
            <p className="text-xs text-[#737373]">
              {active
                ? `Renews on ${fmtDate(current.expiresAt)}`
                : cancelled
                  ? `Cancelled — you can still watch until ${fmtDate(current.expiresAt)}`
                  : `Access until ${fmtDate(current.expiresAt)}`}
            </p>
          </>
        )}
      </div>
      {current && (
        <div className="flex flex-wrap justify-end gap-4">
          <Button onClick={() => router.push('/pricing')} className="w-max">
            {cancelled ? 'Resubscribe' : 'Change plan'}
          </Button>
          {active && <CancelSubscriptionDialog />}
        </div>
      )}
    </div>
  );
};

export default Subscription;

const CancelSubscriptionDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useSendRequest({
    mutationFn: MUTATIONS.cancelSubscription,
    successToast: {
      title: 'Success',
      description: 'Subscriptions cancelled successfully!',
    },
    errorToast: {
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
    },
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.current(),
      });
      setOpen(false);
    },
  });

  const handleCancel = () => {
    mutate({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} className="w-max self-end">
          Cancel subscription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel subscription?</DialogTitle>
          <DialogDescription>
            Auto-renewal will stop. You can keep watching until the end of the
            period you have paid for.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="w-max self-end">
              Keep it
            </Button>
          </DialogClose>
          <Button
            className="w-max self-end"
            variant={'destructive'}
            disabled={isPending}
            onClick={handleCancel}
          >
            {isPending ? 'Loading...' : 'Cancel subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
