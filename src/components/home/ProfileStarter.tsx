import ProfileForm from './ProfileForm';
import { getCategories, fetchProfileInfo } from '@/lib/data';

export default async function ProfileStarter() {
  const profileInfo = await fetchProfileInfo();
  const categories = await getCategories();

  return (
    <div>
      <ProfileForm profileInfo={profileInfo} categories={categories} />
    </div>
  );
}
