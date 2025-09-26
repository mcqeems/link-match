'use server';

import { auth } from './auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { BetterAuthError } from 'better-auth';
import { PrismaClient } from '@/generated/prisma';
import { getCategories } from './data';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

type FormState = { error: string | null; success: boolean };

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

// Helper function to validate and process image file
async function processImageFile(imageFile: File | null): Promise<string | undefined> {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  if (!imageFile || imageFile.size === 0) {
    return undefined;
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    throw new Error('Ukuran file tidak boleh melebihi 2MB.');
  }

  return await uploadImageToS3(imageFile);
}

// Helper function to validate and find role
async function validateRole(roleName: string) {
  if (!roleName) {
    throw new Error('Role harus dipilih.');
  }

  const roleRecord = await prisma.roles.findUnique({
    where: { name: roleName },
  });

  if (!roleRecord) {
    throw new Error(`Role "${roleName}" tidak ditemukan di database.`);
  }

  return roleRecord;
}

// Helper function to validate and find category
async function validateCategory(categoryName?: string): Promise<number | undefined> {
  if (!categoryName) return undefined;

  const categories = await getCategories();
  const selectedCategory = categories.find((c) => c.name === categoryName);

  if (!selectedCategory) {
    throw new Error(`Category "${categoryName}" tidak ditemukan di database.`);
  }

  return selectedCategory.id;
}

// Helper function to extract profile data from FormData
function extractProfileData(formData: FormData) {
  return {
    roleName: formData.get('role') as string,
    headline: formData.get('headline') as string,
    description: formData.get('description') as string,
    experiences: formData.get('experiences') as string,
    categoryName: formData.get('category') as string,
    website: formData.get('website') as string,
    linkedin: formData.get('linkedin') as string,
    instagram: formData.get('instagram') as string,
    github: formData.get('github') as string,
    imageFile: formData.get('image') as File | null,
    name: formData.get('name') as string,
  };
}

// Helper function to authenticate user session
async function authenticateUser() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  return session;
}

// Main function to handle profile updates (both create and update)
async function handleProfileUpdate(formData: FormData, isUpdate: boolean = false): Promise<FormState> {
  try {
    // Authenticate user
    const session = await authenticateUser();

    // Extract form data
    const profileData = extractProfileData(formData);

    // Validate and process data
    const [roleRecord, categoryId, imageUrl] = await Promise.all([
      validateRole(profileData.roleName),
      validateCategory(profileData.categoryName),
      processImageFile(profileData.imageFile),
    ]);

    // Prepare user update data
    const userUpdateData: any = {
      roles: {
        connect: {
          id: roleRecord.id,
        },
      },
    };

    if (imageUrl) {
      userUpdateData.image_url = imageUrl;
    }

    // Update user name if provided (for edit mode)
    if (isUpdate && profileData.name) {
      userUpdateData.name = profileData.name;
    }

    // Prepare profile update data
    const profileUpdateData: any = {
      headline: profileData.headline,
      description: profileData.description,
      experiences: profileData.experiences,
      website: profileData.website,
      linkedin: profileData.linkedin,
      instagram: profileData.instagram,
      github: profileData.github,
    };

    if (categoryId) {
      profileUpdateData.category_id = categoryId;
    }

    // Execute database operations in transaction for data consistency
    await prisma.$transaction(async (tx) => {
      // Update user data
      await tx.user.update({
        where: { id: session.user.id },
        data: userUpdateData,
      });

      // Update or create profile data
      if (isUpdate) {
        await tx.profile.update({
          where: { user_id: session.user.id },
          data: profileUpdateData,
        });
      } else {
        // For new profiles, use upsert to handle potential race conditions
        await tx.profile.upsert({
          where: { user_id: session.user.id },
          create: {
            user_id: session.user.id,
            ...profileUpdateData,
          },
          update: profileUpdateData,
        });
      }
    });

    return { error: null, success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} profile:`, error);
    return { error: msg, success: false };
  }
}

export async function signInWithEmail(_prevState: FormState, formData: FormData): Promise<FormState> {
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

export async function signUpWithEmail(_prevState: FormState, formData: FormData): Promise<FormState> {
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

export async function postProfileInfo(_prevState: FormState, formData: FormData): Promise<FormState> {
  return handleProfileUpdate(formData, false);
}

export async function updateProfile(_prevState: FormState, formData: FormData): Promise<FormState> {
  return handleProfileUpdate(formData, true);
}

// Message-related actions

/**
 * Create a new conversation or find existing one between two users
 */
export async function createOrFindConversation(
  otherUserId: string
): Promise<{ conversationId: number; error: string | null }> {
  try {
    const session = await authenticateUser();

    if (session.user.id === otherUserId) {
      return { conversationId: 0, error: 'Cannot create conversation with yourself' };
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversations.findFirst({
      where: {
        conversation_participants: {
          every: {
            OR: [{ user_id: session.user.id }, { user_id: otherUserId }],
          },
        },
      },
      include: {
        conversation_participants: true,
      },
    });

    // Verify it's exactly a 2-person conversation
    if (existingConversation && existingConversation.conversation_participants.length === 2) {
      const participantIds = existingConversation.conversation_participants.map((p) => p.user_id);
      if (participantIds.includes(session.user.id) && participantIds.includes(otherUserId)) {
        return { conversationId: existingConversation.id, error: null };
      }
    }

    // Verify other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true },
    });

    if (!otherUser) {
      return { conversationId: 0, error: 'User not found' };
    }

    // Create new conversation
    const conversation = await prisma.$transaction(async (tx) => {
      const newConversation = await tx.conversations.create({
        data: {
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Add participants
      await tx.conversation_participants.createMany({
        data: [
          {
            conversation_id: newConversation.id,
            user_id: session.user.id,
          },
          {
            conversation_id: newConversation.id,
            user_id: otherUserId,
          },
        ],
      });

      return newConversation;
    });

    return { conversationId: conversation.id, error: null };
  } catch (error) {
    console.error('Error creating conversation:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat percakapan.';
    return { conversationId: 0, error: msg };
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const session = await authenticateUser();

    const conversationId = parseInt(formData.get('conversationId') as string);
    const content = (formData.get('content') as string)?.trim();

    if (!conversationId) {
      return { error: 'ID percakapan tidak valid', success: false };
    }

    if (!content || content.length === 0) {
      return { error: 'Pesan tidak boleh kosong', success: false };
    }

    if (content.length > 1000) {
      return { error: 'Pesan terlalu panjang (maksimal 1000 karakter)', success: false };
    }

    // Verify user is participant in this conversation
    const isParticipant = await prisma.conversation_participants.findFirst({
      where: {
        conversation_id: conversationId,
        user_id: session.user.id,
      },
    });

    if (!isParticipant) {
      return { error: 'Anda tidak memiliki akses ke percakapan ini', success: false };
    }

    // Create message and update conversation timestamp in transaction
    await prisma.$transaction(async (tx) => {
      await tx.messages.create({
        data: {
          conversation_id: conversationId,
          sender_id: session.user.id,
          content,
          created_at: new Date(),
        },
      });

      await tx.conversations.update({
        where: { id: conversationId },
        data: { updated_at: new Date() },
      });
    });

    return { error: null, success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesan.';
    return { error: msg, success: false };
  }
}

/**
 * Delete a conversation (only if user is participant)
 */
export async function deleteConversation(conversationId: number): Promise<{ success: boolean; error: string | null }> {
  try {
    const session = await authenticateUser();

    // Verify user is participant
    const isParticipant = await prisma.conversation_participants.findFirst({
      where: {
        conversation_id: conversationId,
        user_id: session.user.id,
      },
    });

    if (!isParticipant) {
      return { success: false, error: 'Anda tidak memiliki akses ke percakapan ini' };
    }

    // Delete conversation (cascading will handle participants and messages)
    await prisma.conversations.delete({
      where: { id: conversationId },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting conversation:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus percakapan.';
    return { success: false, error: msg };
  }
}
