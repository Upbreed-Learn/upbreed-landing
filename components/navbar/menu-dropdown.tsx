'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Headset, Info, LogOutIcon, Settings, ShieldAlert } from 'lucide-react';
import CashOutline from '../jsx-icons/cash-outline';
import { deleteToken } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';

const MenuDropdown = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await deleteToken();
    queryClient.invalidateQueries({ queryKey: queryKeys.token });
    router.push('/');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer p-1">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-100 flex min-w-35.75 flex-col items-end gap-2 border-none bg-[#305B43] px-3.5 py-5 text-white">
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
            href="/student/settings"
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
          <button
            onClick={handleLogout}
            className="group flex w-full cursor-pointer items-center justify-end gap-3"
          >
            Logout
            <LogOutIcon className="rotate-180 text-white group-hover:text-black" />
            <span className="sr-only">Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;
