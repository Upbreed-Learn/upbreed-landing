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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const Navbar = () => {
  const { ref, isVisible } = useIntersectionObserver();
  const pathname = usePathname();

  return (
    <>
      <nav
        ref={ref}
        className="relative z-99 flex w-full justify-center bg-[#001C0C]"
      >
        <div className="flex w-full max-w-7xl items-center justify-between px-9 py-7 text-white md:px-12 md:pt-7 md:pb-5 lg:px-18">
          <Link href="/">
            <Image src={logo} alt="upbreed logo" />
          </Link>
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
              <div className="flex items-center gap-3">
                <CircleQuestionMark className="max-lg:hidden" />
                <div className="relative">
                  <Input
                    placeholder="Search"
                    type="search"
                    className="w-[16.775rem] rounded-[2.75rem] bg-white pl-11 text-xs/[100%] font-medium text-black placeholder:text-[#C8C8C8] max-lg:hidden"
                  />
                  <div className="flex items-center gap-7">
                    <Search className="text-white lg:absolute lg:top-1/2 lg:left-3 lg:-translate-y-1/2 lg:text-[#001A72]" />
                    <MobileNav>
                      <Menu className="text-[#D0EA50]" />
                    </MobileNav>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 max-lg:hidden">
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

const ALL_COURSES = [
  {
    id: 1,
    name: 'Illustration',
  },
  {
    id: 2,
    name: 'Craft',
  },
  {
    id: 3,
    name: 'Marketing & Business',
  },
  {
    id: 4,
    name: 'Photography & Video',
  },
  {
    id: 5,
    name: 'Design',
  },
  {
    id: 6,
    name: '3D & Animation',
  },
  {
    id: 7,
    name: 'Architecture',
  },
  {
    id: 8,
    name: 'Writing',
  },
  {
    id: 9,
    name: 'Fashion',
  },
  {
    id: 10,
    name: 'Web & App Design',
  },
  {
    id: 11,
    name: 'Calligraphy & Typography',
  },
  {
    id: 12,
    name: 'Music & Audio',
  },
  {
    id: 13,
    name: 'Culinary',
  },
];

const COURSE_BUNDLES = [
  {
    id: 1,
    name: 'New Courses',
  },
  {
    id: 2,
    name: 'Top Rated',
  },
  {
    id: 3,
    name: 'Popular Courses',
  },
  {
    id: 4,
    name: 'Gifts',
  },
];

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
            {ALL_COURSES.map(course => (
              <li key={course.id}>
                <button
                  className="cursor-pointer"
                  // onClick={() => setCourse('illustration')}
                >
                  {course.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6 text-sm/6 font-semibold text-white">
          <h4 className="text-[#34A853]">Course Bundles</h4>
          <ul className="flex flex-col gap-2">
            {COURSE_BUNDLES.map(courseBundle => (
              <li key={courseBundle.id}>
                <button
                  className="cursor-pointer"
                  // onClick={() => setCourse('new-courses')}
                >
                  {courseBundle.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const MobileNav = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">{children}</SheetTrigger>
      <SheetContent
        side="top"
        // style={{
        //   filter: 'blur(4px)',
        //   backdropFilter: 'blur(4px)',
        //   WebkitBackdropFilter: 'blur(4px)',
        // }}
        className="mt-22.75 h-[calc(100vh-5.6875rem)] overflow-auto border-transparent bg-[#305B43] p-0 lg:hidden [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Navigator</SheetTitle>
          <SheetDescription>Navigate through the website.</SheetDescription>
        </SheetHeader>
        <div className="relative flex flex-col gap-6">
          <div className="flex w-full flex-col gap-6 self-end px-11 pt-14 text-end text-sm/6 font-semibold text-white">
            <h4 className="text-[#34A853]">Course Bundles</h4>
            <ul className="flex flex-col gap-2 border-b border-[#FFFFFF33] pb-9">
              {COURSE_BUNDLES.map(courseBundle => (
                <li key={courseBundle.id}>
                  <button
                    className="cursor-pointer"
                    // onClick={() => setCourse('new-courses')}
                  >
                    {courseBundle.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col gap-3 self-end px-11 text-end text-sm/4 font-semibold text-white">
            <ul className="flex flex-col gap-3">
              {ALL_COURSES.map(course => (
                <li key={course.id}>
                  <button
                    className="cursor-pointer"
                    // onClick={() => setCourse('illustration')}
                  >
                    {course.name}
                  </button>
                </li>
              ))}
            </ul>
            <h5 className="flex items-center justify-end gap-1 border-b border-[#FFFFFF33] pb-9 text-[#D0EA50]">
              View All Courses <ChevronRight />
            </h5>
          </div>
          <ul className="flex flex-col gap-3 self-end px-11 pb-36 text-end text-sm/4 font-semibold text-white">
            <li>Settings</li>
            <li>Contact Us</li>
            <li>Gifts</li>
            <li>Log out</li>
          </ul>
          <div className="fixed bottom-0 left-1/2 flex w-screen -translate-x-1/2 flex-col justify-center gap-2 bg-white p-3">
            <Button className="h-12 w-full">Sign Up</Button>
            <Button className="h-12 w-full border border-[#34A853] bg-white">
              Login
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
