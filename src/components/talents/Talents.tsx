import { fetchProfileAll } from '@/lib/data';

export default async function Talents() {
  try {
    const response = await fetchProfileAll();
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="h-dvh flex justify-center items-center ">
      <p className="text-4xl">Talent</p>
    </div>
  );
}
