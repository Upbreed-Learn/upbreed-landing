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
import ContactUs from '@/app/(contact-us)';
import Gifts from '@/app/(gifts)';

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
    href: '/press',
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
    href: '/terms',
  },
  {
    name: 'FAQ',
    href: '/#faqs',
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
    <footer className="flex w-full flex-col bg-[#00230F] pt-14 pb-10 md:pt-17">
      <div className="flex w-full max-w-7xl gap-14 self-center px-9 pb-7 max-md:flex-col md:items-end md:gap-36 md:px-12 md:max-lg:justify-between lg:px-18">
        <div className="flex items-end gap-22.75">
          <Image src={logo} alt="upbreed logo" className="max-lg:hidden" />
          <div className="flex gap-35 text-sm/9 text-white">
            <ul>
              {LINKS.slice(0, 6).map(link => (
                <li key={link.name}>
                  <NavLink
                    href={link.href}
                    className={cn(
                      'before:hidden hover:text-[#D0EA50]',
                      pathname.length > 2 &&
                        pathname.includes(link.href) &&
                        'text-[#D0EA50]',
                      pathname.length < 2 &&
                        pathname === link.href &&
                        'hover:text-[#D0EA50]',
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
                  {link.name.toLowerCase().includes('contact') ? (
                    <ContactUs>{link.name}</ContactUs>
                  ) : link.name.toLowerCase().includes('gifts') ? (
                    <Gifts>{link.name}</Gifts>
                  ) : (
                    <NavLink
                      href={link.href}
                      className={cn(
                        'before:hidden hover:text-[#D0EA50]',
                        pathname.length > 2 &&
                          pathname.includes(link.href) &&
                          'text-[#D0EA50]',
                        pathname.length < 2 &&
                          pathname === link.href &&
                          'hover:text-[#D0EA50]',
                      )}
                    >
                      {link.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-12 self-end max-md:w-full">
          <div className="flex items-center gap-7">
            <Link
              target="_blank"
              href="https://www.linkedin.com/company/upbreedlearn/about/?viewAsMember=true"
              className="transition-opacity hover:opacity-50"
            >
              <LinkedIn />
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/upbreedlearn"
              className="transition-opacity hover:opacity-50"
            >
              <Instagram />
            </Link>
            <Link
              target="_blank"
              href="https://x.com/upbreedlearn"
              className="transition-opacity hover:opacity-50"
            >
              <Twitter />
            </Link>
            <Link
              target="_blank"
              href="https://www.facebook.com/upbreedlearn"
              className="transition-opacity hover:opacity-50"
            >
              <Facebook />
            </Link>
            <Link
              target="_blank"
              href="https://youtube.com/@upbreedlearn?si=QYEE2kDdYaiB0cHU"
              className="transition-opacity hover:opacity-50"
            >
              <Youtube />
            </Link>
          </div>
          <form
            id="subscribe-form"
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex w-full flex-col gap-6 px-0"
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
                          className="w-full text-[10px] leading-[100%] font-semibold text-white md:text-sm xl:text-nowrap"
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
      <div className="px-9 pt-0 pb-7 md:px-12 lg:px-18">
        <Image src={logo} alt="upbreed logo" className="lg:hidden" />
      </div>
      <div className="flex justify-center border-[#305B43] pt-3 md:border-t-2">
        <div className="flex w-full max-w-7xl items-center gap-12 px-9 text-xs leading-[100%] font-semibold text-white md:gap-16 md:px-12 md:text-sm lg:px-18">
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
