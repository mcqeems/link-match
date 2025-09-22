'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ session, onSignOut }: { session: any; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);

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
              <li className="pt-4 border-t border-gray-700">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" onClick={() => setOpen(false)}>
                  Settings
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
