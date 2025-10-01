import { NextRequest, NextResponse } from 'next/server';
import { analyzePromptForTalentSearch, generateMatchAnalysis } from '@/lib/bedrock';
import { searchSimilarProfiles } from '@/lib/semantic-search';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string' }, { status: 400 });
    }

    // Create match request
    const matchRequest = await prisma.match_requests.create({
      data: {
        requester_id: session.user.id,
        prompt,
        status: 'processing',
      },
    });

    // Analyze prompt using AI
    const promptAnalysis = await analyzePromptForTalentSearch(prompt);

    // Perform semantic search
    const similarProfiles = await searchSimilarProfiles(
      promptAnalysis.enhanced_search_text,
      20 // Get top 20 matches
    );

    // Generate talent matches with AI explanations
    const talentMatches = [];
    for (const result of similarProfiles) {
      const profile = result.profile;

      // Generate AI explanation for this match
      const aiExplanation = await generateMatchAnalysis(prompt, {
        name: profile.User.name,
        headline: profile.headline,
        description: profile.description,
        experiences: profile.experiences,
        skills: [], // Skills not implemented yet
        category: profile.categories?.name,
      });

      // Create talent match record
      const talentMatch = await prisma.talent_matches.create({
        data: {
          match_request_id: matchRequest.id,
          talent_id: profile.user_id,
          similarity_score: result.similarity,
          ai_explanation: aiExplanation,
        },
      });

      talentMatches.push({
        id: talentMatch.id,
        talent: {
          id: profile.User.id,
          name: profile.User.name,
          image_url: profile.User.image_url,
          image: profile.User.image,
          headline: profile.headline,
          description: profile.description,
          experiences: profile.experiences,
          category: profile.categories?.name,
          skills: [], // Skills not implemented yet
          website: profile.website,
          linkedin: profile.linkedin,
          github: profile.github,
        },
        similarity_score: result.similarity,
        ai_explanation: aiExplanation,
        created_at: talentMatch.created_at,
      });

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Update match request status
    await prisma.match_requests.update({
      where: { id: matchRequest.id },
      data: { status: 'completed' },
    });

    return NextResponse.json({
      match_request_id: matchRequest.id,
      matches: talentMatches,
      total_matches: talentMatches.length,
      prompt_analysis: promptAnalysis,
    });
  } catch (error) {
    console.error('Error in magic match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
