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
import { Activity, useState } from 'react';

const Subscription = () => {
  const { data } = useGetCurrentSubscription();
  const subscriptions: CurrentSubscription[] = data?.data;
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
          <Activity
            mode={
              subscriptions?.[0].status !== 'CANCELLED' ? 'visible' : 'hidden'
            }
          >
            <p className="text-sm font-semibold">
              You are currently on{' '}
              <span className="font-extrabold">
                {subscriptions?.[0]?.plan.name}
              </span>{' '}
              plan
            </p>
            <p className="text-xs font-semibold text-[#949494]">
              Click on Upgrade plan below to change plan
            </p>
          </Activity>
          <Activity
            mode={
              subscriptions?.[0].status === 'CANCELLED' ? 'visible' : 'hidden'
            }
          >
            <p className="text-xs font-semibold text-[#949494]">
              You don’t have any active subscriptions
            </p>
          </Activity>
        </div>
        <Activity
          mode={
            subscriptions?.[0].status !== 'CANCELLED' ? 'visible' : 'hidden'
          }
        >
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => router.push('/pricing')}
              className="w-max self-end"
            >
              Upgrade plan
            </Button>
            <CancelSubscriptionDialog />
          </div>
        </Activity>
      </div>
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
          Cancel subscriptions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscriptions</DialogTitle>
          <DialogDescription>
            You're about to cancel your subscriptions. This action cannot be
            undone. You will be unable to access your content until you
            resubscribe.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="w-max self-end">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-max self-end"
            variant={'destructive'}
            disabled={isPending}
            onClick={handleCancel}
          >
            {isPending ? 'Loading...' : 'Cancel Subscriptions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
