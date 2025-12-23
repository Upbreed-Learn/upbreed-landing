// 84px is the height of the navbar

import { cn } from '@/lib/utils';
import Image from 'next/image';
import logo from '@/public/upbreed-logo.svg';

const SuspenseLoader = (props: { className?: string }) => {
  const { className } = props;

  return (
    <div
      className={cn(
        'flex h-[calc(100vh-84px)] w-full items-center justify-center',
        className,
      )}
    >
      <Image src={logo} alt="upbreed logo" className="animate-pulse" />
    </div>
  );
};

export default SuspenseLoader;
