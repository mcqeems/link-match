import ProfileCard from '@/components/profile/ProfileCard';

export async function PageParam(params: { uuid: string }) {
  return params.uuid;
}

export default async function PublicProfile({ params }: { params: { uuid: string } }) {
  const uuid = await PageParam(params);

  return (
    <div className="min-h-screen py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <ProfileCard mode="public" uuid={uuid} />
      </div>
    </div>
  );
}
