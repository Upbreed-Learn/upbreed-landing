import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
});

const Password = () => {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
      <Button className="w-max">Reset password</Button>
      {/* <Button disabled={isPending} type="submit">
        {isPending ? (
          <LoaderPinwheelIcon className="animate-spin" />
        ) : (
          'Send Verification Code'
        )}
      </Button> */}
    </form>
  );
};

export default Password;
