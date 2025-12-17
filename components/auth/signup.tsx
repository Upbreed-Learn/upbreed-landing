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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import { useQueryState } from 'nuqs';
import { useEffect, useReducer } from 'react';
import z from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Eye, EyeOff, LoaderPinwheelIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useSendRequest, {
  successToastClassName,
} from '@/lib/hooks/useSendRequest';
import { useDeviceFingerprint } from '@/lib/queries/hooks';
import { useUserEmailStore } from '@/store/useUserEmailStore';
import { MUTATIONS } from '@/lib/queries';

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long.' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters long.' }),
    phoneNumber: z.string().min(10, {
      message: 'Phone number must be at least 10 characters long.',
    }),
    email: z.email({
      message: 'Please enter a valid email address.',
    }),
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

const SignupDialog = (props: { onStartTimer: () => void }) => {
  const [auth, setAuth] = useQueryState('auth');
  const { onStartTimer } = props;

  const [passwordView, dispatch] = useReducer(passwordViewReducer, {
    password: 'password',
    confirmPassword: 'password',
  });

  const { data: deviceFingerprint } = useDeviceFingerprint();
  const { setUserEmail } = useUserEmailStore();

  const { mutate, isPending } = useSendRequest<
    {
      fname: string;
      lname: string;
      email: string;
      phone: string;
      password: string;
      deviceSignature: string;
    },
    { data: { data: { message: string; email: string } } }
  >({
    mutationFn: (data: {
      fname: string;
      lname: string;
      email: string;
      phone: string;
      password: string;
      deviceSignature: string;
    }) => MUTATIONS.authSignup(data),
    errorToast: {
      title: 'Error',
      description: 'Authentication failed',
    },
    successToast: {
      title: 'Success',
      description:
        'Authentication successful! Check your email for the verification code.',
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          fname: value.firstName,
          lname: value.lastName,
          email: value.email,
          phone: value.phoneNumber,
          password: value.password,
          deviceSignature: deviceFingerprint!!,
        },
        {
          onSuccess: () => {
            setUserEmail(value.email);
            form.reset();
            setAuth('verify');
            onStartTimer();
          },
        },
      );
    },
  });

  const handleOpenChange = () => {
    setAuth(prev => (prev === 'sign-up' ? null : 'sign-up'));
  };

  const handleLogin = () => {
    setAuth('login');
  };

  const handleGoogleLogin = () => {
    // Generate or get device signature
    const deviceSignature = deviceFingerprint;

    // Redirect to Google OAuth
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?deviceSignature=${deviceSignature}`;
    window.location.href = googleAuthUrl;
  };

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const token = params.get('token');

  //   if (token) {
  //     // Store token
  //     // localStorage.setItem('authToken', token);
  //     Cookies.set('rf', token);
  //     // Redirect to dashboard
  //     window.location.href = '/home';
  //   }
  // }, []);

  return (
    <Dialog open={auth === 'sign-up'} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-font max-h-160 gap-6 overflow-auto px-6 py-9 sm:w-max md:px-16">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>
            Create an account to access all the features of our platform.
          </DialogDescription>
        </DialogHeader>
        <form
          id="signup"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-col gap-6 text-black md:w-62.5"
        >
          <FieldSet>
            <FieldLegend className="text-[10px]/[100%] font-semibold text-[#9B9B9B]">
              {`LET’S`} GET YOU STARTED
            </FieldLegend>
            <FieldDescription className="text-[10px]/[100%] font-semibold text-[#00230F]">
              Create an Account
            </FieldDescription>
            <FieldGroup>
              <form.Field
                name="firstName"
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
                        placeholder="First Name"
                        className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="lastName"
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
                        placeholder="Last Name"
                        className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="phoneNumber"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <PhoneInput
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e)}
                        aria-invalid={isInvalid}
                        placeholder="Phone Number"
                        inputClass="!h-9 !border-[#9B9B9B] !rounded-lg !bg-[#47474700] !pl-12 !w-full"
                        dropdownClass="text-black!"
                        buttonClass="!border-[#9B9B9B] !rounded-l-lg"
                        country={'ng'}
                        inputProps={{
                          id: field.name,
                          name: field.name,
                          required: true,
                          autoFocus: true,
                          autoComplete: 'none',
                          'data-testid': 'input-id',
                        }}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
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
              <form.Field
                name="password"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldSet className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type={passwordView.password}
                          placeholder="Password"
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
                            <li
                              key={c.key}
                              className="custom-font flex items-center gap-2"
                            >
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
                    <Field data-invalid={isInvalid}>
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
              <Button
                disabled={isPending}
                className="disbled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <LoaderPinwheelIcon className="animate-spin" />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <hr className="flex-1 border border-[#737373]" />
            <span className="custom-font-semibold text-sm/[100%] text-[#949494]">
              OR
            </span>
            <hr className="flex-1 border border-[#737373]" />
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="custom-font-semibold flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[#9B9B9B] px-4 py-3 text-sm text-[#9C9C9C] transition-transform active:scale-95"
          >
            <img
              src="/assets/google.svg"
              alt="Google logo"
              className="h-4 w-4"
            />
            Sign Up with Google
            <span className="sr-only">Sign up with Google</span>
          </button>
          <div className="flex items-center justify-center gap-2.5 text-sm text-[#00230F]">
            <p>Already a member?</p>
            <button className="text-[#34A853]" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
