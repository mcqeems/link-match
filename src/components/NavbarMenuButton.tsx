'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconDotsVertical } from '@tabler/icons-react';

interface UnreadIndicatorProps {
  hasUnreadMessages: boolean;
  unreadCount: number;
  onSignOut: () => void;
}

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function RedDot() {
  return <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-secondary"></span>;
}

export default function NavbarMenuButton({ hasUnreadMessages, unreadCount, onSignOut }: UnreadIndicatorProps) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar relative">
        <IconDotsVertical size={24} />
        {hasUnreadMessages && <RedDot />}
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content bg-secondary rounded-box z-[1000] mt-3 w-40 p-2">
        <li>
          <Link href="/talents">Cari Talenta</Link>
        </li>
        <li>
          <Link href="/magic-matcher">Magic Matcher</Link>
        </li>
        <li className="relative">
          <Link href="/messages" className="flex items-center justify-between">
            <span>Messages</span>
            <UnreadBadge count={unreadCount} />
          </Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/about">Tentang</Link>
        </li>
        <li>
          <Link href="/contact">Hubungi Kami</Link>
        </li>
        <li>
          <button onClick={onSignOut}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
