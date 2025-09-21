import RoleSelector from '@/components/home/RoleSelector';
import { fetchProfileInfo } from '@/lib/data';

export default async function Home() {
  const profileInfo = await fetchProfileInfo();

  if (!profileInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-500">Failed getting profile info.</p>
      </div>
    );
  }

  const role = profileInfo.User.roles?.name;
  console.log(profileInfo);

  return (
    <div>
      <p>Hello, {role}</p>
      <RoleSelector />
    </div>
  );
}
