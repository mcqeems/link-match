import { IconMoodConfuzed } from '@tabler/icons-react';
import Link from 'next/link';

export default function Forbidden() {
  return (
    <div className="flex flex-col h-dvh w-full justify-center items-center text-primary-content gap-2">
      <IconMoodConfuzed size={200} />
      <p className="text-center font-bold font-mono md:text-2xl text-xl">
        Maaf anda harus menjadi Recruiter untuk mengakses fitur ini.
        <br />
        <span className="md:text-xl text-sm text-white-75 font-light">
          Silahkan ubah role anda menjadi recruiter terlebih dahulu di edit profile.
        </span>
      </p>
      <Link href="/profile/edit">
        <button className="btn border-white hover:border-black hover:bg-white text-white hover:text-black btn-outline">
          Edit Profile
        </button>
      </Link>
    </div>
  );
}
