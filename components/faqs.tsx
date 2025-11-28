import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const QUESTIONS = [
  {
    question: 'What is Upbreed?',
    answer:
      'Upbreed is an online platform that offers expert-led classes across various disciplines, providing users with  opportunities to learn and master new skills, pursue personal interests, and advance their careers. Upbreed aims to empower individuals to unlock their full potential through high-quality instruction, flexible learning options.',
  },
  {
    question: 'Which classes are right for me?',
    answer:
      'Upbreed offers a wide range of classes, catering to different interests and skill levels. Whether you are looking to enhance your technical skills, develop your creativity, or explore new hobbies, Upbreed has something for everyone. Explore the categories below to find the perfect class for you.',
  },
  {
    question: 'What is included in my Upbreed membership?',
    answer:
      'Upbreed offers a variety of membership plans to suit your needs. Choose the plan that best fits your budget and learning goals. All membership plans come with a 30-day satisfaction guarantee, ensuring you get the most out of your membership.',
  },
  {
    question: 'How much does Upbreed cost?',
    answer:
      'Upbreed offers flexible pricing options to suit your budget. Explore the different plans and choose the one that best fits your needs. All membership plans come with a 30-day satisfaction guarantee, ensuring you get the most out of your membership.',
  },
  {
    question: 'What skill-level is required for session?',
    answer:
      'Upbreed offers a wide range of classes, catering to different skill levels. Whether you are looking to enhance your technical skills, develop your creativity, or explore new hobbies, Upbreed has something for everyone. Explore the categories below to find the perfect class for you.',
  },
];

const Faqs = () => {
  return (
    <section className="flex justify-center bg-[#F2F2F2] pt-16 pb-44.25">
      <div className="flex w-full max-w-7xl flex-col gap-29.5 px-44.75">
        <h2 className="text-center text-[2rem]/[100%] font-bold">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible>
          {QUESTIONS.map((question, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{question.question}</AccordionTrigger>
              <AccordionContent>{question.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faqs;
