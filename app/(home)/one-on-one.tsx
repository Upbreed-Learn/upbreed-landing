import { Button } from '@/components/ui/button';

const OneOnOne = () => {
  return (
    <section className="flex justify-center bg-white">
      <div className="flex w-full max-w-7xl flex-col gap-7 px-9 py-20 md:gap-14 md:px-12 md:py-42.5 lg:px-18">
        <div>
          <h2 className="text-2xl font-bold md:text-[2.638125rem]/12">
            Elevate Your skills
          </h2>
          <p className="font-semibold text-[#737373] text-[1.810625rem/[4.125rem]">
            Through tailored one on one sessions{' '}
          </p>
        </div>
        <div className="flex w-full max-w-[38.06525rem] flex-col gap-4 leading-5 font-semibold max-md:text-sm">
          <p>
            1-on-1 Sessions at Upbreed Learn connect learners with seasoned
            industry experts for personalized virtual engagements. These
            sessions provide focused time, tailored advice, and in-depth support
            to help you excel in your field. Enroll in a 1-on-1 session to
            benefit from:
          </p>
          <ul className="list-inside list-disc [&_span]:font-extrabold">
            <li>
              <span>Exclusive Expert Coaching:</span> A private, customized
              learning experience.
            </li>
            <li>
              <span>Insightful Feedback:</span> Receive detailed evaluations of
              your work or projects.
            </li>
            <li>
              <span>Career Growth Guidance:</span> Gain actionable strategies
              and advice to advance professionally.
            </li>
          </ul>
        </div>
        <Button className="w-max">Get Started</Button>
      </div>
    </section>
  );
};

export default OneOnOne;
