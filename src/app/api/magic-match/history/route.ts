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

    // Get user's match requests with statistics
    const matchRequests = await prisma.match_requests.findMany({
      where: {
        requester_id: session.user.id,
      },
      include: {
        talent_matches: {
          include: {
            swipes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Format the response with statistics
    const history = matchRequests.map((mr) => {
      const totalMatches = mr.talent_matches.length;
      const swipedMatches = mr.talent_matches.filter((tm) => tm.swipes.length > 0);
      const rightSwipes = swipedMatches.filter((tm) => tm.swipes.some((s) => s.swipe_direction === 'right')).length;

      return {
        id: mr.id,
        prompt: mr.prompt,
        status: mr.status,
        created_at: mr.created_at,
        total_matches: totalMatches,
        swiped_count: swipedMatches.length,
        right_swipes: rightSwipes,
      };
    });

    return NextResponse.json({
      history,
      total_searches: history.length,
    });
  } catch (error) {
    console.error('Error getting match history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
