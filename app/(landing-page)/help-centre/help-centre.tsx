'use client';

import ContactUs from '@/components/contact-us';
import { ChevronDown, CreditCard, GraduationCap, Search, ShieldCheck, UserRound, Video } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Topic = { title: string; icon: typeof Search; questions: { q: string; a: React.ReactNode; text: string }[] };

const link = 'font-semibold text-[#305B43] underline';

/** Short, plain answers. `text` is what the search box looks through. */
const TOPICS: Topic[] = [
  {
    title: 'Getting started',
    icon: GraduationCap,
    questions: [
      {
        q: 'What is Upbreed Learn?',
        text: 'online classes african experts video lessons 1-on-1 sessions',
        a: 'Upbreed Learn is a place to learn from leading African experts through video classes, and to book 1-on-1 sessions with instructors.',
      },
      {
        q: 'Can I watch anything for free?',
        text: 'free first lesson trailer',
        a: 'Yes. The first lesson of every class is free to watch. The rest of the lessons open when you become a member.',
      },
      {
        q: 'How do I find a class?',
        text: 'search categories classes browse',
        a: (
          <>
            Use the search box at the top of any page, or open <strong>Classes</strong> to browse by category. Your classes in progress are under{' '}
            <strong>My Courses</strong>.
          </>
        ),
      },
    ],
  },
  {
    title: 'Membership & payments',
    icon: CreditCard,
    questions: [
      {
        q: 'How much is a membership?',
        text: 'price cost plans standard premium',
        a: (
          <>
            Prices depend on your country and are shown in your local currency on the{' '}
            <Link href="/pricing" className={link}>
              Pricing page
            </Link>
            .
          </>
        ),
      },
      {
        q: 'How do I cancel?',
        text: 'cancel stop renewal subscription',
        a: (
          <>
            Go to <strong>Settings › Subscription</strong> and choose cancel. You keep access until the end of the period you already paid for, and you
            won&apos;t be charged again.
          </>
        ),
      },
      {
        q: 'Can I get a refund?',
        text: 'refund money back 30 days',
        a: (
          <>
            Yes, within 30 days of paying. The full details are in our{' '}
            <Link href="/terms" className={link}>
              Terms
            </Link>
            . Use the contact button below and we&apos;ll sort it out.
          </>
        ),
      },
      {
        q: 'My payment went through but I still can’t watch',
        text: 'paid payment not working locked access',
        a: 'Sign out and back in first. If lessons are still locked after a few minutes, contact us with the email you paid with and the payment reference.',
      },
    ],
  },
  {
    title: 'Watching classes',
    icon: Video,
    questions: [
      {
        q: 'Does Upbreed remember where I stopped?',
        text: 'progress continue resume place',
        a: 'Yes. Your place in each lesson is saved as you watch, and your home page shows the class you were last watching with a Continue button.',
      },
      {
        q: 'A video won’t play',
        text: 'video not playing loading error buffer',
        a: 'Reload the page and check your connection. If the lesson shows a padlock, it needs a membership. If it still won’t play, tell us which class and lesson.',
      },
      {
        q: 'Why was I signed out on my other device?',
        text: 'signed out device limit logged out',
        a: (
          <>
            Each plan allows a set number of devices. Signing in on a new one can sign out the oldest. You can see your devices in{' '}
            <strong>Settings › Privacy</strong>.
          </>
        ),
      },
      {
        q: 'How do I rate a class?',
        text: 'rate review stars feedback',
        a: 'Open the class and, once you have watched some of it, tap the stars under the lesson list. You can change your rating at any time.',
      },
    ],
  },
  {
    title: '1-on-1 sessions',
    icon: UserRound,
    questions: [
      {
        q: 'How does booking work?',
        text: 'book session instructor request accept pay',
        a: (
          <>
            Pick an instructor on the{' '}
            <Link href="/sessions" className={link}>
              1-on-1 page
            </Link>
            , choose a time and send your request. The instructor has 48 hours to accept. Once they accept, you have 24 hours to pay, and you both get the
            video link by email.
          </>
        ),
      },
      {
        q: 'When am I charged?',
        text: 'charged pay session',
        a: 'Only after the instructor accepts your request. A request on its own costs nothing.',
      },
      {
        q: 'I need to move or cancel a paid session',
        text: 'reschedule cancel move session',
        a: 'Contact us as early as you can with the session date and the instructor’s name, and we’ll help.',
      },
    ],
  },
  {
    title: 'Account & privacy',
    icon: ShieldCheck,
    questions: [
      {
        q: 'I forgot my password',
        text: 'forgot reset password',
        a: 'On the login box choose “Forgot password”. We’ll email you a code to set a new one.',
      },
      {
        q: 'How do I change my name or photo?',
        text: 'profile photo name edit',
        a: (
          <>
            Go to{' '}
            <Link href="/student/settings" className={link}>
              Settings
            </Link>
            . Click your photo to change it, and edit your details under Profile.
          </>
        ),
      },
      {
        q: 'Can I download or delete my data?',
        text: 'download data delete account privacy',
        a: (
          <>
            Yes. <strong>Settings › Privacy</strong> has “Download my data” and “Delete my account”. Our{' '}
            <Link href="/privacy" className={link}>
              Privacy Policy
            </Link>{' '}
            explains what we keep and why.
          </>
        ),
      },
    ],
  },
];

export default function HelpCentre() {
  const [query, setQuery] = useState('');
  const topics = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return TOPICS;
    return TOPICS.map(t => ({
      ...t,
      questions: t.questions.filter(x => words.every(w => `${x.q} ${x.text} ${t.title}`.toLowerCase().includes(w))),
    })).filter(t => t.questions.length);
  }, [query]);

  return (
    <div className="bg-[#F4F7F4] text-[#00230F]">
      <section className="flex justify-center bg-[#305B43] px-6 py-14 text-white md:py-20">
        <div className="flex w-full max-w-3xl flex-col items-center gap-5 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">How can we help?</h1>
          <p className="text-sm text-white/80 md:text-base">Quick answers about your account, membership, classes and 1-on-1 sessions.</p>
          <label className="relative mt-2 w-full max-w-xl">
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#737373]" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for an answer"
              aria-label="Search help"
              className="h-13 w-full rounded-full bg-white pr-5 pl-12 text-sm text-[#00230F] outline-none placeholder:text-[#9B9B9B] focus:ring-2 focus:ring-[#D0EA50]"
            />
          </label>
        </div>
      </section>

      <section className="flex justify-center px-6 py-12 md:py-16">
        <div className="flex w-full max-w-3xl flex-col gap-10">
          {topics.length === 0 && (
            <p className="rounded-xl bg-white p-6 text-center text-sm text-[#737373]">
              Nothing matches “{query}”. Try different words, or send us a message below.
            </p>
          )}
          {topics.map(topic => (
            <div key={topic.title} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2.5 text-lg font-bold">
                <topic.icon className="size-5 text-[#305B43]" />
                {topic.title}
              </h2>
              <div className="overflow-hidden rounded-xl border border-[#E1E8E1] bg-white">
                {topic.questions.map(item => (
                  <details key={item.q} className="group border-b border-[#EEF2EE] last:border-b-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold hover:bg-[#F8FAF8] [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronDown className="size-4 shrink-0 text-[#737373] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 text-sm/6 text-[#3A3A3A]">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-start gap-4 rounded-xl bg-[#00230F] p-7 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold">Still need help?</p>
              <p className="text-sm text-white/75">
                Send us a message and we&apos;ll reply by email, or write to{' '}
                <a href="mailto:hello@upbreedlearn.com" className="font-semibold text-[#D0EA50] underline">
                  hello@upbreedlearn.com
                </a>
                .
              </p>
            </div>
            <ContactUs>
              <span className="inline-flex h-11 items-center rounded-md bg-[#D0EA50] px-6 text-sm font-semibold text-[#00230F]">Contact us</span>
            </ContactUs>
          </div>
        </div>
      </section>
    </div>
  );
}
