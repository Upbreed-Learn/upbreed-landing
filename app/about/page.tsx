import H1 from '@/components/header-text';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upbreed Learn | Who we are',
  description:
    'Upbreed Learn is an online learning platform that aims to revolutionize education across Africa and beyond.',
};

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-7xl px-18">
        <H1 className="py-16">Who we are</H1>
      </section>
      <div className="flex w-full justify-center bg-[#F2F2F2]">
        <section className="w-full max-w-7xl px-18 py-20">
          <p className="text-lg/6 font-medium">
            Upbreed Learn is an online learning platform that aims to
            revolutionize education across Africa and beyond. We provide an
            extensive range of online courses, empowering learners with skills
            and knowledge tailored to their personal and professional growth.
            Our platform offers an immersive, flexible learning experience
            through personalized recommendations, adaptive technology, and
            diverse course offerings. <br /> <br />
            What sets Upbreed Learn apart is our commitment to fostering
            collaboration and community. Learners can connect with peers,
            mentors, and industry experts, enhancing their educational journey.
            We offer access to top African instructors who bring real-world
            expertise, ensuring that the content is both relevant and inspiring.{' '}
            <br /> <br />
            Whether you're looking to upskill, explore a new hobby, or advance
            in your career, Upbreed Learn offers flexible, high-quality
            education at an affordable price. Our subscription-based model
            provides unlimited access to learning resources across devices,
            making learning accessible anytime, anywhere. <br /> <br />
            Join us as we create a global learning ecosystem and transform
            education through technology, empowering individuals to reach their
            full potential.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
