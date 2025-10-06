'use client';

import { useState, useEffect } from 'react';
import { fetchProfileInfo } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default function MobileMenu({
  session,
  onSignOut,
  unreadCount = 0,
}: {
  session: any;
  onSignOut: () => void;
  unreadCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [image_url, setImage_url] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileFetch = await fetchProfileInfo();
        setRole(profileFetch?.User.roles?.name ?? '');
        setName(profileFetch?.User.name ?? '');
        setImage_url(profileFetch?.User.image_url ?? '');
      } catch (error) {}
    };
    fetchProfile();
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button className="md:hidden btn btn-ghost btn-circle" onClick={() => setOpen(true)} aria-label="Open Menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-64 bg-secondary text-white transform
        ${open ? 'translate-x-0' : 'translate-x-full'}
        transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <p className="text-xl font-bold">Menu</p>
          <button onClick={() => setOpen(false)} className="btn btn-ghost btn-circle" aria-label="Close Menu">
            ✕
          </button>
        </div>
        <ul className="text-center p-4 space-y-2">
          {session && (
            <Link href="/profile">
              <div className="flex flex-col justify-center items-center px-1 py-2 gap-2">
                <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
                  <Image
                    src={image_url || '/profile_image_default.png'}
                    alt={name || 'Profile Picture'}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="font-bold text-sm text-center">{name}</p>
                  <p className="text-sm text-white/75 text-center">{role}</p>
                </div>
              </div>
              <span className="divider" />
            </Link>
          )}
          {session && role === 'Recruiter' && (
            <li>
              <Link href="/magic-matcher" onClick={() => setOpen(false)}>
                Magic Matcher
              </Link>
            </li>
          )}

          <li>
            <Link href="/talents" onClick={() => setOpen(false)}>
              Cari Talenta
            </Link>
          </li>

          <li>
            <Link href="/about" onClick={() => setOpen(false)}>
              Tentang
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Hubungi Kami
            </Link>
          </li>

          {session ? (
            <>
              <li>
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/messages"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1"
                >
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSignOut();
                    setOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="pt-4 border-t border-gray-700">
                <Link href="/sign-up">
                  <button className="btn w-full bg-primary hover:bg-primary/75" onClick={() => setOpen(false)}>
                    Sign Up
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/sign-in">
                  <button className="btn w-full bg-primary hover:bg-primary/75" onClick={() => setOpen(false)}>
                    Sign In
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />}
    </>
  );
}
