import { IconMoodConfuzed } from '@tabler/icons-react';

export default function Forbidden() {
  return (
    <div className="flex flex-col h-dvh w-full justify-center items-center text-primary-content gap-2">
      <IconMoodConfuzed size={200} />
      <p className="text-center font-bold font-mono md:text-2xl text-xl">
        Maaf anda harus menjadi Recruiter untuk mengakses fitur ini.
      </p>
    </div>
  );
}
