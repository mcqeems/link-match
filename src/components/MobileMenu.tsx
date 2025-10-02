'use client';

import { useState, useEffect } from 'react';
import { fetchProfileInfo } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export default function MobileMenu({ session, onSignOut }: { session: any; onSignOut: () => void }) {
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
            <>
              <li>
                <Link href="/talents" onClick={() => setOpen(false)}>
                  Cari Talenta
                </Link>
              </li>
              {role === 'Recruiter' && (
                <li>
                  <Link href="/magic-matcher" onClick={() => setOpen(false)}>
                    Magic Matcher
                  </Link>
                </li>
              )}
            </>
          )}

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
                <Link href="/messages" onClick={() => setOpen(false)}>
                  Messages
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
        {session && (
          <Link href="/profile">
            <span className="divider" />
            <div className="flex justify-between items-end p-4">
              <Image
                src={image_url || '/profile_image_default.png'}
                alt={name || 'Profile Picture'}
                width={50}
                height={50}
              />
              <div className="flex flex-col gap-2">
                <p className="font-bold text-left">{name}</p>
                <p className="text-sm text-white/75 text-left">{role}</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />}
    </>
  );
}
