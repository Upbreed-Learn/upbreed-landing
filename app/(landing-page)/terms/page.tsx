import LegalPage, { LegalSection } from '@/components/legal-page';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Terms of Service',
  description: 'The terms that apply when you use Upbreed Learn: accounts, memberships, payments, refunds, 1-on-1 sessions and acceptable use.',
};

const UPDATED = '6 November 2026';
const LEGAL = 'legal@upbreedlearn.com';
const HELLO = 'hello@upbreedlearn.com';
const mail = (a: string) => <a href={`mailto:${a}`}>{a}</a>;

const sections: LegalSection[] = [
  {
    id: 'agreement',
    title: 'About these terms',
    body: (
      <>
        <p>
          These Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;) are an agreement between you and Upbreed Learn (&ldquo;
          <strong>Upbreed</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;), based in Lagos, Nigeria. They apply to
          upbreedlearn.com, its sub-domains and apps, and everything offered through them (the &ldquo;<strong>Platform</strong>&rdquo;).
        </p>
        <p>
          By creating an account, buying a membership or using the Platform, you agree to these Terms and to our{' '}
          <Link href="/privacy">Privacy Policy</Link>. If you don&apos;t agree, please don&apos;t use the Platform.
        </p>
        <p>
          Nothing in these Terms takes away rights you have as a consumer under the law that applies to you, including the Federal Competition
          and Consumer Protection Act 2018 in Nigeria.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Who can use Upbreed',
    body: (
      <>
        <ul>
          <li>You must be at least <strong>16 years old</strong> to create an account.</li>
          <li>
            If you are 16 or 17, you confirm that your parent or guardian has agreed to these Terms on your behalf; they are responsible for
            any payments.
          </li>
          <li>You must give accurate information and keep it up to date.</li>
          <li>You may not use the Platform if we have previously closed your account for breaking these Terms.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'account',
    title: 'Your account',
    body: (
      <>
        <ul>
          <li>Your account is personal to you. Don&apos;t share your password or let others use your account.</li>
          <li>You are responsible for activity on your account. Tell us straight away at {mail(HELLO)} if you think someone else has used it.</li>
          <li>
            Each membership plan allows a set number of devices to be signed in at the same time (for example, Standard: 1 device; Premium: 2
            devices). Signing in on another device may sign out the oldest one.
          </li>
          <li>You can close your account at any time by contacting us. Closing it does not cancel amounts already due.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'memberships',
    title: 'Memberships, prices and renewal',
    body: (
      <>
        <ul>
          <li>
            A membership gives you access to the classes on the Platform for the period you choose (for example 6 months or 1 year). The plan
            page shows what each plan includes.
          </li>
          <li>
            <strong>Prices</strong> are shown in your local currency based on the country you are connecting from, and include any taxes we are
            required to charge unless stated otherwise. Your bank may charge its own fees for currency conversion or international payments.
          </li>
          <li>
            <strong>Automatic renewal:</strong> your membership renews automatically at the end of each period, at the price you signed up for,
            using the payment method you used, until you cancel. We will remind you by email before a renewal where required.
          </li>
          <li>
            <strong>Cancelling:</strong> you can cancel at any time in Settings › Subscription. Renewal stops, and you keep access until the end of
            the period you have paid for.
          </li>
          <li>
            <strong>Price changes</strong> apply to new purchases straight away. If we change the price of your existing membership, we will tell
            you at least 30 days before it applies to your next renewal, so you can cancel first.
          </li>
          <li>
            If a renewal payment fails, we may try again or pause your access until the payment goes through.
          </li>
          <li>
            The class catalogue changes over time. We may add, update or remove classes, but we will not remove so much that a membership no
            longer reflects what was described when you bought it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payments',
    body: (
      <>
        <p>
          Payments are processed by our payment providers, <strong>Paystack</strong> and <strong>Stripe</strong>. Your card or bank details go
          directly to them and are subject to their terms. We receive confirmation of the payment, never your full card details.
        </p>
        <p>You confirm that you are allowed to use the payment method you provide.</p>
      </>
    ),
  },
  {
    id: 'refunds',
    title: '30-day money-back guarantee and refunds',
    body: (
      <>
        <ul>
          <li>
            <strong>Memberships:</strong> if you are not satisfied, you can ask for a <strong>full refund within 30 days</strong> of a membership
            payment. Email {mail(HELLO)} from the email address on your account. When the refund is made, the membership ends.
          </li>
          <li>Refunds go back to the original payment method. How long it takes to reach you depends on your bank or card provider, usually 5–10 working days.</li>
          <li>
            We may decline a refund where the guarantee is clearly being abused, for example repeated buy-and-refund cycles, or where the
            account broke these Terms (such as sharing or copying content).
          </li>
          <li>
            <strong>Gift memberships:</strong> the person who bought the gift can ask for a full refund within 30 days of buying it. Once the
            refund is made, the gift is cancelled.
          </li>
          <li>Refunds for 1-on-1 sessions are covered in the next section.</li>
          <li>After 30 days, payments are not refundable, except where the law says otherwise or we decide to make an exception.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sessions',
    title: '1-on-1 sessions',
    body: (
      <>
        <ul>
          <li>
            1-on-1 sessions are private video calls with an instructor, booked through the Platform and paid for separately from memberships.
            The price is set by the instructor and shown before you book.
          </li>
          <li>
            <strong>How booking works:</strong> you choose a time and send a request. The instructor has 48 hours to accept or decline. You are
            only charged once the instructor accepts and you pay; the session is confirmed when payment succeeds, and you receive the meeting link
            by email.
          </li>
          <li>You can cancel a request at no cost before you pay.</li>
          <li>
            <strong>Changes after payment:</strong> if you need to cancel or move a confirmed session, contact {mail(HELLO)} at least{' '}
            <strong>24 hours</strong> before it starts. We will arrange a new time with the instructor or give you a full refund.
          </li>
          <li>
            <strong>If the instructor cancels or doesn&apos;t attend,</strong> you get a full refund or a new time, as you prefer.
          </li>
          <li>
            <strong>If you don&apos;t attend</strong> or cancel less than 24 hours before the start, the session is not refundable, unless the
            instructor agrees to move it.
          </li>
          <li>
            Sessions take place on a third-party video service (currently Google Meet). Please be respectful, and don&apos;t record a session without
            the instructor&apos;s permission.
          </li>
          <li>
            Instructors are independent experts, not our employees. Session content is the instructor&apos;s own advice and is for general
            educational purposes (see section 13).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'instructors',
    title: 'Instructors',
    body: (
      <>
        <p>If you teach on Upbreed, these extra terms apply (alongside any separate agreement we sign with you):</p>
        <ul>
          <li>You must give accurate information about yourself and only offer sessions you are qualified to give.</li>
          <li>
            For 1-on-1 sessions, you set your prices and availability. You receive <strong>80%</strong> of the amount the student pays for each
            completed session; Upbreed keeps 20% to run the Platform and process payments. Your earnings are shown in your instructor dashboard
            and paid out by Upbreed.
          </li>
          <li>You must respond to requests within 48 hours, attend the sessions you confirm, and treat students with respect.</li>
          <li>You are responsible for any taxes on your earnings.</li>
          <li>
            You keep ownership of material you create. You give Upbreed a licence to host, stream, display and promote it on and for the
            Platform, as agreed with you.
          </li>
          <li>You must not ask students to pay you outside the Platform for sessions booked through it.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'licence',
    title: 'Using the content',
    body: (
      <>
        <p>
          All classes, videos, text, images, designs, the Upbreed name and logo, and the Platform itself belong to Upbreed or to our instructors
          and licensors, and are protected by copyright and other laws.
        </p>
        <p>
          While you have an active membership (or have bought access), we give you a <strong>personal, non-transferable, non-exclusive</strong>{' '}
          licence to watch the content for your own <strong>non-commercial</strong> learning. You must not:
        </p>
        <ul>
          <li>download, record, screen-capture, copy, re-upload or share videos or materials, except where the Platform offers a download feature (offline viewing) and only within it;</li>
          <li>share your account, or sell, rent or give access to anyone else;</li>
          <li>show classes to a paying audience, or use them to train others for money;</li>
          <li>remove copyright notices or watermarks;</li>
          <li>use the content to train artificial intelligence models.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-content',
    title: 'Content you post',
    body: (
      <>
        <p>
          You keep ownership of what you post, such as reviews, profile details and messages. You give Upbreed a worldwide, royalty-free licence
          to use, display and share it on and for the Platform (for example showing a review on a course page). You can delete your reviews, and
          the licence ends when they are removed (except copies kept as required by law).
        </p>
        <p>You confirm you have the right to post it and that it follows these Terms. We may remove content that doesn&apos;t.</p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>break the law, or help anyone else to;</li>
          <li>harass, threaten, abuse or discriminate against instructors, students or our team;</li>
          <li>post content that is false, misleading, defamatory, obscene, hateful, or that infringes someone else&apos;s rights;</li>
          <li>try to get around payments, device limits, video protection or other security measures;</li>
          <li>access accounts or data that aren&apos;t yours, or test, scan or attack the Platform&apos;s security;</li>
          <li>use bots, scrapers or other automated tools to access the Platform or copy its content;</li>
          <li>upload viruses or harmful code, or overload or interfere with the Platform;</li>
          <li>use the Platform to send spam or unsolicited advertising.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'suspension',
    title: 'Suspension and closing accounts',
    body: (
      <>
        <p>
          We may suspend or close an account if it breaks these Terms, if we reasonably suspect fraud or misuse, or if the law requires it.
          Where reasonable, we will tell you why first and give you a chance to fix the problem.
        </p>
        <p>
          If we close your account without you having broken these Terms, we will refund the unused part of your membership. If we close it
          because you broke these Terms, we don&apos;t have to refund you.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Educational content and availability',
    body: (
      <>
        <ul>
          <li>
            Classes and sessions are for general educational purposes. They are not professional, financial, legal, medical or other personalised
            advice, and results depend on you. Please get professional advice before acting on anything that affects your money, health or legal
            position.
          </li>
          <li>Views expressed by instructors are their own.</li>
          <li>
            We work hard to keep the Platform available and secure, but we can&apos;t promise it will always be uninterrupted or error-free. We may
            pause it for maintenance, updates or reasons beyond our control.
          </li>
          <li>
            The Platform may link to services run by others (such as Google Meet or payment pages). We are not responsible for those services.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Our liability',
    body: (
      <>
        <ul>
          <li>
            Nothing in these Terms limits liability that cannot be limited by law, including for death or personal injury caused by negligence,
            or for fraud.
          </li>
          <li>We are not liable for losses that were not reasonably foreseeable, or for business losses (such as lost profit, revenue or opportunity).</li>
          <li>
            Apart from the above, our total liability to you for any claims relating to the Platform is limited to the amount you paid us in the
            12 months before the event that caused the claim.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'indemnity',
    title: 'Your responsibility to us',
    body: (
      <p>
        If you break these Terms or the law and someone makes a claim against Upbreed because of it, you agree to cover the reasonable losses
        and costs that result, to the extent the law allows.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to the Platform and these Terms',
    body: (
      <p>
        We may update these Terms as the Platform or the law changes. The date at the top shows the latest version. For important changes, we
        will tell you by email or on the Platform at least 14 days before they take effect. If you don&apos;t agree, you can cancel before then;
        continuing to use the Platform afterwards means you accept the new Terms.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Disputes and governing law',
    body: (
      <>
        <ol className="steps">
          <li>If you have a problem, please contact {mail(LEGAL)} first. Most issues can be solved quickly this way.</li>
          <li>If we can&apos;t resolve it within 30 days, either of us may refer the dispute to mediation in Lagos, Nigeria, before going to court.</li>
          <li>
            These Terms are governed by the laws of the Federal Republic of Nigeria, and the courts of Lagos State have jurisdiction. If you live
            elsewhere as a consumer, you may also have the right to bring a claim in your own country and to rely on its mandatory consumer laws.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'general',
    title: 'General',
    body: (
      <ul>
        <li>These Terms and the Privacy Policy are the whole agreement between you and us about the Platform.</li>
        <li>If any part of these Terms is found invalid, the rest stays in force.</li>
        <li>If we don&apos;t enforce a right straight away, we can still enforce it later.</li>
        <li>You may not transfer your account or rights under these Terms to anyone else. We may transfer ours to a company that takes over the Platform, and will tell you if that happens.</li>
      </ul>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <p>
        Questions about these Terms: {mail(LEGAL)}. Help with your account, payments or refunds: {mail(HELLO)}. Privacy questions:{' '}
        {mail('privacy@upbreedlearn.com')}.
        <br />
        Upbreed Learn, Lagos, Nigeria.
      </p>
    ),
  },
];

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    updated={UPDATED}
    intro={
      <p>
        Welcome to Upbreed Learn. These Terms explain the rules for using our platform, including memberships, payments, our 30-day money-back
        guarantee, 1-on-1 sessions and what you can do with the classes. Please read them carefully.
      </p>
    }
    sections={sections}
  />
);

export default Terms;
