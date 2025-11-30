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
import { useField, useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import z from 'zod';

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
});

const Gifts = (props: { children?: React.ReactNode }) => {
  const { children } = props;
  const form = useForm({
    defaultValues: {
      recipientName: '',
      recipientEmail: '',
      yourName: '',
      yourEmail: '',
      message: '',
      plan: '',
    } as const as z.infer<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const planField = useField({
    form,
    name: 'plan',
  });

  const messageField = useField({
    form,
    name: 'message',
  });

  useEffect(() => {
    if (planField.state.value === '6 Months') {
      messageField.setValue(
        'I hope you enjoy your first 6 months at Upbreed Learn. This subscription gives you access for a period of 6 months. You have access to all our instructors, and what they teach. Happy Learning!',
      );
    } else if (planField.state.value === '1 Year') {
      messageField.setValue(
        'I hope you enjoy your first year at Upbreed Learn. This subscription gives you access for a period of 1 year. You have access to all our instructors, and what they teach. Happy Learning!',
      );
    }
  }, [planField.state.value]);

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer hover:text-[#D0EA50]">
        {children}
      </DialogTrigger>
      <DialogContent>
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
              <FieldDescription className="text-sm/6 font-medium">
                Total Billed :{' '}
                {planField.state.value === '6 Months' ? '$60' : '$120'}
              </FieldDescription>
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
                        onValueChange={field.handleChange}
                        className="flex items-center justify-end"
                      >
                        {plans.map(plan => (
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
                                <FieldTitle>{plan.title}</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value={plan.title}
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
            </FieldGroup>
          </FieldGroup>
          <Button className="h-12 rounded-lg">Send Gift</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Gifts;
