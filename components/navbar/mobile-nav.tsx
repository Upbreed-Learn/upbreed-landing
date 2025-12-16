import { Category } from '@/lib/constants';
import { useGetCategories, useGetToken } from '@/lib/queries/hooks';
import { queryKeys } from '@/lib/queries/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import Link from 'next/link';
import ErrorCard from '../error-card';
import EmptyState from '../empty-state';
import { ChevronRight } from 'lucide-react';
import ContactUs from '../contact-us';
import Gifts from '../gifts';
import { Button } from '../ui/button';
import { CoursesLoading } from '.';
import { COURSE_BUNDLES } from './classes-hover';
import { cn } from '@/lib/utils';
import { deleteToken } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';

const MobileNav = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [_, setAuth] = useQueryState('auth');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isPending, isError } = useGetCategories();
  const { data: tokenData } = useGetToken();

  const token = tokenData?.data.token;
  const categories: Omit<
    Category['category'],
    'createdAt' | 'updatedAt' | 'deletedAt'
  >[] = data?.data.data;

  const handleRetry = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.categories.all,
    });
  };

  const handleSignUp = () => {
    setAuth('sign-up');
  };

  const handleLogin = () => {
    setAuth('login');
  };

  const handleLogout = async () => {
    await deleteToken();
    queryClient.invalidateQueries({ queryKey: queryKeys.token });
    setOpen(false);
    router.push('/');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden">{children}</SheetTrigger>
      <SheetContent
        side="top"
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
                  <Link
                    href={`/student/home?courseBundles=${courseBundle.name.trim()}`}
                    onClick={() => setOpen(false)}
                    className="hover:text-[#D0EA50]"
                  >
                    {courseBundle.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col gap-6 self-end px-11 pt-14 text-end text-sm/6 font-semibold text-white">
            {isError ? (
              <ErrorCard handleRetry={handleRetry} />
            ) : (
              <ul className="flex flex-col gap-3">
                {isPending ? (
                  <CoursesLoading className="self-end" />
                ) : categories.length > 0 ? (
                  categories.map(category => (
                    <li key={category.id}>
                      <li key={category.id}>
                        <Link
                          href={`/student/home?allCourses=${category.id}`}
                          onClick={() => setOpen(false)}
                          className="hover:text-[#D0EA50]"
                        >
                          {category.name}
                        </Link>
                      </li>
                    </li>
                  ))
                ) : (
                  <EmptyState
                    title="No Categories Found"
                    description="When we have categories, it will be listed here."
                  />
                )}
              </ul>
            )}
            <Link
              href={'/student/home'}
              onClick={() => setOpen(false)}
              className="flex items-center justify-end gap-1 border-b border-[#FFFFFF33] pb-9 text-[#D0EA50]"
            >
              View All Courses <ChevronRight />
            </Link>
          </div>

          <ul
            className={cn(
              'flex flex-col gap-3 self-end px-11 text-end text-sm/4 font-semibold text-white',
              token ? 'pb-11' : 'pb-48',
            )}
          >
            {token && (
              <li>
                <Link onClick={() => setOpen(false)} href="/student/settings">
                  Settings
                </Link>
              </li>
            )}
            <li>
              <ContactUs>Contact Us</ContactUs>
            </li>
            <li>
              <Gifts>Gifts</Gifts>
            </li>
            {token && (
              <li>
                <button onClick={handleLogout}>Log out</button>
              </li>
            )}
          </ul>
          {!token && (
            <div className="fixed bottom-0 left-1/2 flex w-screen -translate-x-1/2 flex-col justify-center gap-2 bg-white p-3">
              <Button onClick={handleSignUp} className="h-12 w-full">
                Sign Up
              </Button>
              <Button
                onClick={handleLogin}
                className="h-12 w-full border border-[#34A853] bg-white"
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
