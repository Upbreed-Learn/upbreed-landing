import { cn } from '@/lib/utils';

const H1 = (props: { className?: string; children: React.ReactNode }) => {
  const { className, children } = props;
  return (
    <h1
      className={cn(
        'text-4xl leading-[100%] font-extrabold text-[#D0EA50] md:text-[3.555625rem]',
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default H1;
