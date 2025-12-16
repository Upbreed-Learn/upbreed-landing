import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/public/upbreed-logo.svg';
import ClassesHover from './classes-hover';
import { ChevronDown, CircleQuestionMark, Menu } from 'lucide-react';
import NavLink from '../navlink';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import AuthBanner from '../auth-banner';
import { useState } from 'react';
import SearchInput from './search-courses';
import { useQueryState } from 'nuqs';
import { useGetToken } from '@/lib/queries/hooks';
import MenuDropdown from './menu-dropdown';
import AvatarCustom from '../ui/custom/avatar';

const Navbar = () => {
  const [mobileSearch, setMobileSearch] = useState(false);
  const [_, setAuth] = useQueryState('auth');
  const { ref, isVisible } = useIntersectionObserver();
  const pathname = usePathname();
  const { data } = useGetToken();

  const token = data?.data.token;

  const handleSignUp = () => {
    setAuth('sign-up');
  };

  const handleLogin = () => {
    setAuth('login');
  };

  return (
    <>
      <nav
        ref={ref}
        className="relative z-99 flex w-full justify-center bg-[#001C0C]"
      >
        <div className="flex w-full max-w-7xl items-center justify-between px-9 py-7 text-white md:px-12 md:pt-7 md:pb-5 lg:px-18">
          {!mobileSearch && (
            <Link href="/">
              <Image src={logo} alt="upbreed logo" />
            </Link>
          )}
          {!pathname.includes('news') && !pathname.includes('press') ? (
            <>
              <div className="flex items-center gap-6 max-lg:hidden">
                <ClassesHover>
                  <p className="text-sm/[100%] font-semibold">Classes</p>
                  <ChevronDown />
                </ClassesHover>
                <NavLink
                  href={'/pricing'}
                  className={cn(
                    'hover:text-[#D0EA50]',
                    pathname === '/pricing' && 'text-[#D0EA50]',
                  )}
                >
                  Pricing
                </NavLink>
              </div>
              <div
                className={cn(
                  'flex items-center gap-3',
                  mobileSearch && 'w-full',
                )}
              >
                <CircleQuestionMark className="max-lg:hidden" />
                <SearchInput
                  mobileSearch={mobileSearch}
                  setMobileSearch={setMobileSearch}
                />
              </div>
              {!token && (
                <div className="flex items-center gap-8 max-lg:hidden">
                  <Button
                    onClick={handleLogin}
                    className="cursor-pointer bg-transparent text-white hover:bg-transparent"
                  >
                    Login
                  </Button>
                  <Button onClick={handleSignUp}>Sign Up</Button>
                </div>
              )}
              {token && (
                <>
                  <div className="flex items-center gap-9 max-lg:hidden">
                    <NavLink href="/1-on-1">1 - on - 1</NavLink>
                    <NavLink href="/student/courses">My Courses</NavLink>
                  </div>
                  <div className="flex items-center gap-7 max-lg:hidden">
                    <MenuDropdown>
                      <Menu />
                    </MenuDropdown>
                    <AvatarCustom src={''} alt="Avatar" fallback="JO" />
                  </div>
                </>
              )}
            </>
          ) : (
            <Link
              href={pathname.includes('news') ? '/news' : '/press'}
              className="text-sm/[100%] font-semibold"
            >
              {pathname.includes('news') ? 'News' : 'Press Coverage '}
            </Link>
          )}
        </div>
      </nav>
      {!token && (
        <AuthBanner
          className={cn(
            isVisible && 'translate-y-20 transition-transform duration-500',
          )}
        />
      )}
    </>
  );
};

export default Navbar;

export const CoursesLoading = (props: { className?: string }) => {
  const { className } = props;
  
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {[...Array(5)].map((_, i) => (
        <li key={i}>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
};
