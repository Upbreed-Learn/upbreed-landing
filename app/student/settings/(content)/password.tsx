import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useSendRequest from '@/lib/hooks/useSendRequest';
import useTimer from '@/lib/hooks/useTimer';
import { MUTATIONS } from '@/lib/queries';
import { useUserEmailStore } from '@/store/useUserEmailStore';
import { useForm } from '@tanstack/react-form';
import { LoaderPinwheelIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import z from 'zod';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
});

const Password = () => {
  const [_, setAuth] = useQueryState('auth');
  const { setUserEmail } = useUserEmailStore();
  const { handleStartTimer } = useTimer(30);
  const { mutate, isPending } = useSendRequest<
    {
      email: string;
      otpType: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION';
    },
    any
  >({
    mutationFn: (data: {
      email: string;
      otpType: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION';
    }) => MUTATIONS.authRequestOtp(data),
    errorToast: {
      title: 'Error',
      description: 'Request failed! Please try again.',
    },
    successToast: {
      title: 'Success',
      description: 'OTP sent successfully!',
    },
    onSuccessCallback: () => {
      handleStartTimer();
      setAuth('reset-password');
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          email: value.email,
          otpType: 'PASSWORD_RESET',
        },
        {
          onSuccess: () => {
            setUserEmail(value.email);
          },
        },
      );
    },
  });

  return (
    <form
      id="request-verification-code"
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex w-full max-w-117.25 flex-col gap-6"
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel className="text-xs/[100%] font-semibold">
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  type="email"
                  placeholder="Email"
                  className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button disabled={isPending} type="submit">
        {isPending ? (
          <LoaderPinwheelIcon className="animate-spin" />
        ) : (
          'Reset password'
        )}
      </Button>
    </form>
  );
};

export default Password;
