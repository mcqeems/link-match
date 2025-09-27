'use server';

import { PrismaClient } from '@/generated/prisma';
import { auth } from './auth';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Use this if you want to see delay
// function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
// Usage:
//   await wait(2000);

export async function fetchProfileInfo() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  const response = await prisma.profile.findUnique({
    where: { user_id: session.user.id },
    include: {
      User: {
        select: {
          roles: {
            select: { name: true },
          },
          image_url: true,
          name: true,
          email: true,
          id: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return response;
}

export async function getCategories() {
  try {
    const categories = await prisma.categories.findMany();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Could not fetch categories.');
  }
}

// Message-related data functions

/**
 * Fetch all conversations for the current user with latest message preview
 */
export async function fetchUserConversations() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    const conversations = await prisma.conversations.findMany({
      where: {
        conversation_participants: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      include: {
        conversation_participants: {
          include: {
            User: {
              include: {
                profile: {
                  select: {
                    headline: true,
                  },
                },
                roles: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          include: {
            User: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // Transform data to include other participant info
    return conversations.map((conversation) => {
      const otherParticipant = conversation.conversation_participants.find(
        (participant) => participant.user_id !== session.user.id
      );

      return {
        ...conversation,
        otherParticipant: otherParticipant?.User || null,
        lastMessage: conversation.messages[0] || null,
      };
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw new Error('Could not fetch conversations.');
  }
}

/**
 * Fetch messages for a specific conversation
 */
export async function fetchConversationMessages(conversationId: number) {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    // Verify user is participant in this conversation
    const isParticipant = await prisma.conversation_participants.findFirst({
      where: {
        conversation_id: conversationId,
        user_id: session.user.id,
      },
    });

    if (!isParticipant) {
      throw new Error('Unauthorized access to conversation');
    }

    const messages = await prisma.messages.findMany({
      where: {
        conversation_id: conversationId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return messages;
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    throw new Error('Could not fetch messages.');
  }
}

/**
 * Fetch conversation details including participants
 */
export async function fetchConversationDetails(conversationId: number) {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    const conversation = await prisma.conversations.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        conversation_participants: {
          include: {
            User: {
              include: {
                profile: {
                  select: {
                    headline: true,
                  },
                },
                roles: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verify user is participant
    const isParticipant = conversation.conversation_participants.some(
      (participant) => participant.user_id === session.user.id
    );

    if (!isParticipant) {
      throw new Error('Unauthorized access to conversation');
    }

    return conversation;
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    throw new Error('Could not fetch conversation details.');
  }
}

/**
 * Search for users to start conversations with (excluding current user)
 */
export async function searchUsers(query?: string) {
  try {
    // Get authentication
    const currentHeaders = await headers();
    const session = await auth.api.getSession({
      headers: currentHeaders,
    });

    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    // Build base where clause - exclude current user
    let whereClause: any = {
      id: {
        not: session.user.id,
      },
    };

    // Add search condition if query provided
    if (query && query.trim()) {
      const searchTerm = query.trim();

      whereClause.OR = [
        // Search by name
        {
          name: {
            contains: searchTerm,
            // buat PostGre
            // mode: 'insensitive',
          },
        },
        // Search by email
        {
          email: {
            contains: searchTerm,
            // buat PostGre
            // mode: 'insensitive',
          },
        },
        // Search by profile headline (only for users who have profiles)
        {
          AND: [
            {
              profile: {
                isNot: null, // User must have a profile
              },
            },
            {
              profile: {
                headline: {
                  contains: searchTerm,
                  // buat PostGre
                  // mode: 'insensitive',
                },
              },
            },
          ],
        },
      ];
    }

    // Execute the query
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
        profile: {
          select: {
            headline: true,
          },
        },
        roles: {
          select: {
            name: true,
          },
        },
      },
      take: 20,
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  } catch (error) {
    console.error('searchUsers error:', error);

    // Provide more specific error information
    if (error instanceof Error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
    throw new Error('Failed to search users: Unknown error');
  }
}

/**
 * Check if conversation exists between two users
 */
export async function findExistingConversation(otherUserId: string) {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    const conversation = await prisma.conversations.findFirst({
      where: {
        conversation_participants: {
          every: {
            OR: [{ user_id: session.user.id }, { user_id: otherUserId }],
          },
        },
      },
      include: {
        conversation_participants: {
          where: {
            user_id: {
              in: [session.user.id, otherUserId],
            },
          },
        },
      },
    });

    // Ensure it's exactly a 2-person conversation
    if (conversation && conversation.conversation_participants.length === 2) {
      return conversation;
    }

    return null;
  } catch (error) {
    console.error('Error finding existing conversation:', error);
    return null;
  }
}
