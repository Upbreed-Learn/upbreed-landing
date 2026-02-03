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
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: '1',
    title: '6 Months',
  },
  {
    id: '2',
    title: '1 Year',
  },
];

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
  currency: z.string().min(1, 'You must select a currency to continue.'),
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
      currency: string;
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
      currency: string;
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
      plan: subscriptions ? `${subscriptions[3]?.id}` : '',
      currency: '',
    } as const as z.infer<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        recipientName: value.recipientName,
        recipientEmail: value.recipientEmail,
        planId: value.plan,
        currency: value.currency,
        callbackUrl: `${rootUrl}`,
      });
    },
  });

  useEffect(() => {
    if (subscriptions?.length > 0) {
      messageField.setValue(
        `I hope you enjoy your ${filterPlans(Number(subscriptions[3]?.id)).name} subscription at Upbreed Learn. This subscription gives you access for a period of 6 months. You have access to all our instructors, and what they teach. Happy Learning!`,
      );
    }
  }, [subscriptions]);

  const currencyField = useField({
    form,
    name: 'currency',
  });

  const planField = useField({
    form,
    name: 'plan',
  });

  const messageField = useField({
    form,
    name: 'message',
  });

  const filterPlans = (planId: number) => {
    const filteredPlans = subscriptions.filter(plan => plan.id === planId);
    return filteredPlans[0];
  };

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
              {currencyField.state.value !== '' && (
                <FieldDescription className="text-sm/6 font-medium">
                  Total Billed :{' '}
                  {currencyField.state.value === 'USD'
                    ? `$${Number(filterPlans(Number(planField.state.value)).amountUsd).toLocaleString()}`
                    : `₦${Number(filterPlans(Number(planField.state.value)).amountNaira).toLocaleString()}`}
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
                                messageField.setValue(
                                  `I hope you enjoy your ${filterPlans(Number(value)).period} subscription at Upbreed Learn. This subscription gives you access for a period of 6 months. You have access to all our instructors, and what they teach. Happy Learning!`,
                                ));
                            }}
                            className="flex items-center justify-end"
                          >
                            {subscriptions.slice(3, 5).map(plan => (
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
                                      {plan.period}
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
                  <form.Field
                    name="currency"
                    children={field => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <FieldSet>
                          <RadioGroup
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            className="flex items-center justify-end"
                          >
                            {[
                              { id: 1, currency: 'USD' },
                              { id: 2, currency: 'NGN' },
                            ].map(plan => (
                              <FieldLabel
                                key={plan.id}
                                htmlFor={`currency-${plan.id}`}
                                className="h-auto w-max! border-none bg-transparent! p-0!"
                              >
                                <Field
                                  orientation="horizontal"
                                  data-invalid={isInvalid}
                                  className="w-max flex-row-reverse"
                                >
                                  <FieldContent>
                                    <FieldTitle className="capitalize">
                                      {plan.currency}
                                    </FieldTitle>
                                  </FieldContent>
                                  <RadioGroupItem
                                    value={`${plan.currency}`}
                                    id={`currency-${plan.id}`}
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
