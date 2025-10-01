import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const matchRequestId = url.searchParams.get('match_request_id');

    if (!matchRequestId) {
      return NextResponse.json({ error: 'match_request_id is required' }, { status: 400 });
    }

    // Get the match request and verify ownership
    const matchRequest = await prisma.match_requests.findUnique({
      where: { id: parseInt(matchRequestId) },
      include: {
        talent_matches: {
          include: {
            talent: {
              include: {
                profile: {
                  include: {
                    categories: true,
                    profile_skills: {
                      include: {
                        skills: true,
                      },
                    },
                  },
                },
              },
            },
            swipes: true,
          },
          orderBy: {
            similarity_score: 'desc',
          },
        },
      },
    });

    if (!matchRequest) {
      return NextResponse.json({ error: 'Match request not found' }, { status: 404 });
    }

    if (matchRequest.requester_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to access this match request' }, { status: 403 });
    }

    // Format the response
    const formattedMatches = matchRequest.talent_matches.map((tm) => ({
      id: tm.id,
      talent: {
        id: tm.talent.id,
        name: tm.talent.name,
        image_url: tm.talent.image_url,
        image: tm.talent.image,
        headline: tm.talent.profile?.headline,
        description: tm.talent.profile?.description,
        experiences: tm.talent.profile?.experiences,
        category: tm.talent.profile?.categories?.name,
        skills: tm.talent.profile?.profile_skills?.map((ps) => ps.skills.name) || [],
        website: tm.talent.profile?.website,
        linkedin: tm.talent.profile?.linkedin,
        github: tm.talent.profile?.github,
      },
      similarity_score: tm.similarity_score,
      ai_explanation: tm.ai_explanation,
      created_at: tm.created_at,
      swipe:
        tm.swipes.length > 0
          ? {
              direction: tm.swipes[0].swipe_direction,
              created_at: tm.swipes[0].created_at,
            }
          : null,
    }));

    return NextResponse.json({
      match_request: {
        id: matchRequest.id,
        prompt: matchRequest.prompt,
        status: matchRequest.status,
        created_at: matchRequest.created_at,
      },
      matches: formattedMatches,
      total_matches: formattedMatches.length,
      swiped_count: formattedMatches.filter((m) => m.swipe !== null).length,
      right_swipes: formattedMatches.filter((m) => m.swipe?.direction === 'right').length,
    });
  } catch (error) {
    console.error('Error getting matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
