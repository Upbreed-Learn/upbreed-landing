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
import { useForm } from '@tanstack/react-form';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import z from 'zod';
import 'react-phone-input-2/lib/style.css';
import { Eye, EyeOff, LoaderPinwheelIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { useRouter } from 'next/navigation';
import { useDeviceFingerprint } from '@/lib/queries/hooks';
import { MUTATIONS } from '@/lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';

const formSchema = z.object({
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
});

const LoginDialog = () => {
  const [auth, setAuth] = useQueryState('auth');
  const [viewPassword, setViewPassword] = useState(false);
  const { data: deviceFingerprint } = useDeviceFingerprint();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleTogglePassword = () => {
    setViewPassword(prev => !prev);
  };

  const { mutate, isPending } = useSendRequest<
    { email: string; password: string; deviceSignature: string },
    { data: { token: string } }
  >({
    mutationFn: (data: {
      email: string;
      password: string;
      deviceSignature: string;
    }) => MUTATIONS.authLogin(data),
    errorToast: {
      title: 'Error',
      description: 'Authentication failed',
    },
    cookie: {
      name: 'rf',
      getValue: response => response?.data?.token,
    },
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.token });
      router.push('/student/home');
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: value.email,
        password: value.password,
        deviceSignature: deviceFingerprint!!,
      });
    },
  });

  const handleOpenChange = () => {
    setAuth(prev => (prev === 'login' ? null : 'login'));
  };

  const handleSignUp = () => {
    setAuth('sign-up');
  };

  const handleForgotPassword = () => {
    setAuth('forgot-password');
  };

  const handleGoogleLogin = () => {
    // Generate or get device signature
    const deviceSignature = deviceFingerprint;

    // Redirect to Google OAuth
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?deviceSignature=${deviceSignature}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <Dialog open={auth === 'login'} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-font max-h-160 gap-6 overflow-auto px-6 py-9 sm:w-max md:px-16">
        <DialogHeader className="sr-only">
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Login to your account to access all the features of our platform.
          </DialogDescription>
        </DialogHeader>
        <form
          id="login"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full flex-col gap-6 text-black md:w-62.5"
        >
          <FieldSet>
            <FieldLegend className="text-[10px]/[100%] font-semibold text-[#9B9B9B]">
              WELCOME BACK
            </FieldLegend>
            <FieldDescription className="text-[10px]/[100%] font-semibold text-[#00230F]">
              Login to Continue
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
                          type={viewPassword ? 'text' : 'password'}
                          placeholder="Password"
                          autoComplete="off"
                          className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                        />
                        <button
                          onClick={handleTogglePassword}
                          type="button"
                          className="absolute top-1/2 right-4 w-max! -translate-y-1/2 cursor-pointer p-1"
                        >
                          {viewPassword ? (
                            <EyeOff size={16} className="text-[#BEBEBE]" />
                          ) : (
                            <Eye size={16} className="text-[#BEBEBE]" />
                          )}
                          <span className="sr-only">
                            {viewPassword ? 'Hide' : 'Show'} Password
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
            </FieldGroup>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <LoaderPinwheelIcon className="animate-spin" />
              ) : (
                'Login'
              )}
            </Button>
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
            <p>New to upbreed ?</p>
            <button onClick={handleSignUp} className="text-[#34A853]">
              Sign up
              <span className="sr-only">Sign up</span>
            </button>
          </div>
          <button
            onClick={handleForgotPassword}
            className="text-sm/[100%] font-semibold text-[#9C9C9C]"
          >
            Forgot your password?
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
