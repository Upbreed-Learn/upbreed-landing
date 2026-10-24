'use client';

import { useForm } from '@tanstack/react-form';
import logo from '@/public/upbreed-logo.svg';
import footerLogo from '@/public/upbreed-logo-footer.svg';
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
import ContactUs from '@/components/contact-us';
import Gifts from '@/components/gifts';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { Activity } from 'react';
import AuthBanner from './auth-banner';
import { useGetToken } from '@/lib/queries/hooks';

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
    href: '/student/home',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: '1-on-1 Sessions',
    href: '/sessions',
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
  const { ref, isVisible } = useIntersectionObserver();
  const { data } = useGetToken();
  const token = data?.data.token;

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
    <>
      <footer
        ref={ref}
        className="flex w-full flex-col bg-[#00230F] pt-12 md:pt-[67px]"
      >
        <div className="flex w-full max-w-[1280px] gap-10 self-center px-9 pb-8 max-md:flex-col md:items-start md:justify-between md:px-12 lg:px-[72px] lg:pb-[50px]">
          <div className="flex items-end gap-[91px] lg:self-stretch">
            <Image src={footerLogo} alt="upbreed logo" width={152} height={98} className="max-lg:hidden" />
            <div className="flex gap-16 text-[13px]/[35px] font-semibold text-white lg:gap-[125px]">
              <ul>
                {LINKS.filter(l => token || l.href !== '/sessions').slice(0, 6).map(link => (
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
                {LINKS.filter(l => token || l.href !== '/sessions').slice(6).map(link => (
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
          <div className="flex w-full max-w-[460px] flex-col gap-7 pt-5">
            <div className="flex items-center gap-[28px]">
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
              className="flex w-full flex-col gap-4 px-0"
            >
              <FieldGroup>
                <form.Field
                  name="email"
                  children={field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="w-full gap-3">
                        <FieldLabel
                          htmlFor={field.name}
                          className="w-max pl-1 text-[13px]/[100%] font-semibold text-white"
                        >
                          Get the latest coolest new from UPBREED
                        </FieldLabel>
                        <FieldSet className="h-[49px] flex-row gap-0 overflow-hidden rounded-[9px] border-2 border-[#305B43]">
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="email"
                            placeholder="Email"
                            className="h-full flex-1 rounded-none border-0 bg-transparent text-[13px] text-white shadow-none placeholder:text-[#9B9B9B] focus-visible:ring-0"
                          />
                          <Button className="h-full w-[158px] shrink-0 rounded-none border-l-2 border-[#305B43] bg-transparent text-[15px] font-semibold text-[#D0EA50] hover:bg-[#305B43]/40">
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
                        <FieldSet className="w-full flex-row items-center gap-3">
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
                            className="w-full text-[12px] leading-[100%] font-semibold text-white md:text-[13px] xl:text-nowrap"
                          >
                            <span className="text-[#FF0000]">*</span> By
                            clicking here, I agree to share my information
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
          <Image src={logo} alt="upbreed logo" width={150} className="h-auto w-[150px] lg:hidden" />
        </div>
        <div className="flex justify-center border-t-2 border-[#305B43] py-4">
          <div className="flex w-full max-w-[1280px] items-center gap-12 px-9 text-[13px] leading-[100%] font-semibold text-white md:gap-[100px] md:px-12 lg:px-[95px]">
            <p>(c) {year} upbreed </p>
            <div className="flex items-center gap-2">
              <LockIcon />
              <span className="text-[12px]/[100%]">Secured with SSL</span>
            </div>
          </div>
        </div>
      </footer>
      <Activity mode={token ? 'hidden' : 'visible'}>
        <AuthBanner
          className={cn(
            isVisible && 'translate-y-20 transition-transform duration-500',
          )}
        />
      </Activity>
    </>
  );
};

export default Footer;
