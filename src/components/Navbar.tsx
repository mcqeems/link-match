import { fetchProfileInfo, getUnreadMessageCount } from '@/lib/data';
import { signOut } from '@/lib/actions';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import NavbarMenuButton from './NavbarMenuButton';

export default async function Navbar() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  let profileImage = '/profile_image_default.png';
  let profileName = '';
  let profileRole = '';
  let unreadCount = 0;

  if (session) {
    const profileInfo = await fetchProfileInfo();
    profileName = profileInfo?.User.name || '';
    profileRole = profileInfo?.User.roles?.name || '';
    profileImage = profileInfo?.User.image_url || '/profile_image_default.png';

    // Get unread message count
    unreadCount = await getUnreadMessageCount();
  }

  return (
    <nav className="navbar justify-between bg-secondary shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className=" contents">
        <Link href="/" className="flex flex-row items-center gap-2 px-2">
          <Image alt="Logo" src="/LinkMatch_Logo.webp" width={40} height={40} />
          <p className="text-xl font-mono p-0 font-bold">LinkMatch</p>
        </Link>
      </div>

      <div className="hidden md:flex gap-0">
        {session ? (
          <>
            <div className="flex flex-col justify-center items-center gap-0 mr-4">
              <p>{profileName}</p>
              <p className="text-end self-end text-base-content/75 text-sm">{profileRole}</p>
            </div>
            <Link href="/profile">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full border border-primary-light">
                  <Image alt="Profile Image" src={profileImage} width={40} height={40} />
                </div>
              </div>
            </Link>
          </>
        ) : (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/talents">Talenta</Link>
            </li>
            <li>
              <Link href="/about">Tentang</Link>
            </li>
            <li>
              <Link href="/contact">Hubungi Kami</Link>
            </li>
          </ul>
        )}

        {session ? (
          <NavbarMenuButton hasUnreadMessages={unreadCount > 0} unreadCount={unreadCount} onSignOut={signOut} />
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
      <MobileMenu session={session} onSignOut={signOut} unreadCount={unreadCount} />
    </nav>
  );
}
