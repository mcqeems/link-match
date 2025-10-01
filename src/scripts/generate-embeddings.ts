// Load environment variables FIRST
import { config } from 'dotenv';
config();

// Now import other modules
import { generateAllMissingEmbeddings } from '../lib/semantic-search';

async function main() {
  console.log('Starting to generate embeddings for all profiles...');

  try {
    await generateAllMissingEmbeddings();
    console.log('Successfully generated all embeddings!');
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    process.exit(1);
  }
}

main();
