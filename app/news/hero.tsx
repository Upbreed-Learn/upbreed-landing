'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
});

const Hero = () => {
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
    <section className="relative flex justify-center bg-[url(/img/news-hero.jpg)] bg-cover bg-center bg-no-repeat before:absolute before:size-full before:bg-black before:opacity-90">
      <div className="z-20 flex w-full max-w-7xl flex-col items-center gap-4 p-9 md:p-12 lg:p-18">
        <h1 className="text-center text-[2rem]/[100%] font-semibold text-[#D0EA50]">
          Welcome to Upbreed Learn Blog
        </h1>
        <form
          id="subscribe-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full gap-6"
        >
          <FieldGroup className="flex-row justify-center">
            <form.Field
              name="email"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="w-max justify-center gap-4"
                  >
                    <FieldLabel
                      htmlFor={field.name}
                      className="block text-center text-sm/[100%] font-semibold text-white"
                    >
                      Get the latest coolest new from UPBREED
                    </FieldLabel>
                    <FieldSet className="flex-row gap-0">
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="email"
                        placeholder="Email"
                        className="h-12 flex-2/3 rounded-none rounded-l-lg border-[#9B9B9B] bg-[#47474700] text-white placeholder:text-[#9B9B9B] xl:w-73"
                      />
                      <Button className="h-12 flex-1/3 rounded-none rounded-r-lg xl:w-[9.88875rem]">
                        Subscribe
                      </Button>
                    </FieldSet>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </div>
    </section>
  );
};

export default Hero;
