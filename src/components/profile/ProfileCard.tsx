import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { fetchProfileInfo } from '@/lib/data';
import Image from 'next/image';
import { IconUserSquareRounded } from '@tabler/icons-react';

interface PropsTypes {
  mode: string;
}

export async function PersonalCard() {
  const profileInfo = await fetchProfileInfo();
  return (
    <div className="card card-border bg-secondary w-full max-w-[750px]">
      <div className="card-body">
        <div className="flex flex-row gap-2">
          <IconUserSquareRounded />
          <h2 className="card-title">User Profile</h2>
        </div>
        <div className="divider" />
        <div className="flex flex-row gap-2 md:gap-4">
          <div className="avatar">
            <div className="w-40 rounded-full">
              <Image
                src={profileInfo?.User.image_url || '/profile_image_default.png'}
                alt="Image Profile"
                height={200}
                width={200}
              />
            </div>
          </div>
          <div>
            <p className="font-bold text-lg">{profileInfo?.User.name}</p>
            <p>{profileInfo?.User.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileCard({ mode }: PropsTypes) {
  return <>{mode === 'personal' && <PersonalCard />}</>;
}
