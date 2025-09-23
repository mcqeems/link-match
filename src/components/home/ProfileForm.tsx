'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { postProfileInfo } from '@/lib/actions';
import type { categories } from '@/generated/prisma';
import { useState } from 'react';

type FormState = {
  error: string | null;
  success: boolean;
};

type profileWithUserAndRoles = {
  id: number;
  user_id: string;
  headline: string | null;
  description: string | null;
  experiences: string | null;
  category_id: number | null;
  website: string | null;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;
  image_url?: string | null;
  role?: string | null;
  User: {
    roles: { name: string } | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn btn-sm md:btn-md bg-primary hover:bg-primary/75">
      {pending ? <span className="loading loading-spinner loading-md"></span> : 'Simpan Profil'}
    </button>
  );
}

export default function ProfileForm({
  profileInfo,
  categories,
}: {
  profileInfo: profileWithUserAndRoles | null;
  categories: categories[];
}) {
  const initialState: FormState = { error: null, success: false };

  const postProfileInfoAction = async (prevState: FormState, formData: FormData) => {
    return postProfileInfo(formData);
  };

  const [state, formAction] = useActionState(postProfileInfoAction, initialState);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');

  const incrementPage = () => {
    if (role === 'recruiter') {
      setPage((prevCount) => prevCount + 2);
    }

    if (role === 'talenta') {
      setPage((prevCount) => prevCount + 1);
    }

    if (role === '' || !role) {
      return null;
    }
  };

  const nextButton = () => {
    return (
      <button className="btn btn-sm md:btn-md bg-primary hover:bg-primary/75 mt-5" onClick={incrementPage}>
        Next
      </button>
    );
  };

  const currentCategoryName = categories.find((c) => c.id === profileInfo?.category_id)?.name || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto">
      <div className="bg-primary rounded-xl p-6 w-full max-w-4xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Selamat datang di LinkMatch!</h2>
        <p className="mb-6">
          Untuk melanjutkan penggunaan terhadap aplikasi kami, silahkan mengisi informasi berikut ini terlebih dahulu
          ya!
        </p>
        <form action={formAction} className="space-y-6 rounded-lg p-8 shadow-md bg-accent">
          {/* Pesan Status Form */}
          {state.error && <div className="rounded-md bg-red-100 p-3 text-red-700 text-center">{state.error}</div>}

          {page === 1 ? (
            <div className="space-y-2 flex flex-col">
              <label className="block font-medium ">Saya seorang:</label>
              <div className="flex items-center gap-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    defaultChecked={profileInfo?.role === 'recruiter'}
                    onClick={() => {
                      setRole('recruiter');
                    }}
                    className="radio bg-primary border-primary/20 checked:bg-primary-75 checked:text-primary checked:border-primary"
                  />
                  <span className="ml-2 ">Recruiter</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="talenta"
                    defaultChecked={profileInfo?.role === 'talenta'}
                    onClick={() => {
                      setRole('talenta');
                    }}
                    className="radio bg-primary border-primary/20 checked:bg-primary-75 checked:text-primary checked:border-primary"
                  />
                  <span className="ml-2 ">Talent</span>
                </label>
              </div>
              {nextButton()}
            </div>
          ) : null}

          {page === 2 ? (
            <div className="space-y-5 flex flex-col">
              <div>
                <label htmlFor="headline" className="mb-2 block font-medium ">
                  Headline
                </label>
                <input
                  id="headline"
                  name="headline"
                  type="text"
                  defaultValue={profileInfo?.headline || ''}
                  placeholder="Full Stack Developer"
                  className="w-full rounded-md input"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block font-medium ">
                  Kategori
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  list="category-list"
                  defaultValue={currentCategoryName}
                  placeholder="cth: Web Developer"
                  className="w-full rounded-md input"
                />
                <datalist id="category-list">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block font-medium ">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={profileInfo?.description || ''}
                  placeholder="Ceritakan tentang diri Anda..."
                  className="w-full rounded-md input"
                ></textarea>
              </div>

              <div>
                <label htmlFor="experiences" className="mb-2 block font-medium ">
                  Pengalaman
                </label>
                <textarea
                  id="experiences"
                  name="experiences"
                  rows={4}
                  defaultValue={profileInfo?.experiences || ''}
                  placeholder="Sebutkan pengalaman relevan Anda..."
                  className="w-full rounded-md input"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="website" className="mb-2 block font-medium ">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    defaultValue={profileInfo?.website || ''}
                    placeholder="https://your-personal-website.com"
                    className="w-full rounded-md input"
                  />
                </div>
                <div>
                  <label htmlFor="linkedin" className="mb-2 block font-medium ">
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    defaultValue={profileInfo?.linkedin || ''}
                    placeholder="https://linkedin.com/in/"
                    className="w-full rounded-md input"
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className="mb-2 block font-medium ">
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="url"
                    defaultValue={profileInfo?.instagram || ''}
                    placeholder="https://instagram.com/"
                    className="w-full rounded-md input"
                  />
                </div>
                <div>
                  <label htmlFor="github" className="mb-2 block font-medium ">
                    GitHub
                  </label>
                  <input
                    id="github"
                    name="github"
                    type="url"
                    defaultValue={profileInfo?.github || ''}
                    placeholder="https://github.com/"
                    className="w-full rounded-md input"
                  />
                </div>
              </div>
              {nextButton()}
            </div>
          ) : null}

          {page === 3 ? (
            <div className="flex flex-col gap-4">
              <div className="flex md:flex-row flex-col-reverse md:justify-between justify-center items-center md:items-start md:gap-4 gap-2">
                <div>
                  <label htmlFor="image" className="mb-2 block font-medium">
                    Foto Profil
                  </label>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Pick a file</legend>
                    <input type="file" id="image" accept="image/png, image/jpeg, image/jpg" className="file-input" />
                    <label className="label">Max size 2MB</label>
                  </fieldset>
                </div>
                <div className="w-full h-[130px]  max-w-[130px] border border-dashed border-primary">
                  {/* Image preview after upload */}
                </div>
              </div>
              <SubmitButton />
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
