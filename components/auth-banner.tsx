import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const AuthBanner = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div
      className={cn(
        'fixed bottom-0 z-50 flex w-screen justify-center bg-[#305B43] md:w-full',
        className,
      )}
    >
      <div className="flex w-full max-w-7xl items-center justify-end gap-4 px-9 py-3.5 md:px-12 md:py-5 lg:px-18">
        <p className="text-end text-xs/[100%] font-semibold text-white">
          classes start at <s className="text-[#FFFFFF3B]">$10</s> $5 per month{' '}
          <span className="max-md:block">(billed 6 months/annually)</span>
        </p>
        <Button>Sign up</Button>
      </div>
    </div>
  );
};

export default AuthBanner;
