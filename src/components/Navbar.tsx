import { fetchProfileInfo } from '@/lib/data';
import { signOut } from '@/lib/actions';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';

export default async function Navbar() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  let profileImage = '/profile_image_default.png';
  let profileName = '';
  let profileRole = '';

  if (session) {
    const profileInfo = await fetchProfileInfo();
    profileName = profileInfo?.User.name || '';
    profileRole = profileInfo?.User.roles?.name || '';
    profileImage = profileInfo?.User.image_url || '/profile_image_default.png';
  }

  return (
    <nav className="navbar justify-between bg-secondary shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className=" contents">
        <Link href="/" className="flex flex-row items-center gap-2 px-2">
          <Image alt="Logo" src="/LinkMatch_Logo.webp" width={40} height={40} />
          <p className="text-xl font-mono p-0 font-bold">LinkMatch</p>
        </Link>
      </div>

      <div className="hidden md:flex gap-4">
        {session ? (
          <div className="flex flex-col justify-center items-center gap-0">
            <p>{profileName}</p>
            <p className="text-end self-end text-base-content/75 text-sm">{profileRole}</p>
          </div>
        ) : (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/about">Tentang</Link>
            </li>
            <li>
              <Link href="/contact">Hubungi Kami</Link>
            </li>
          </ul>
        )}

        {session ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full border border-primary-light">
                <Image alt="Profile Image" src={profileImage} width={40} height={40} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-accent rounded-box z-1 mt-3 w-40 p-2">
              <li>
                <Link href="/talents">Cari Talenta</Link>
              </li>
              <li>
                <Link href="/messages">Messages</Link>
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
                <button onClick={signOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <Link href="/sign-up">
              <button className="btn btn-sm md:btn-md bg-primary hover:bg-primary/75">Sign Up</button>
            </Link>
            <Link href="/sign-in">
              <button className="btn btn-sm md:btn-md bg-primary hover:bg-primary/75">Sign In</button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu (Client) */}
      <MobileMenu session={session} onSignOut={signOut} />
    </nav>
  );
}
