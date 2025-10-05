import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { talent_match_id, swipe_direction } = await request.json();

    if (!talent_match_id || !swipe_direction) {
      return NextResponse.json({ error: 'talent_match_id and swipe_direction are required' }, { status: 400 });
    }

    if (!['left', 'right'].includes(swipe_direction)) {
      return NextResponse.json({ error: "swipe_direction must be 'left' or 'right'" }, { status: 400 });
    }

    // Verify the talent match belongs to the current user
    const talentMatch = await prisma.talent_matches.findUnique({
      where: { id: talent_match_id },
      include: {
        match_request: true,
      },
    });

    if (!talentMatch) {
      return NextResponse.json({ error: 'Talent match not found' }, { status: 404 });
    }

    if (talentMatch.match_request.requester_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to swipe this match' }, { status: 403 });
    }

    // Record the swipe
    const swipe = await prisma.match_swipes.upsert({
      where: { talent_match_id },
      update: {
        swipe_direction,
      },
      create: {
        talent_match_id,
        swipe_direction,
      },
    });

    // If it's a right swipe, potentially create a conversation
    let conversation = null;
    if (swipe_direction === 'right') {
      // Check if a conversation already exists between these users
      const existingConversation = await prisma.conversations.findFirst({
        where: {
          conversation_participants: {
            every: {
              user_id: {
                in: [session.user.id, talentMatch.talent_id],
              },
            },
          },
        },
        include: {
          conversation_participants: true,
        },
      });

      if (!existingConversation) {
        // Create new conversation
        conversation = await prisma.conversations.create({
          data: {
            conversation_participants: {
              createMany: {
                data: [{ user_id: session.user.id }, { user_id: talentMatch.talent_id }],
              },
            },
          },
        });

        // Fetch the conversation with participants
        conversation = await prisma.conversations.findUnique({
          where: { id: conversation.id },
          include: {
            conversation_participants: {
              include: {
                User: true,
              },
            },
          },
        });
      } else {
        conversation = existingConversation;
      }
    }

    return NextResponse.json({
      swipe: {
        id: swipe.talent_match_id,
        direction: swipe.swipe_direction,
        created_at: swipe.created_at,
      },
      conversation: conversation
        ? {
            id: conversation.id,
            created: swipe_direction === 'right',
          }
        : null,
    });
  } catch (error) {
    console.error('Error in swipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
