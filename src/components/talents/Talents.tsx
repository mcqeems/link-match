import Link from 'next/link';
import Image from 'next/image';
import { fetchProfileTalentAll, getCategories } from '@/lib/data';
import { IconZoomQuestion } from '@tabler/icons-react';

type Props = {
  page?: number;
  category?: number;
  q?: string;
};

export default async function Talents({ page = 1, category, q }: Props) {
  const [data, categories] = await Promise.all([fetchProfileTalentAll(page, category, q), getCategories()]);

  const hrefFor = (p: number) =>
    `/talents?page=${p}${typeof category === 'number' ? `&category=${category}` : ''}${
      q ? `&q=${encodeURIComponent(q)}` : ''
    }`;

  return (
    <div className="max-w-6xl mx-auto p-4 mt-12 md:p-8 min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold md:mb-6 mb-2 font-mono">Talents</h1>

      {/* Filters: Category + Search by name */}
      <form
        method="get"
        action="/talents"
        className="mb-4 flex md:flex-row flex-col items-center justify-center md:gap-3 gap-1"
      >
        <input type="hidden" name="page" value={1} />
        <label className="label p-0">
          <span className="label-text mr-2">Category</span>
        </label>
        <select
          name="category"
          defaultValue={typeof category === 'number' ? String(category) : ''}
          className="select select-bordered select-sm w-full md:max-w-xs"
          aria-label="Filter by category"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="label p-0">
          <span className="label-text mr-2">Search</span>
        </label>
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search by name..."
          className="input input-bordered input-sm w-full"
          aria-label="Search by name"
        />
        <button type="submit" className="btn btn-sm mt-2">
          Apply
        </button>
      </form>

      {data.items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-4">
          <IconZoomQuestion className=" opacity-75" size={100} />
          <p className="text-center text-base-content/60">No talents found.</p>
        </div>
      ) : (
        <div className="grid md:gap-6 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((p) => {
            // Normalize categories to an array for rendering
            const cats: Array<{ id: number; name: string }> = Array.isArray(p.categories)
              ? (p.categories as Array<{ id: number; name: string }>)
              : p.categories
                ? ([p.categories] as Array<{ id: number; name: string }>)
                : [];

            return (
              <div key={p.User.id} className="card bg-secondary shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full overflow-hidden ring ring-base-300/40">
                        <Image
                          src={p.User.image_url || '/profile_image_default.png'}
                          alt={p.User.name || 'Talent'}
                          width={64}
                          height={64}
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/profile/${p.User.id}`}
                        className="font-semibold hover:underline truncate block"
                        title={p.User.name ?? 'Untitled'}
                      >
                        {p.User.name ?? 'Untitled'}
                      </Link>
                      <div className="text-xs opacity-70">{p.User.roles?.name ?? 'Talenta'}</div>
                    </div>
                  </div>

                  {p.headline && <p className="mt-3 text-sm opacity-80">{p.headline}</p>}

                  {cats.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cats.map((c: { id: number; name: string }) => (
                        <span key={c.id} className="badge badge-outline badge-sm">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-4">
                    <Link href={`/profile/${p.User.id}`} className="btn btn-accent btn-sm">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="join">
            <Link
              href={hrefFor(Math.max(1, data.page - 1))}
              aria-disabled={!data.hasPrev}
              className={`join-item btn btn-sm ${!data.hasPrev ? 'btn-disabled' : ''}`}
            >
              «
            </Link>

            {Array.from({ length: data.totalPages }).map((_, idx) => {
              const p = idx + 1;
              const isActive = p === data.page;
              return (
                <Link key={p} href={hrefFor(p)} className={`join-item btn btn-sm ${isActive ? 'btn-active' : ''}`}>
                  {p}
                </Link>
              );
            })}

            <Link
              href={hrefFor(Math.min(data.totalPages, data.page + 1))}
              aria-disabled={!data.hasNext}
              className={`join-item btn btn-sm ${!data.hasNext ? 'btn-disabled' : ''}`}
            >
              »
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
