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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/lib/queries';
import { useDeviceFingerprint } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useUserEmailStore } from '@/store/useUserEmailStore';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderPinwheelIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import z from 'zod';

const formSchema = z.object({
  otp: z.string().min(5, {
    message: 'OTP must be at least 5 characters.',
  }),
});

const VerifyDialog = (props: {
  onStartTimer: () => void;
  formattedTime: string;
  timerRunning: boolean;
}) => {
  const [auth, setAuth] = useQueryState('auth');
  const { userEmail } = useUserEmailStore();
  const { onStartTimer, formattedTime, timerRunning } = props;
  const { data: deviceFingerprint } = useDeviceFingerprint();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useSendRequest<
    { email: string; otp: string; deviceSignature: string },
    { data: { token: string } }
  >({
    mutationFn: (data: {
      email: string;
      otp: string;
      deviceSignature: string;
    }) => MUTATIONS.authVerify(data),
    errorToast: {
      title: 'Error',
      description: 'Authentication failed',
    },
    successToast: {
      title: 'Success',
      description: 'Account verified successfully!',
    },
    cookie: {
      name: 'token',
      getValue: data => data.data.token,
    },
    onSuccessCallback: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.token });
      router.push('/student/home');
    },
  });

  const { mutate: resendMutation, isPending: resendPending } = useSendRequest<
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
      description: 'Authentication failed',
    },
    successToast: {
      title: 'Success',
      description: 'OTP sent successfully!',
    },
    onSuccessCallback: () => {
      onStartTimer();
    },
  });

  const handleResend = () => {
    resendMutation({
      email: userEmail!!,
      otpType: 'ACCOUNT_VERIFICATION',
    });
  };

  const form = useForm({
    defaultValues: {
      otp: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: userEmail!!,
        otp: value.otp,
        deviceSignature: deviceFingerprint!!,
      });
    },
  });

  const handleOpenChange = () => {
    setAuth(prev => (prev === 'verify' ? null : 'verify'));
  };
  return (
    <Dialog open={auth === 'verify'} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-font max-h-160 gap-6 overflow-auto px-16 py-9 sm:w-max">
        <DialogHeader className="sr-only">
          <DialogTitle>Verify Account</DialogTitle>
          <DialogDescription>
            Verify your account to access all the features of our platform.
          </DialogDescription>
        </DialogHeader>
        <form
          id="forgot-password"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-62.5 flex-col gap-6 text-black"
        >
          <FieldSet>
            <FieldLegend className="text-[10px]/[100%] font-semibold text-[#9B9B9B]">
              Verify Account
            </FieldLegend>
            <FieldDescription className="text-[10px]/[100%] font-semibold text-[#00230F]">
              Input the OTP sent to your email address.
            </FieldDescription>
            <FieldGroup>
              <form.Field
                name="otp"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <InputOTP
                        maxLength={6}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e)}
                        aria-invalid={isInvalid}
                      >
                        <InputOTPGroup className="w-full justify-center gap-3">
                          <InputOTPGroup className="basis-full">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator className="text-[#00230F]" />
                          <InputOTPGroup className="basis-full">
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTPGroup>
                      </InputOTP>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            {/* <Button>Verify Account</Button> */}
            <Button
              disabled={isPending}
              type="submit"
              className="transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <LoaderPinwheelIcon className="animate-spin" />
              ) : (
                'Verify Account'
              )}
            </Button>
            <p className="z-50 text-center text-sm/5 text-[#9B9B9B]">
              {resendPending ? (
                `Resending...`
              ) : (
                <>
                  {`Didn’t`} receive the code?{' '}
                  <button
                    type="button"
                    disabled={timerRunning}
                    onClick={handleResend}
                    className="cursor-pointer text-[#00230F] underline disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Resend
                    <span className="sr-only">
                      Resend the verification code
                    </span>
                  </button>{' '}
                  in {formattedTime}
                </>
              )}
            </p>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyDialog;
