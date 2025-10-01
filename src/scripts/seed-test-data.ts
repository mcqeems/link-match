import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function seedTestData() {
  console.log('Creating test data for Magic Matcher...');

  try {
    // Create test categories if they don't exist
    const categories = await prisma.categories.createMany({
      data: [
        { name: 'Software Development' },
        { name: 'UI/UX Design' },
        { name: 'Data Science' },
        { name: 'Digital Marketing' },
        { name: 'DevOps' },
      ],
      skipDuplicates: true,
    });

    // Create test skills if they don't exist
    const skills = await prisma.skills.createMany({
      data: [
        { name: 'React' },
        { name: 'TypeScript' },
        { name: 'Node.js' },
        { name: 'Python' },
        { name: 'Machine Learning' },
        { name: 'AWS' },
        { name: 'Docker' },
        { name: 'Figma' },
        { name: 'Photoshop' },
        { name: 'Social Media' },
      ],
      skipDuplicates: true,
    });

    console.log('Test data created successfully!');
    console.log('Next steps:');
    console.log('1. Ensure you have profiles in your database');
    console.log('2. Run: npm run generate-embeddings');
    console.log('3. Set up your AWS credentials in .env');
    console.log('4. Test the Magic Matcher at /magic-matcher');
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
