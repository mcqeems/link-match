import { generateEmbedding } from './bedrock';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Calculate cosine similarity between two vectors
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
        profile_skills: {
          include: {
            skills: true,
          },
        },
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

    // Create text representation of profile
    const skills = profile.profile_skills.map((ps) => ps.skills.name).join(', ');
    const textContent = [
      profile.User.name,
      profile.headline,
      profile.description,
      profile.experiences,
      skills,
      profile.categories?.name,
    ]
      .filter(Boolean)
      .join(' ');

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
            profile_skills: {
              include: {
                skills: true,
              },
            },
          },
        },
      },
    });

    // Calculate similarities
    const similarities = profileEmbeddings
      .map((pe) => ({
        profile: pe.profile,
        similarity: cosineSimilarity(searchEmbedding, pe.embedding),
      }))
      .filter((result) => result.similarity > 0.1) // Filter out very low similarities
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity descending
      .slice(0, limit);

    return similarities;
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
