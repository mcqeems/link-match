'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useState } from 'react';
import { updateProfile } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Select from 'react-select';
import {
  IconWorld,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
  IconInfoCircle,
  IconBriefcase,
  IconArrowLeft,
  IconUser,
} from '@tabler/icons-react';

type FormState = {
  error: string | null;
  success: boolean;
};

type ProfileInfoType = {
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
  User: {
    id: string;
    name: string | null;
    email: string;
    image_url: string | null;
    roles: { name: string } | null;
  };
  categories?: { id: number; name: string } | null;
};

type CategoryType = {
  id: number;
  name: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn btn-primary btn-sm md:btn-md">
      {pending ? <span className="loading loading-spinner loading-md"></span> : 'Simpan Perubahan'}
    </button>
  );
}

export default function ProfileEditForm({ 
  profileInfo, 
  categories 
}: { 
  profileInfo: ProfileInfoType; 
  categories: CategoryType[];
}) {
  const initialState: FormState = { error: null, success: false };
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(profileInfo.User.image_url || null);
  const [clientError, setClientError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push('/profile');
      router.refresh();
    }
  }, [state.success, router]);

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const currentCategoryName = categories.find((c) => c.id === profileInfo.category_id)?.name || '';
  const defaultCategory = categoryOptions.find((option) => option.value === currentCategoryName);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        setClientError('Ukuran file tidak boleh melebihi 2MB.');
        setImagePreview(null);
        e.target.value = '';
        return;
      }
      setClientError(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="card bg-secondary shadow-xl w-full max-w-4xl mx-auto">
      <div className="card-body p-6 md:p-10">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/profile" className="btn btn-ghost btn-circle">
            <IconArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Edit Profil</h1>
        </div>

        {/* Error Display */}
        {(state.error || clientError) && (
          <div className="alert alert-error mb-6">
            <span>{clientError || state.error}</span>
          </div>
        )}

        {/* Success Message */}
        {state.success && (
          <div className="alert alert-success mb-6">
            <span>Profil berhasil diperbarui! Mengalihkan...</span>
          </div>
        )}

        <form action={formAction} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <IconUser />
              Informasi Pribadi
            </h2>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={imagePreview || '/profile_image_default.png'}
                      alt="Foto profil"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Foto Profil</span>
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg, image/jpg"
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    onChange={handleImageChange}
                  />
                  <label className="label">
                    <span className="label-text-alt">Max 2MB</span>
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Nama Lengkap</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={profileInfo.User.name || ''}
                    className="input input-bordered input-primary"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    value={profileInfo.User.email}
                    className="input input-bordered input-disabled"
                    disabled
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Role</span>
                  </label>
                  <select name="role" defaultValue={profileInfo.User.roles?.name || ''} className="select select-bordered select-primary">
                    <option value="">Pilih Role</option>
                    <option value="talenta">Talent</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Professional Information Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <IconInfoCircle />
              Informasi Profesional
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Headline</span>
                </label>
                <input
                  type="text"
                  name="headline"
                  defaultValue={profileInfo.headline || ''}
                  className="input input-bordered input-primary"
                  placeholder="Full Stack Developer"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Kategori</span>
                </label>
                <Select
                  name="category"
                  options={categoryOptions}
                  defaultValue={defaultCategory}
                  isSearchable
                  placeholder="Pilih kategori"
                  unstyled
                  classNames={{
                    control: (state) =>
                      `input input-bordered input-primary w-full flex items-center min-h-[3rem] ${
                        state.isFocused ? 'input-primary' : ''
                      }`,
                    placeholder: () => 'text-base-content/50',
                    singleValue: () => 'text-base-content',
                    menu: () => 'bg-base-100 border border-primary rounded-box mt-1 shadow-lg z-50',
                    option: (state) =>
                      `p-3 cursor-pointer transition-colors ${
                        state.isFocused ? 'bg-primary/10' : ''
                      } ${state.isSelected ? 'bg-primary text-primary-content' : 'text-base-content'}`,
                    input: () => 'text-base-content',
                    dropdownIndicator: () => 'text-base-content/50',
                    indicatorSeparator: () => 'hidden',
                  }}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Deskripsi</span>
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={profileInfo.description || ''}
                className="textarea textarea-bordered textarea-primary"
                placeholder="Ceritakan tentang diri Anda..."
              ></textarea>
            </div>
          </div>

          <div className="divider"></div>

          {/* Experience Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <IconBriefcase />
              Pengalaman
            </h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Pengalaman Kerja</span>
              </label>
              <textarea
                name="experiences"
                rows={4}
                defaultValue={profileInfo.experiences || ''}
                className="textarea textarea-bordered textarea-primary"
                placeholder="Sebutkan pengalaman relevan Anda..."
              ></textarea>
            </div>
          </div>

          <div className="divider"></div>

          {/* Social Links Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <IconWorld />
              Tautan Sosial Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <IconWorld size={16} />
                    Website
                  </span>
                </label>
                <input
                  type="url"
                  name="website"
                  defaultValue={profileInfo.website || ''}
                  className="input input-bordered input-primary"
                  placeholder="https://your-website.com"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <IconBrandLinkedin size={16} />
                    LinkedIn
                  </span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  defaultValue={profileInfo.linkedin || ''}
                  className="input input-bordered input-primary"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <IconBrandGithub size={16} />
                    GitHub
                  </span>
                </label>
                <input
                  type="url"
                  name="github"
                  defaultValue={profileInfo.github || ''}
                  className="input input-bordered input-primary"
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <IconBrandInstagram size={16} />
                    Instagram
                  </span>
                </label>
                <input
                  type="url"
                  name="instagram"
                  defaultValue={profileInfo.instagram || ''}
                  className="input input-bordered input-primary"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link href="/profile" className="btn btn-outline btn-sm md:btn-md">
              Batalkan
            </Link>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}