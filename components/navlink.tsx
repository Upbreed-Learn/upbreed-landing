import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

const NavLink = (props: ComponentProps<typeof Link>) => {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        pathname === props.href &&
          'relative before:absolute before:-bottom-6.25 before:h-1 before:w-full before:bg-[#D0EA50]',
        props.className,
      )}
    />
  );
};

export default NavLink;
