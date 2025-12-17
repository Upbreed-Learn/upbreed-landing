import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/lib/queries';
import { useUserEmailStore } from '@/store/useUserEmailStore';
import { useForm } from '@tanstack/react-form';
import { ArrowLeft, LoaderPinwheelIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import z from 'zod';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
});

const ForgotPasswordDialog = (props: { onStartTimer: () => void }) => {
  const [auth, setAuth] = useQueryState('auth');
  const { setUserEmail } = useUserEmailStore();
  const { onStartTimer } = props;

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
      onStartTimer();
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

  const handleOpenChange = () => {
    setAuth(prev => (prev === 'forgot-password' ? null : 'forgot-password'));
  };

  const handleBack = () => {
    setAuth('login');
  };

  return (
    <Dialog open={auth === 'forgot-password'} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-font max-h-160 gap-6 overflow-auto px-6 py-9 sm:w-max md:px-16">
        <DialogHeader className="sr-only">
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Reset your password to access all the features of our platform.
          </DialogDescription>
        </DialogHeader>
        <form
          id="forgot-password"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-col gap-6 text-black md:w-62.5"
        >
          <button type="button" onClick={handleBack} className="w-max">
            <ArrowLeft />
          </button>
          <FieldSet>
            <FieldLegend className="text-[10px]/[100%] font-semibold text-[#9B9B9B]">
              Forgot Password
            </FieldLegend>
            <FieldDescription className="text-[10px]/[100%] font-semibold text-[#00230F]">
              Request Verification Code
            </FieldDescription>
            <FieldGroup>
              <form.Field
                name="email"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <LoaderPinwheelIcon className="animate-spin" />
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
