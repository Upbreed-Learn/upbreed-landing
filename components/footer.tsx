'use client';

import { useForm } from '@tanstack/react-form';
import logo from '@/public/upbreed-logo.svg';
import z from 'zod';
import Image from 'next/image';
import NavLink from './navlink';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LinkedIn from './jsx-icons/linkedin';
import Instagram from './jsx-icons/instagram';
import Twitter from './jsx-icons/twitter';
import Facebook from './jsx-icons/facebook';
import Youtube from './jsx-icons/youtube';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import LockIcon from './jsx-icons/lock';

const LINKS = [
  {
    name: 'About Us',
    href: '/about',
  },
  {
    name: 'Career',
    href: '/career',
  },
  {
    name: 'Classes',
    href: '#',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'Press',
    href: '#',
  },
  {
    name: 'News',
    href: '/news',
  },
  {
    name: 'Privacy Policy',
    href: '/privacy',
  },
  {
    name: 'Terms',
    href: '#',
  },
  {
    name: 'FAQ',
    href: '#',
  },
  {
    name: 'Contact Us',
    href: '#',
  },
  {
    name: 'Gifts',
    href: '#',
  },
];

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  terms: z.boolean().refine(val => val === true, {
    message: 'Please accept the terms and conditions.',
  }),
});

const Footer = () => {
  const pathname = usePathname();

  const form = useForm({
    defaultValues: {
      email: '',
      terms: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full flex-col bg-[#00230F] pt-17 pb-10">
      <div className="flex w-full max-w-7xl items-end gap-36 self-center px-18 pb-7">
        <div className="flex items-end gap-22.75">
          <Image src={logo} alt="upbreed logo" />
          <div className="flex gap-35 text-sm/9 text-white">
            <ul>
              {LINKS.slice(0, 6).map(link => (
                <li key={link.name}>
                  <NavLink
                    href={link.href}
                    className={cn(
                      'before:hidden hover:text-[#D0EA50]',
                      link.href === pathname && 'text-[#D0EA50]',
                    )}
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ul>
              {LINKS.slice(6).map(link => (
                <li key={link.name}>
                  <NavLink
                    href={link.href}
                    className={cn(
                      'before:hidden',
                      link.href === pathname && 'text-[#D0EA50]',
                    )}
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-12 self-end">
          <div className="flex items-center gap-7">
            <Link href={'/'}>
              <LinkedIn />
            </Link>
            <Link href={'/'}>
              <Instagram />
            </Link>
            <Link href={'/'}>
              <Twitter />
            </Link>
            <Link href={'/'}>
              <Facebook />
            </Link>
            <Link href={'/'}>
              <Youtube />
            </Link>
          </div>
          <form
            id="subscribe-form"
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex w-full flex-col gap-6"
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="w-max">
                      <FieldLabel
                        htmlFor={field.name}
                        className="w-max text-sm/[100%] font-semibold text-white"
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
                          className="h-12 w-73 rounded-none rounded-l-lg border-[#9B9B9B] bg-[#47474700] text-white placeholder:text-[#9B9B9B]"
                        />
                        <Button className="h-12 w-[9.88875rem] rounded-none rounded-r-lg">
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
              <form.Field
                name="terms"
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="w-full">
                      <FieldSet className="w-full flex-row gap-4">
                        <Checkbox
                          id={field.name}
                          checked={field.state.value}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onCheckedChange={e =>
                            field.handleChange(e === true ? true : false)
                          }
                        />
                        <FieldLabel
                          htmlFor={field.name}
                          className="w-full text-sm/[100%] font-semibold text-nowrap text-white"
                        >
                          <span className="text-[#FF0000]">*</span> By clicking
                          here, I agree to share my information
                        </FieldLabel>
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
      </div>
      <div className="flex justify-center border-t-2 border-[#305B43] pt-3">
        <div className="flex w-full max-w-7xl items-center gap-16 px-18 text-sm/[100%] font-semibold text-white">
          <p>(c) {year} upbreed </p>
          <div className="flex items-center gap-2">
            <LockIcon />
            <span className="text-xs/[100%]">Secured with SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
