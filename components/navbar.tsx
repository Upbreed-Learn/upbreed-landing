'use client';

import Link from 'next/link';
import logo from '@/public/upbreed-logo.svg';
import {
  ChevronDown,
  ChevronRight,
  CircleQuestionMark,
  Headset,
  Info,
  LogOutIcon,
  Menu,
  Search,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { Input } from './ui/input';
import NavLink from './navlink';
import AvatarCustom from './ui/custom/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import CashOutline from './jsx-icons/cash-outline';
import Image from 'next/image';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import AuthBanner from './auth-banner';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const Navbar = () => {
  const { ref, isVisible } = useIntersectionObserver();
  const pathname = usePathname();

  return (
    <>
      <nav ref={ref} className="flex justify-center bg-[#001C0C]">
        <div className="flex w-full max-w-7xl items-center justify-between px-18 pt-7 pb-5 text-white">
          <Link href="/">
            <Image src={logo} alt="upbreed logo" />
          </Link>
          {!pathname.includes('news') && !pathname.includes('press') ? (
            <>
              <div className="flex items-center gap-6">
                <ClassesHover>
                  <p className="text-sm/[100%] font-semibold">Classes</p>
                  <ChevronDown />
                </ClassesHover>
                <NavLink
                  href={'/pricing'}
                  className={cn(
                    'before:hidden hover:text-[#D0EA50]',
                    pathname === '/pricing' && 'text-[#D0EA50]',
                  )}
                >
                  Pricing
                </NavLink>
              </div>
              <div className="flex items-center gap-3">
                <CircleQuestionMark />
                <div className="relative">
                  <Input
                    placeholder="Search"
                    type="search"
                    className="w-[16.775rem] rounded-[2.75rem] bg-white pl-11 text-xs/[100%] font-medium text-black placeholder:text-[#C8C8C8]"
                  />
                  <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-[#001A72]" />
                </div>
              </div>
              <div className="flex items-center gap-8">
                <Button
                  // onClick={handleLogin}
                  className="cursor-pointer bg-transparent text-white hover:bg-transparent"
                >
                  Login
                </Button>
                <Button
                //  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </div>
              {/* <div className="flex items-center gap-9">
                <NavLink href="/1-on-1">1 - on - 1</NavLink>
                <NavLink href="/courses">My Courses</NavLink>
              </div>
              <div className="flex items-center gap-7">
                <MenuDropdown>
                  <Menu />
                </MenuDropdown>
                <AvatarCustom src={''} alt="Avatar" fallback="JO" />
              </div> */}
            </>
          ) : (
            <p className="text-sm/[100%] font-semibold">
              {pathname.includes('news') ? 'News' : 'Press Coverage '}
            </p>
          )}
        </div>
      </nav>
      <AuthBanner
        className={cn(
          isVisible && 'translate-y-20 transition-transform duration-500',
        )}
      />
    </>
  );
};

export default Navbar;

const MenuDropdown = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer p-1">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex min-w-35.75 flex-col items-end gap-2 border-none bg-[#305B43] px-3.5 py-5 text-white">
        <DropdownMenuItem asChild>
          <Link
            href="/about"
            className="group flex w-full cursor-pointer items-center justify-end gap-3"
          >
            About
            <Info className="text-white group-hover:text-black" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/pricing"
            className="group flex w-full cursor-pointer items-center justify-end gap-3"
          >
            Pricing
            <CashOutline className="group-hover:hidden" />
            <CashOutline stroke="black" className="hidden group-hover:block" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/privacy"
            className="group flex w-full cursor-pointer items-center justify-end gap-3"
          >
            Privacy
            <ShieldAlert className="text-white group-hover:text-black" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="group flex w-full cursor-pointer items-center justify-end gap-3"
          >
            Settings
            <Settings className="text-white group-hover:text-black" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/help-centre"
            className="group flex w-full cursor-pointer items-center justify-end gap-3"
          >
            Help centre
            <Headset className="text-white group-hover:text-black" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="group flex w-full cursor-pointer items-center justify-end gap-3">
            Logout
            <LogOutIcon className="rotate-180 text-white group-hover:text-black" />
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ClassesHover = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return (
    <HoverCard>
      <HoverCardTrigger className="flex cursor-pointer items-center gap-1">
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={26}
        className="flex w-auto gap-36.5 border-transparent bg-[#305B43] pt-11.5 pr-33.5 pb-20 pl-14"
      >
        <div className="flex flex-col gap-6 text-sm/4 font-semibold text-white">
          <h5 className="flex items-center gap-1 text-[#D0EA50]">
            All Courses <ChevronRight />
          </h5>
          <ul className="flex flex-col gap-3">
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('illustration')}
              >
                Illustration
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('craft')}
              >
                Craft
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer font-bold"
                // onClick={() => setCourse('marketing')}
              >
                Marketing & Business
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('photography')}
              >
                Photography & Video
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('design')}
              >
                Design
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('3d-animation')}
              >
                3D & Animation
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('architecture')}
              >
                Architecture
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('writing')}
              >
                Writing
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('fashion')}
              >
                Fashion
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('web-and-app-design')}
              >
                Web & App Design
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('caligraphy')}
              >
                Calligraphy & Typography
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('music')}
              >
                Music & Audio
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('culinary')}
              >
                Culinary
              </button>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-6 text-sm/6 font-semibold text-white">
          <h4 className="text-[#34A853]">Course Bundles</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('new-courses')}
              >
                New Courses
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('top-rated')}
              >
                Top rated
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('popular-courses')}
              >
                Popular courses
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                // onClick={() => setCourse('gifts')}
              >
                Gifts
              </button>
            </li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
