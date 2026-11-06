import LegalPage, { LegalSection } from '@/components/legal-page';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Privacy Policy',
  description: 'How Upbreed Learn collects, uses, shares and protects your personal data, and the rights you have over it.',
};

const UPDATED = '6 November 2026';
const PRIVACY = 'privacy@upbreedlearn.com';
const mail = (a: string) => <a href={`mailto:${a}`}>{a}</a>;

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          Upbreed Learn (&ldquo;<strong>Upbreed</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;) runs the online learning
          platform at upbreedlearn.com and its sub-domains, including the instructor and admin apps (together, the &ldquo;
          <strong>Platform</strong>&rdquo;). We are based in Lagos, Nigeria.
        </p>
        <p>
          For the personal data described in this policy, Upbreed is the <strong>data controller</strong>: we decide why and how your data is
          used. For any question about this policy or your data, contact us at {mail(PRIVACY)}.
        </p>
      </>
    ),
  },
  {
    id: 'scope',
    title: 'What this policy covers',
    body: (
      <>
        <p>This policy applies to everyone who uses the Platform: visitors, students (members), people who receive a gift membership, instructors, and anyone who contacts us.</p>
        <p>
          We follow the <strong>Nigeria Data Protection Act 2023</strong> (&ldquo;NDPA&rdquo;) and the regulations and directives of the Nigeria Data
          Protection Commission (&ldquo;NDPC&rdquo;). Where you use the Platform from the European Economic Area or the United Kingdom, we also
          follow the EU General Data Protection Regulation and the UK GDPR, and you have the rights those laws give you.
        </p>
        <p>
          It does not cover websites or services run by others that we link to (for example Google Meet, Paystack or Stripe checkout pages).
          Their own privacy policies apply there.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'The personal data we collect',
    body: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Account details:</strong> first and last name, email address, password (we only ever store a scrambled &ldquo;hash&rdquo; of it,
            never the password itself) and, if you add it, your phone number.
          </li>
          <li>
            <strong>Profile details (optional):</strong> profile photo, country, state, and links to your website or social media profiles.
          </li>
          <li>
            <strong>Instructor details:</strong> job title, area of expertise, biography, profile photo, the 1-on-1 sessions you offer, your
            prices and weekly availability, your time zone, and the details we need to pay you.
          </li>
          <li>
            <strong>1-on-1 session details:</strong> the session you request, the date and time, any notes you add for the instructor, the
            instructor&apos;s reply (and reason, if they decline), and the review you leave afterwards.
          </li>
          <li>
            <strong>Gift details:</strong> when you buy a gift membership, the recipient&apos;s name and email address and your message.
          </li>
          <li>
            <strong>Messages:</strong> what you send us through the contact form or &ldquo;Talk to Us&rdquo;, and emails you send to us.
          </li>
          <li>
            <strong>Reviews and ratings</strong> you leave for courses or sessions.
          </li>
          <li>
            <strong>Newsletter sign-ups:</strong> your email address, if you choose to subscribe.
          </li>
        </ul>

        <h3>Information created when you use the Platform</h3>
        <ul>
          <li>
            <strong>Learning activity:</strong> the courses you enrol in, the lessons you watch, how far you got in each video, the courses you
            finish and the courses you bookmark.
          </li>
          <li>
            <strong>Membership and payment records:</strong> your plan, billing period, start and renewal dates, amounts, currency, payment
            status and the reference numbers from our payment providers. We <strong>do not</strong> see or store your full card number, CVV or
            bank login details: those go straight to Paystack or Stripe.
          </li>
          <li>
            <strong>Device and sign-in information:</strong> a device identifier created by your browser or app, used to keep you signed in and
            to apply the number of devices your plan allows, plus the date and time of your sign-ins.
          </li>
          <li>
            <strong>Approximate location:</strong> the country your internet connection is in, worked out from your IP address by our hosting
            provider. We use it only to show prices in your local currency. We do not track your precise location.
          </li>
          <li>
            <strong>Technical logs:</strong> our servers record technical events (such as errors, the page or service requested, and when) to
            keep the Platform working and secure. These logs are kept for a short time.
          </li>
        </ul>

        <h3>Information from other people and services</h3>
        <ul>
          <li>
            <strong>Sign in with Google:</strong> if you choose it, Google shares your name, email address and profile picture with us. We do not
            get your Google password or access to your Gmail or files.
          </li>
          <li>
            <strong>Google Calendar (instructors):</strong> if you connect it, we create calendar events and Google Meet links for confirmed 1-on-1
            sessions. We only use the access needed to create and update those events.
          </li>
          <li>
            <strong>Payment providers</strong> tell us whether a payment succeeded, failed or was refunded.
          </li>
          <li>
            <strong>Someone who buys you a gift</strong> gives us your name and email address so we can deliver it.
          </li>
        </ul>
        <p>
          We do not knowingly collect sensitive personal data (such as health, religion, ethnicity or political views). Please don&apos;t include it
          in notes, messages or your profile.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use your data and our legal basis',
    body: (
      <>
        <p>The law requires us to have a valid reason (a &ldquo;lawful basis&rdquo;) for each use of your data. These are ours:</p>
        <table>
          <thead>
            <tr>
              <th>What we do</th>
              <th>Lawful basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Create and run your account, verify your email, sign you in and keep it secure</td>
              <td>Performing our contract with you</td>
            </tr>
            <tr>
              <td>Provide courses, stream videos, save your progress and show you where you left off</td>
              <td>Performing our contract with you</td>
            </tr>
            <tr>
              <td>Take payments, renew memberships, issue receipts and process refunds</td>
              <td>Performing our contract with you; legal obligation (tax and accounting records)</td>
            </tr>
            <tr>
              <td>Arrange 1-on-1 sessions: share what&apos;s needed between student and instructor, create the meeting link, send reminders</td>
              <td>Performing our contract with you</td>
            </tr>
            <tr>
              <td>Pay instructors their share of session fees</td>
              <td>Performing our contract with the instructor; legal obligation</td>
            </tr>
            <tr>
              <td>Send service emails: verification codes, password resets, receipts, booking updates, changes to these terms</td>
              <td>Performing our contract with you</td>
            </tr>
            <tr>
              <td>Show prices in your local currency based on your country</td>
              <td>Legitimate interests (offering fair, local pricing)</td>
            </tr>
            <tr>
              <td>Limit how many devices can use one membership; detect and prevent fraud, account sharing and misuse</td>
              <td>Legitimate interests (protecting the Platform, instructors and members); performing our contract</td>
            </tr>
            <tr>
              <td>Answer your messages and support requests</td>
              <td>Legitimate interests; performing our contract</td>
            </tr>
            <tr>
              <td>Understand, in aggregate, which courses are watched, to improve the Platform and choose new classes</td>
              <td>Legitimate interests (improving our service)</td>
            </tr>
            <tr>
              <td>Send newsletters and offers</td>
              <td>Your consent, which you can withdraw at any time</td>
            </tr>
            <tr>
              <td>Comply with the law, respond to lawful requests from authorities, and establish or defend legal claims</td>
              <td>Legal obligation; legitimate interests</td>
            </tr>
          </tbody>
        </table>
        <p>
          Where we rely on <strong>legitimate interests</strong>, we have weighed them against your rights and we only proceed where your
          interests don&apos;t override ours. You can object at any time (see section 9).
        </p>
        <p>
          We do <strong>not</strong> sell your personal data, we do not use it for advertising by other companies, and we do not make decisions
          about you based solely on automated processing that have legal or similarly significant effects on you.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share your data with',
    body: (
      <>
        <p>We share personal data only where needed for the purposes above:</p>
        <h3>Service providers (who process data on our behalf)</h3>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>What they do for us</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cloudflare</td>
              <td>Hosts the Platform, protects it from attacks and determines your country for local pricing</td>
            </tr>
            <tr>
              <td>Neon</td>
              <td>Hosts our database</td>
            </tr>
            <tr>
              <td>Bunny.net</td>
              <td>Stores and streams course videos, and stores images such as profile photos and course pictures</td>
            </tr>
            <tr>
              <td>Resend and Brevo</td>
              <td>Send our emails (codes, receipts, booking updates and, if you subscribe, newsletters)</td>
            </tr>
            <tr>
              <td>Paystack and Stripe</td>
              <td>Process payments and refunds. They are also controllers of the payment data you give them and follow their own privacy policies</td>
            </tr>
            <tr>
              <td>Google</td>
              <td>&ldquo;Sign in with Google&rdquo;, and Google Calendar and Meet for 1-on-1 sessions</td>
            </tr>
          </tbody>
        </table>
        <p>
          These providers may only use your data to provide their service to us, under contracts that require them to keep it secure and
          confidential.
        </p>
        <h3>Instructors and students</h3>
        <ul>
          <li>
            When you book a 1-on-1 session, the instructor sees your name, the session details, your notes and, once confirmed, your email
            address (it is added to the meeting invitation).
          </li>
          <li>Students see an instructor&apos;s public profile: name, photo, title, biography, prices, availability, ratings and reviews.</li>
          <li>Reviews you leave may be shown publicly with your first name.</li>
          <li>Instructors may see totals of how their courses perform (for example the number of viewers), not individual students&apos; watch history.</li>
        </ul>
        <h3>Others</h3>
        <ul>
          <li>Professional advisers (such as lawyers and accountants) under a duty of confidentiality.</li>
          <li>Authorities, regulators or courts where the law requires it, or to protect the rights, safety or property of Upbreed, our users or others.</li>
          <li>A buyer or investor, if Upbreed is involved in a merger, sale or reorganisation. Your data would remain protected under this policy, and we would tell you.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'International transfers',
    body: (
      <>
        <p>
          Some of our providers store or process data outside Nigeria, for example in the European Union, the United Kingdom or the United
          States. When your data leaves Nigeria (or the EEA/UK, if you are there), we make sure it stays protected as the NDPA (and, where
          relevant, the GDPR) requires, for example by using providers in countries considered to give adequate protection, or by relying on
          contracts with standard data protection clauses and the providers&apos; own security commitments.
        </p>
        <p>Contact {mail(PRIVACY)} if you would like more information about these safeguards.</p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep your data',
    body: (
      <>
        <ul>
          <li>
            <strong>Account, profile and learning history:</strong> for as long as your account is open. If you ask us to delete your account,
            we delete or anonymise this data within 30 days, apart from what we must keep (below).
          </li>
          <li>
            <strong>Payment, refund and payout records:</strong> for as long as tax and accounting laws require, generally six years after the end
            of the relevant financial year.
          </li>
          <li>
            <strong>1-on-1 booking records and reviews:</strong> for as long as both accounts exist, then anonymised; financial parts are kept as
            payment records.
          </li>
          <li>
            <strong>Messages to support:</strong> up to two years after the conversation ends.
          </li>
          <li>
            <strong>Verification and password-reset codes:</strong> they expire after a few minutes and are deleted once used or expired.
          </li>
          <li>
            <strong>Newsletter list:</strong> until you unsubscribe. We keep a record of the unsubscribe so we don&apos;t email you again.
          </li>
          <li>
            <strong>Technical logs:</strong> a short period, usually no longer than 30 days, unless needed to investigate a security problem.
          </li>
        </ul>
        <p>We may keep data longer if we need it to resolve a dispute, enforce our terms or meet a legal requirement.</p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'How we protect your data',
    body: (
      <>
        <p>We use technical and organisational measures appropriate to the risk, including:</p>
        <ul>
          <li>encryption of data in transit (HTTPS) between your device, our servers and our providers;</li>
          <li>passwords stored only as strong one-way hashes;</li>
          <li>sign-in tokens kept in secure cookies that page scripts can&apos;t read, and that expire;</li>
          <li>signed, time-limited links for course videos;</li>
          <li>access to personal data limited to staff who need it, with separate admin accounts;</li>
          <li>checks of every request against your account&apos;s permissions.</li>
        </ul>
        <p>
          No system is perfectly secure. If a personal data breach is likely to put you at risk, we will tell the NDPC within the time the law
          requires (72 hours of becoming aware of it) and tell you without undue delay, with advice on what to do.
        </p>
        <p>Please keep your password private and tell us straight away at {mail(PRIVACY)} if you think someone has accessed your account.</p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <p>Under the NDPA (and the GDPR, if it applies to you) you have the right to:</p>
        <ul>
          <li><strong>be informed</strong> about how we use your data (this policy);</li>
          <li><strong>access</strong> your personal data and get a copy of it;</li>
          <li><strong>correct</strong> data that is wrong or incomplete (you can update most of it yourself in Settings);</li>
          <li><strong>delete</strong> your data (&ldquo;right to be forgotten&rdquo;), subject to what we must keep by law;</li>
          <li><strong>restrict</strong> how we use your data in certain cases;</li>
          <li><strong>object</strong> to uses based on legitimate interests, and to direct marketing at any time;</li>
          <li><strong>data portability</strong>: receive the data you gave us in a common, machine-readable format;</li>
          <li><strong>withdraw consent</strong> at any time where we rely on it, without affecting what we did before;</li>
          <li>not be subject to decisions based solely on automated processing with legal or similarly significant effects;</li>
          <li>
            <strong>complain</strong> to the Nigeria Data Protection Commission (ndpc.gov.ng), or to your local data protection authority if you
            are in the EEA or UK. We&apos;d appreciate the chance to sort out your concern first.
          </li>
        </ul>
        <p>
          To use any of these rights, email {mail(PRIVACY)} from the email address on your account. We may need to confirm your identity. We will
          reply within 30 days. This is free, unless a request is clearly unfounded or excessive.
        </p>
      </>
    ),
  },
  {
    id: 'emails',
    title: 'Emails we send you',
    body: (
      <>
        <p>
          <strong>Service emails</strong> (verification codes, password resets, receipts, renewal notices, booking updates and important changes
          to our terms) are part of the service, so you will get them while you have an account.
        </p>
        <p>
          <strong>Newsletters and offers</strong> are only sent if you agree. Every one has an &ldquo;unsubscribe&rdquo; link, and you can also email{' '}
          {mail(PRIVACY)}.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and similar technologies',
    body: (
      <>
        <p>We only use what is needed to run the Platform. We do not use advertising or cross-site tracking cookies.</p>
        <table>
          <thead>
            <tr>
              <th>Name / type</th>
              <th>Purpose</th>
              <th>How long</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>rf (cookie)</td>
              <td>Keeps you signed in</td>
              <td>Up to 30 days, or until you log out</td>
            </tr>
            <tr>
              <td>Browser storage (session)</td>
              <td>Remembers that you have already seen the loading screen in this tab</td>
              <td>Until you close the tab</td>
            </tr>
            <tr>
              <td>Browser storage (local)</td>
              <td>Small preferences and sign-up details needed to finish signing in</td>
              <td>Until you log out or clear your browser</td>
            </tr>
            <tr>
              <td>Video player (Bunny.net)</td>
              <td>Plays videos and remembers player settings such as volume</td>
              <td>Set by the player</td>
            </tr>
            <tr>
              <td>Payment pages (Paystack, Stripe)</td>
              <td>Fraud prevention and completing your payment on their checkout pages</td>
              <td>Set by the provider</td>
            </tr>
          </tbody>
        </table>
        <p>
          These are strictly necessary, so they don&apos;t need your consent. You can block or delete cookies in your browser settings, but you won&apos;t
          be able to stay signed in. If we ever add analytics or marketing cookies, we will ask for your consent first and update this policy.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Age limits and children',
    body: (
      <>
        <p>
          You must be at least <strong>16</strong> to create an account. If you are 16 or 17, a parent or guardian must agree to you using the
          Platform and to this policy, and should manage any payments.
        </p>
        <p>
          We do not knowingly collect data from children under 16. If you believe a child under 16 has given us personal data, contact{' '}
          {mail(PRIVACY)} and we will delete it.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy as the Platform or the law changes. The date at the top shows the latest version. If we make important
        changes, we will tell you by email or on the Platform before they take effect.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>
          Questions, requests or concerns about your personal data: {mail(PRIVACY)}.
          <br />
          Questions about our terms: {mail('legal@upbreedlearn.com')}.
        </p>
        <p>
          Upbreed Learn, Lagos, Nigeria. See also our <Link href="/terms">Terms of Service</Link>.
        </p>
      </>
    ),
  },
];

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    updated={UPDATED}
    intro={
      <p>
        Your privacy matters to us. This policy explains, in plain language, what personal data Upbreed Learn collects when you use our website
        and apps, why we collect it, who we share it with, how long we keep it, and the rights you have over it.
      </p>
    }
    sections={sections}
  />
);

export default Privacy;
