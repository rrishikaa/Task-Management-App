'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, count: 0 },
  { name: 'Team', href: '/team', icon: UsersIcon, count: 5 },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon, count: 0 },
];


type NavItem = typeof navItems[0];

const NavLink: React.FC<{ item: NavItem; currentPath: string }> = ({
  item,
  currentPath,
}) => {
  const isActive = item.href === currentPath;

  const baseClasses =
    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out';
  const activeClasses = 'bg-[#6366f1] text-white';
  const inactiveClasses =
    'text-indigo-200 hover:text-white hover:bg-[#6366f1]';

  return (
    <Link
      href={item.href}
      className={`${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      <item.icon
        className={`mr-3 h-6 w-6 flex-shrink-0 ${
          isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
        }`}
        aria-hidden="true"
      />
      {item.name}
      {item.count > 0 && (
        <span
          className={`ml-auto inline-block py-0.5 px-3 text-xs rounded-full ${
            isActive
              ? 'bg-gray-200 text-black'
              : 'bg-gray-200 text-black'
          }`}
        >
          {item.count}
        </span>
      )}
    </Link>
  );
};

export default function Sidebar() {
  const [isOpen] = useState(true);
  const currentPath = usePathname();

  return (
    <aside className="h-screen w-64 fixed top-0 left-0 bg-gray-800 transition-all duration-300 z-30 flex flex-col">
      {/* LOGO */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700 p-4 gap-2">
  <Link href="/" className="flex items-center gap-2 cursor-pointer">
    <div className="relative w-10 h-10">
      <Image
        src="/TaskLogo.svg"
        alt="Task Logo"
        fill
        sizes="40px"
        priority
        className="object-contain"
      />
    </div>
    <span className="text-xl font-bold text-white whitespace-nowrap overflow-hidden">
      {isOpen ? 'Stride' : 'S'}
    </span>
  </Link>
</div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.name} className={isOpen ? '' : 'flex justify-center'}>
            <NavLink item={item} currentPath={currentPath} />
          </div>
        ))}
      </nav>

      {/* SETTINGS LINK */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className={isOpen ? '' : 'flex justify-center'}>
          <Link
            href="/settings"
            className={`group flex items-center p-2 text-sm font-medium rounded-md w-full ${
              currentPath === '/settings'
                ? 'bg-[#6366f1] text-white'
                : 'text-indigo-200 hover:text-white hover:bg-[#6366f1]'
            }`}
          >
            <CogIcon
              className={`mr-3 h-6 w-6 flex-shrink-0 ${
                currentPath === '/settings'
                  ? 'text-white'
                  : 'text-indigo-300 group-hover:text-white'
              }`}
            />
            {isOpen && 'Settings'}
          </Link>
        </div>
      </div>
    </aside>
  );
}
