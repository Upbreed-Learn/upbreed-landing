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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { deleteToken } from '@/lib/actions';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/lib/queries';
import { queryKeys } from '@/lib/queries/query-keys';
import { cn } from '@/lib/utils';
import { useUserEmailStore } from '@/store/useUserEmailStore';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Eye, EyeOff, LoaderPinwheelIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useReducer } from 'react';
import z from 'zod';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character.',
      }),
    confirmPassword: z.string(),
    otp: z.string().min(5, {
      message: 'OTP must be at least 5 characters.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordViewState = {
  password: string;
  confirmPassword: string;
};

type Action = {
  type: keyof PasswordViewState;
};

export const passwordViewReducer = (
  state: PasswordViewState,
  action: Action,
): PasswordViewState => {
  const currentType = state[action.type];
  return {
    ...state,
    [action.type]: currentType === 'password' ? 'text' : 'password',
  };
};

const checks = [
  {
    key: 'length',
    label: 'At least 8 characters',
    ok: (pw: string) => (pw || '').length >= 8,
  },
  {
    key: 'upper',
    label: 'At least 1 uppercase letter',
    ok: (pw: string) => /[A-Z]/.test(pw || ''),
  },
  {
    key: 'lower',
    label: 'At least 1 lowercase letter',
    ok: (pw: string) => /[a-z]/.test(pw || ''),
  },
  {
    key: 'number',
    label: 'At least 1 number',
    ok: (pw: string) => /\d/.test(pw || ''),
  },
  {
    key: 'special',
    label: 'At least 1 special character',
    ok: (pw: string) => /[^A-Za-z0-9]/.test(pw || ''),
  },
];

const ResetPassword = (props: {
  onStartTimer: () => void;
  formattedTime: string;
  timerRunning: boolean;
}) => {
  const [auth, setAuth] = useQueryState('auth');
  const { onStartTimer, formattedTime, timerRunning } = props;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [passwordView, dispatch] = useReducer(passwordViewReducer, {
    password: 'password',
    confirmPassword: 'password',
  });

  const { userEmail } = useUserEmailStore();

  const { mutate, isPending } = useSendRequest<
    { email: string; password: string; otp: string },
    any
  >({
    mutationFn: (data: { email: string; password: string; otp: string }) =>
      MUTATIONS.authPasswordReset(data),
    errorToast: {
      title: 'Error',
      description: 'Authentication failed',
    },
    successToast: {
      title: 'Success',
      description: 'Password reset successfully!',
    },
    onSuccessCallback: async () => {
      form.reset();
      await deleteToken();
      queryClient.invalidateQueries({ queryKey: queryKeys.token });
      router.push('/?auth=login');
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
      otpType: 'PASSWORD_RESET',
    });
  };

  const form = useForm({
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: userEmail!!,
        password: value.password,
        otp: value.otp,
      });
    },
  });

  const handleOpenChange = () => {
    setAuth(prev => (prev === 'reset-password' ? null : 'reset-password'));
  };

  const handleBack = () => {
    setAuth('forgot-password');
  };

  return (
    <Dialog open={auth === 'reset-password'} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-font max-h-160 gap-6 overflow-auto px-6 py-9 sm:w-max md:px-16">
        <DialogHeader className="sr-only">
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset your password to access all the features of our platform.
          </DialogDescription>
        </DialogHeader>
        <form
          id="reset-password"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full max-w-117.25 flex-col gap-6 text-black"
        >
          <button type="button" onClick={handleBack} className="w-max">
            <ArrowLeft className="text-[#00230F]" />
          </button>
          <FieldSet>
            <FieldLegend className="text-[10px]/[100%] font-semibold text-[#9B9B9B]">
              Reset Password
            </FieldLegend>
            <FieldGroup>
              <form.Field
                name="password"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="">
                      <FieldSet className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type={passwordView.password}
                          placeholder="New Password"
                          autoComplete="off"
                          className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                        />
                        <button
                          onClick={() => dispatch({ type: 'password' })}
                          type="button"
                          className="absolute top-1/2 right-4 w-max! -translate-y-1/2 cursor-pointer p-1"
                        >
                          {passwordView.password === 'password' ? (
                            <EyeOff size={16} className="text-[#BEBEBE]" />
                          ) : (
                            <Eye size={16} className="text-[#BEBEBE]" />
                          )}
                          <span className="sr-only">
                            {passwordView.password === 'password'
                              ? 'Hide'
                              : 'Show'}{' '}
                            Password
                          </span>
                        </button>
                      </FieldSet>
                      <ul
                        className="mt-1 flex flex-col gap-1 text-sm/5"
                        aria-live="polite"
                        role="list"
                      >
                        {checks.map(c => {
                          const passed = c.ok(field.state.value || '');
                          return (
                            <li key={c.key} className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'inline-flex h-4 w-4 items-center justify-center rounded-full text-xs',
                                  passed
                                    ? 'bg-[#083226] text-[#D0EA50]'
                                    : 'bg-[#1F2933] text-[#8996A9]',
                                )}
                                aria-hidden
                              >
                                {passed ? '✓' : '•'}
                              </span>
                              <span
                                className={
                                  passed ? 'text-black' : 'text-[#8996A9]'
                                }
                              >
                                {c.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="confirmPassword"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="">
                      <FieldSet className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type={passwordView.confirmPassword}
                          placeholder="Confirm Password"
                          autoComplete="off"
                          className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                        />
                        <button
                          onClick={() => dispatch({ type: 'confirmPassword' })}
                          type="button"
                          className="absolute top-1/2 right-4 w-max! -translate-y-1/2 cursor-pointer p-1"
                        >
                          {passwordView.confirmPassword === 'password' ? (
                            <EyeOff size={16} className="text-[#BEBEBE]" />
                          ) : (
                            <Eye size={16} className="text-[#BEBEBE]" />
                          )}
                          <span className="sr-only">
                            {passwordView.confirmPassword === 'password'
                              ? 'Hide'
                              : 'Show'}{' '}
                            Password
                          </span>
                        </button>
                      </FieldSet>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="otp"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs/[100%] font-semibold text-[#00230F]"
                      >
                        OTP
                      </FieldLabel>
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
          </FieldSet>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <LoaderPinwheelIcon className="animate-spin" />
            ) : (
              'Reset Password'
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
                  <span className="sr-only">Resend the verification code</span>
                </button>{' '}
                in {formattedTime}
              </>
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
