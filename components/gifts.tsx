import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Subscription } from '@/lib/constants';
import { useGetSubscriptions } from '@/lib/queries/hooks';
import { useField, useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import z from 'zod';
import { Skeleton } from './ui/custom/skeleton';
import { MUTATIONS } from '@/lib/queries';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { formatPrice, type Period } from '@/lib/pricing';
import { useRouter } from 'next/navigation';

const GIFT_PERIODS = [
  { id: 'biannually', title: '6 Months' },
  { id: 'annually', title: '1 Year' },
] as const;

const giftMessage = (period: string) =>
  `I hope you enjoy your ${period === 'annually' ? '1-year' : '6-month'} subscription at Upbreed Learn. It gives you access to all our instructors and what they teach for ${period === 'annually' ? 'a whole year' : '6 months'}. Happy Learning!`;

const formSchema = z.object({
  recipientName: z.string().min(2, { message: 'First name is required' }),
  recipientEmail: z.email({
    message: 'Please enter a valid email address.',
  }),
  yourName: z.string().min(2, { message: 'Last name is required' }),
  yourEmail: z.email({
    message: 'Please enter a valid email address.',
  }),
  message: z
    .string()
    .min(10, { message: 'Message should be at least 10 characters' }),
  plan: z.string().min(1, 'You must select a subscription plan to continue.'),
  currency: z.string().optional(),
});

const Gifts = (props: { children?: React.ReactNode }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);

  const { data, isPending } = useGetSubscriptions();
  const subscriptions: Subscription[] = data?.data.data;
  const rootUrl = typeof window !== 'undefined' && window.location.origin;
  const router = useRouter();

  const { mutate, isPending: isPendingGift } = useSendRequest<
    {
      recipientName: string;
      recipientEmail: string;
      planId: string;
      period?: string;
      currency?: string;
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
      recipientName: string;
      recipientEmail: string;
      planId: string;
      period?: string;
      currency?: string;
      callbackUrl: string;
    }) => MUTATIONS.giftSubscription(data),
    successToast: {
      title: 'Success',
      description: 'Your gift has been sent successfully.',
    },
    errorToast: {
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
    },
    onSuccessCallback: data => {
      setOpen(false);
      {
        data?.data.authorizationUrl && router.push(data?.data.authorizationUrl);
      }
    },
  });

  const form = useForm({
    defaultValues: {
      recipientName: '',
      recipientEmail: '',
      yourName: '',
      yourEmail: '',
      message: '',
      plan: 'biannually',
      currency: '',
    } as const as z.infer<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        recipientName: value.recipientName,
        recipientEmail: value.recipientEmail,
        planId: `${giftPlan?.id ?? ''}`,
        period: value.plan,
        callbackUrl: `${rootUrl}`,
      });
    },
  });

  useEffect(() => {
    if (subscriptions?.length > 0) {
      messageField.setValue(
        giftMessage('biannually'),
      );
    }
  }, [subscriptions]);

  const planField = useField({
    form,
    name: 'plan',
  });

  const messageField = useField({
    form,
    name: 'message',
  });

  // Gifts are a 6-month or 1-year subscription of the first plan on sale, priced for the gifter's region.
  const giftPlan = subscriptions?.find(plan => plan.periods?.biannually || plan.periods?.annually);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer hover:text-[#D0EA50]">
        {children}
      </DialogTrigger>
      <DialogContent className="z-100">
        <DialogHeader className="sr-only">
          <DialogTitle>Gifts</DialogTitle>
          <DialogDescription>
            Gifts are a great way to show your appreciation for our services.
          </DialogDescription>
        </DialogHeader>
        <form
          id="gifts-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex basis-full flex-col gap-6"
        >
          <FieldGroup className="gap-2">
            <FieldSet>
              <FieldLegend className="text-xl font-semibold text-[#305B43]">
                UPBREED LEARN
              </FieldLegend>
              {giftPlan?.periods?.[planField.state.value as Period] && (
                <FieldDescription className="text-sm/6 font-medium">
                  Total Billed : {formatPrice(giftPlan.periods[planField.state.value as Period])}
                </FieldDescription>
              )}
            </FieldSet>
            <FieldGroup className="">
              <form.Field
                name="recipientName"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-4">
                      <FieldSet className="flex-row gap-0">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Recipient Name"
                          className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                        />
                      </FieldSet>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="recipientEmail"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-4">
                      <FieldSet className="flex-row gap-0">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="email"
                          placeholder="Recipient Email"
                          className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                        />
                      </FieldSet>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="yourName"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-4">
                      <FieldSet className="flex-row gap-0">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Your Name"
                          className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                        />
                      </FieldSet>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="yourEmail"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-4">
                      <FieldSet className="flex-row gap-0">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="email"
                          placeholder="Your Email"
                          className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                        />
                      </FieldSet>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="message"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-4">
                      <FieldSet className="flex-row gap-0">
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Message"
                          className="h-[12ch] w-full resize-y rounded-lg border-[#9B9B9B] bg-[#f5f5f5] font-semibold text-black"
                        />
                      </FieldSet>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              {isPending ? (
                <Skeleton className="h-[52px] w-full rounded-lg border-[#9B9B9B] bg-[#f5f5f5] font-semibold text-black" />
              ) : (
                <FieldSet className="gap-0">
                  <form.Field
                    name="plan"
                    children={field => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <FieldSet>
                          <RadioGroup
                            name={field.name}
                            value={field.state.value}
                            onValueChange={value => {
                              (field.handleChange(value),
                                messageField.setValue(giftMessage(value)));
                            }}
                            className="flex items-center justify-end"
                          >
                            {GIFT_PERIODS.filter(p => giftPlan?.periods?.[p.id]).map(plan => (
                              <FieldLabel
                                key={plan.id}
                                htmlFor={`form-tanstack-radiogroup-${plan.id}`}
                                className="h-auto w-max! border-none bg-transparent! p-0!"
                              >
                                <Field
                                  orientation="horizontal"
                                  data-invalid={isInvalid}
                                  className="w-max flex-row-reverse"
                                >
                                  <FieldContent>
                                    <FieldTitle className="capitalize">
                                      {plan.title}
                                    </FieldTitle>
                                  </FieldContent>
                                  <RadioGroupItem
                                    value={`${plan.id}`}
                                    id={`form-tanstack-radiogroup-${plan.id}`}
                                    aria-invalid={isInvalid}
                                  />
                                </Field>
                              </FieldLabel>
                            ))}
                          </RadioGroup>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldSet>
                      );
                    }}
                  />
                </FieldSet>
              )}
            </FieldGroup>
          </FieldGroup>
          <Button
            disabled={isPendingGift}
            className="h-12 rounded-lg disabled:opacity-50"
          >
            {isPendingGift ? 'Sending gift...' : 'Send Gift'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Gifts;
