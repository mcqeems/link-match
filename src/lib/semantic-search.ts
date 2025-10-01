import { generateEmbedding } from './bedrock';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Calculate information richness score based on profile completeness
function calculateInformationRichness(profile: any): number {
  let score = 0;
  let maxScore = 0;

  // Basic information (essential)
  maxScore += 10; // name (always present)
  score += 10; // name bonus

  // Headline (important)
  maxScore += 15;
  if (profile.headline && profile.headline.trim().length > 0) {
    const headlineLength = profile.headline.trim().length;
    score += Math.min(15, headlineLength > 20 ? 15 : headlineLength * 0.75);
  }

  // Description (very important)
  maxScore += 25;
  if (profile.description && profile.description.trim().length > 0) {
    const descLength = profile.description.trim().length;
    score += Math.min(25, descLength > 100 ? 25 : descLength * 0.25);
  }

  // Experiences (very important)
  maxScore += 25;
  if (profile.experiences && profile.experiences.trim().length > 0) {
    const expLength = profile.experiences.trim().length;
    score += Math.min(25, expLength > 100 ? 25 : expLength * 0.25);
  }

  // Category (important)
  maxScore += 15;
  if (profile.categories?.name) {
    score += 15;
  }

  // Social links (bonus)
  maxScore += 10;
  let socialCount = 0;
  if (profile.website) socialCount++;
  if (profile.linkedin) socialCount++;
  if (profile.github) socialCount++;
  score += socialCount * 3.33; // Max 10 points for social links

  // Return normalized score (0-1)
  return Math.min(1, score / maxScore);
}

// Enhanced similarity calculation with balanced sensitivity and information richness
function enhancedCosineSimilarity(vecA: number[], vecB: number[], profile: any): number {
  const rawSimilarity = cosineSimilarity(vecA, vecB);

  // Calculate information richness boost
  const richnessScore = calculateInformationRichness(profile);

  // Apply more generous scaling for better user experience
  // This produces higher similarity scores while maintaining quality distinction
  let scaledSimilarity;

  if (rawSimilarity > 0.7) {
    // Exceptional matches: boost significantly (70%+ becomes 80%+)
    scaledSimilarity = Math.min(0.95, Math.pow(rawSimilarity, 0.5) * 1.3);
  } else if (rawSimilarity > 0.5) {
    // Good matches: substantial boost (50-70% becomes 60-80%)
    scaledSimilarity = Math.pow(rawSimilarity, 0.6) * 1.25;
  } else if (rawSimilarity > 0.3) {
    // Moderate matches: generous boost (30-50% becomes 45-65%)
    scaledSimilarity = Math.pow(rawSimilarity, 0.7) * 1.4;
  } else if (rawSimilarity > 0.2) {
    // Weak matches: moderate boost (20-30% becomes 30-45%)
    scaledSimilarity = Math.pow(rawSimilarity, 0.8) * 1.2;
  } else {
    // Poor matches: still show but lower (below 20% becomes 15-25%)
    scaledSimilarity = Math.pow(rawSimilarity, 0.9) * 1.1;
  }

  // Apply information richness boost
  // Profiles with more information get a boost (up to 20% increase)
  const richnessBoost = 1 + richnessScore * 0.2;
  const finalSimilarity = scaledSimilarity * richnessBoost;

  return Math.max(0, Math.min(0.95, finalSimilarity));
} // Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

// Generate or update profile embedding
// Only generates embeddings for users with 'Talenta' role
export async function generateProfileEmbedding(profileId: number): Promise<void> {
  try {
    // Get profile data
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        User: {
          include: {
            roles: true,
          },
        },
        categories: true,
      },
    });

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    // Check if user has 'Talenta' role
    if (profile.User?.roles?.name !== 'Talenta') {
      console.log(`Skipping embedding generation for profile ${profileId} - user role is not 'Talenta'`);
      return;
    }

    // Create comprehensive text representation of profile
    // Build comprehensive profile text including all relevant information
    const profileParts = [
      profile.User.name,
      profile.headline,
      profile.description,
      profile.experiences,
      profile.categories?.name,
      // Add social/portfolio links for additional context
      profile.website,
      profile.linkedin,
      profile.github,
    ];
    const textContent = profileParts
      .filter(Boolean) // Remove null/undefined values
      .join(' ');

    console.log(`Generating embedding for profile ${profileId} with content length: ${textContent.length} characters`);

    // Generate embedding
    const embedding = await generateEmbedding(textContent);

    // Save or update embedding
    await prisma.profile_embeddings.upsert({
      where: { profile_id: profileId },
      update: {
        embedding,
        text_content: textContent,
        updated_at: new Date(),
      },
      create: {
        profile_id: profileId,
        embedding,
        text_content: textContent,
      },
    });

    console.log(`Generated embedding for profile ${profileId}`);
  } catch (error) {
    console.error(`Failed to generate embedding for profile ${profileId}:`, error);
    throw error;
  }
}

// Search for similar profiles using semantic search
// Only includes users with 'Talenta' role (excludes 'Recruiter' role users)
export async function searchSimilarProfiles(
  searchText: string,
  limit: number = 10,
  excludeProfileIds: number[] = []
): Promise<
  Array<{
    profile: any;
    similarity: number;
  }>
> {
  try {
    // First, check if there are any profiles without embeddings and generate them
    console.log('Checking for profiles without embeddings...');
    await generateAllMissingEmbeddings();

    // Generate embedding for search text
    const searchEmbedding = await generateEmbedding(searchText);

    // Get all profile embeddings (in a real app, you'd want to use a vector database)
    // Only include profiles from users with 'Talenta' role
    const profileEmbeddings = await prisma.profile_embeddings.findMany({
      where: {
        profile_id: {
          notIn: excludeProfileIds,
        },
        profile: {
          User: {
            roles: {
              name: 'Talenta',
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            User: {
              include: {
                roles: true,
              },
            },
            categories: true,
          },
        },
      },
    });

    // Calculate similarities with enhanced sensitivity and information richness
    const similarities = profileEmbeddings
      .map((pe) => {
        const rawSim = cosineSimilarity(searchEmbedding, pe.embedding);
        const finalSim = enhancedCosineSimilarity(searchEmbedding, pe.embedding, pe.profile);
        return {
          profile: pe.profile,
          similarity: finalSim,
          rawSimilarity: rawSim,
        };
      })
      .filter((result) => {
        // Filter out low-quality matches: only show matches above 20% (0.20)
        // This ensures only meaningful matches are presented to users
        return result.similarity > 0.2;
      })
      .sort((a, b) => b.similarity - a.similarity); // Sort by similarity descending

    console.log(
      `Found ${similarities.length} candidates above 20% threshold from ${profileEmbeddings.length} total profiles`
    );

    // Log similarity scores for debugging
    if (similarities.length > 0) {
      console.log('Detailed similarity analysis:');
      similarities.slice(0, 5).forEach((s) => {
        const richness = calculateInformationRichness(s.profile);
        console.log(
          `${s.profile.User.name}: Raw: ${Math.round(s.rawSimilarity * 100)}% → Final: ${Math.round(s.similarity * 100)}% (richness: ${Math.round(richness * 100)}%)`
        );
      });
    }

    return similarities.slice(0, limit);
  } catch (error) {
    console.error('Error in semantic search:', error);
    throw error;
  }
}

// Generate embeddings for all profiles that don't have them
// Only processes users with 'Talenta' role (excludes 'Recruiter' role users)
export async function generateAllMissingEmbeddings(): Promise<number> {
  try {
    // Find profiles without embeddings from users with 'Talenta' role only
    const profilesWithoutEmbeddings = await prisma.profile.findMany({
      where: {
        profile_embeddings: null,
        User: {
          roles: {
            name: 'Talenta',
          },
        },
      },
      select: {
        id: true,
      },
    });

    console.log(`Found ${profilesWithoutEmbeddings.length} profiles without embeddings`);

    let successCount = 0;

    // Generate embeddings for each profile
    for (const profile of profilesWithoutEmbeddings) {
      try {
        await generateProfileEmbedding(profile.id);
        successCount++;
        // Add a small delay to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to generate embedding for profile ${profile.id}:`, error);
        // Continue with next profile
      }
    }

    console.log(`Finished generating embeddings. Successfully updated ${successCount} profiles.`);
    return successCount;
  } catch (error) {
    console.error('Error generating all embeddings:', error);
    throw error;
  }
}

// Update embedding when profile is updated
export async function updateProfileEmbedding(profileId: number): Promise<void> {
  await generateProfileEmbedding(profileId);
}
