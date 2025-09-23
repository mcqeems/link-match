'use server';

import { auth } from './auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { BetterAuthError } from 'better-auth';
import { PrismaClient } from '@/generated/prisma';
import { getCategories } from './data';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

type AuthState = { error: string | null; success: boolean };

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

async function uploadImageToS3(file: File): Promise<string> {
  if (!process.env.AWS_S3_BUCKET_NAME) {
    throw new Error('S3 bucket name is not configured.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `images/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  });

  try {
    await s3Client.send(command);
    // Construct the URL manually
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
    return url;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image.');
  }
}

export async function signInWithEmail(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password harus diisi', success: false };
  }

  try {
    const currentHeaders = await headers();
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: headersToObject(currentHeaders),
    });

    if (response instanceof BetterAuthError) {
      return { error: response.message, success: false };
    }

    return { error: null, success: true };
  } catch (err: unknown) {
    const msg =
      err instanceof BetterAuthError ? err.message : 'Terjadi kesalahan saat login. Periksa email & password.';
    return { error: msg, success: false };
  }
}

export async function signUpWithEmail(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Semua field harus diisi', success: false };
  }

  try {
    const currentHeaders = await headers();
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: headersToObject(currentHeaders),
    });

    if (response instanceof BetterAuthError) {
      return { error: response.message, success: false };
    }

    if (response && response.user) {
      await prisma.profile.create({
        data: {
          user_id: response.user.id,
        },
      });
    }

    return { error: null, success: true };
  } catch (err: unknown) {
    const msg = err instanceof BetterAuthError ? err.message : 'Terjadi kesalahan saat pendaftaran.';
    return { error: msg, success: false };
  }
}

export async function signOut() {
  const currentHeaders = await headers();
  await auth.api.signOut({
    headers: headersToObject(currentHeaders),
  });
  redirect('/sign-in');
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function postProfileInfo(formData: FormData) {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });
  if (!session?.user?.id) {
    return { error: 'User not authenticated', success: false };
  }

  const roleName = formData.get('role') as string;
  const headline = formData.get('headline') as string;
  const description = formData.get('description') as string;
  const experiences = formData.get('experiences') as string;
  const categoryName = formData.get('category') as string;
  const website = formData.get('website') as string;
  const linkedin = formData.get('linkedin') as string;
  const instagram = formData.get('instagram') as string;
  const github = formData.get('github') as string;
  const imageFile = formData.get('image') as File | null;

  if (imageFile && imageFile.size > MAX_FILE_SIZE) {
    return { error: 'Ukuran file tidak boleh melebihi 2MB.', success: false };
  }

  let imageUrl: string | undefined = undefined;
  let categoryId: number | undefined = undefined;

  try {
    if (!roleName) {
      return { error: 'Role harus dipilih.', success: false };
    }
    const roleRecord = await prisma.roles.findUnique({
      where: { name: roleName },
    });
    if (!roleRecord) {
      return { error: `Role "${roleName}" tidak ditemukan di database.`, success: false };
    }

    if (categoryName) {
      const categories = await getCategories();
      const selectedCategory = categories.find((c) => c.name === categoryName);
      if (selectedCategory) {
        categoryId = selectedCategory.id;
      } else {
        return { error: `Category "${categoryName}" not found.`, success: false };
      }
    }

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImageToS3(imageFile);
    }

    const updateUser: any = {
      roles: {
        connect: {
          id: roleRecord.id,
        },
      },
    };

    if (imageUrl) {
      updateUser.image_url = imageUrl;
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateUser,
    });

    const updateData: any = {
      headline,
      description,
      experiences,
      website,
      linkedin,
      instagram,
      github,
    };
    if (categoryId) {
      updateData.category_id = categoryId;
    }

    await prisma.profile.update({
      where: {
        user_id: session.user.id,
      },
      data: updateData,
    });

    return { error: null, success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Error updating profile: ' + msg);
    return { error: msg, success: false };
  }
}
