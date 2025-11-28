import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const AuthBanner = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div
      className={cn(
        'fixed bottom-0 z-50 flex w-full justify-center bg-[#305B43]',
        className,
      )}
    >
      <div className="flex w-full max-w-7xl items-center justify-end gap-4 px-18 py-5">
        <p className="text-xs/[100%] font-semibold text-white">
          classes start at <s className="text-[#FFFFFF3B]">$10</s> $5 per month
          (billed annually)
        </p>
        <Button>Sign up</Button>
      </div>
    </div>
  );
};

export default AuthBanner;
