import Facebook from '@/components/jsx-icons/facebook';
import Instagram from '@/components/jsx-icons/instagram';
import LinkedIn from '@/components/jsx-icons/linkedin';
import Twitter from '@/components/jsx-icons/twitter';
import Youtube from '@/components/jsx-icons/youtube';
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
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import z from 'zod';

const ContactUs = (props: { children?: React.ReactNode }) => {
  const { children } = props;

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer hover:text-[#D0EA50]">
        {children}
      </DialogTrigger>
      <DialogContent className="flex w-full items-center justify-between bg-[url(/img/contact-us.png)] bg-cover bg-center bg-no-repeat max-md:h-120 max-md:flex-col max-md:gap-12 max-md:overflow-auto md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Fill out the form below to get in touch with us.
          </DialogDescription>
        </DialogHeader>
        <ContactIntro />
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
};

export default ContactUs;

const ContactIntro = () => {
  return (
    <div className="flex w-full basis-full items-center justify-center pr-14 pl-7 md:w-96">
      <div className="flex w-full flex-col justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-[#305B43]">Get In Touch</h2>
          <p className="text-xs font-light text-gray-600">
            Not sure of what you need? Our team is here to help you with all
            your concerns.
          </p>
        </div>
        <div className="relative flex items-center justify-start gap-3 text-sm font-bold text-[#305B43]">
          {' '}
          <img src="/icons/mail.png" className="h-5 object-contain" alt="" />
          <Link href={'mailto:hello@upbreedlearn.com'}>
            <span className="absolute inset-0"></span> hello@upbreedlearn.com
          </Link>
        </div>
        <div className="flex items-end gap-4">
          <Link
            target="_blank"
            href="https://www.linkedin.com/company/upbreedlearn/about/?viewAsMember=true"
            className="transition-opacity hover:opacity-50"
          >
            <LinkedIn fill="#305B43" width="24" height="24" />
          </Link>
          <Link
            target="_blank"
            href="https://www.instagram.com/upbreedlearn"
            className="transition-opacity hover:opacity-50"
          >
            <Instagram fill="#305B43" width="24" height="24" />
          </Link>
          <Link
            target="_blank"
            href="https://x.com/upbreedlearn"
            className="transition-opacity hover:opacity-50"
          >
            <Twitter fill="#305B43" width="24" height="24" />
          </Link>
          <Link
            target="_blank"
            href="https://www.facebook.com/upbreedlearn"
            className="transition-opacity hover:opacity-50"
          >
            <Facebook fill="#305B43" width="24" height="24" />
          </Link>
          <Link
            target="_blank"
            href="https://youtube.com/@upbreedlearn?si=QYEE2kDdYaiB0cHU"
            className="transition-opacity hover:opacity-50"
          >
            <Youtube fill="#305B43" width="24" height="24" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  message: z
    .string()
    .min(10, { message: 'Message should be at least 10 characters' }),
});

const ContactForm = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
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
      id="contact-form"
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6 max-md:w-full md:basis-full md:pr-7"
    >
      <FieldGroup className="gap-2 max-md:w-full">
        <FieldLegend className="text-xl font-semibold text-[#305B43]">
          Send Us a Message
        </FieldLegend>
        <FieldGroup className="rounded-lg md:border-2 md:p-10">
          <form.Field
            name="firstName"
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
                      placeholder="First Name"
                      className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                    />
                  </FieldSet>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <Field data-invalid={isInvalid} className="gap-4">
                  <FieldSet className="flex-row gap-0">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Last Name"
                      className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                    />
                  </FieldSet>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                      placeholder="Email"
                      className="h-12 w-full rounded-lg border-[#9B9B9B] bg-[#f9f9f9] font-semibold text-black"
                    />
                  </FieldSet>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </FieldGroup>
      <Button className="h-12 w-[9.88875rem] self-end rounded-lg bg-[#00230F] text-[#D0EA50] hover:bg-[#00230F]/80">
        Send Message
      </Button>
    </form>
  );
};
