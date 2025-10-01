import { NextRequest, NextResponse } from 'next/server';
import { generateProfileEmbedding } from '@/lib/semantic-search';
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

    const { profile_id } = await request.json();

    if (!profile_id || typeof profile_id !== 'number') {
      return NextResponse.json({ error: 'profile_id is required and must be a number' }, { status: 400 });
    }

    // Generate embedding for the specific profile
    await generateProfileEmbedding(profile_id);

    return NextResponse.json({
      success: true,
      message: `Embedding generated for profile ${profile_id}`,
    });
  } catch (error) {
    console.error('Error generating profile embedding:', error);
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
  }
}

// Generate embeddings for all missing profiles
export async function PUT(request: NextRequest) {
  try {
    // Check authentication (optional: add admin check here)
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { generateAllMissingEmbeddings } = await import('@/lib/semantic-search');
    const updatedCount = await generateAllMissingEmbeddings();

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      message: `${updatedCount} embeddings generated successfully`,
    });
  } catch (error) {
    console.error('Error generating all embeddings:', error);
    return NextResponse.json({ error: 'Failed to generate all embeddings' }, { status: 500 });
  }
}
