import { PrismaClient } from '../src/generated/prisma';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Data kategori tanpa id dan created_at
const categoriesData = [
  { name: 'Web Developer' },
  { name: 'Android Developer' },
  { name: 'Full-Stack Developer' },
  { name: 'Frontend Developer' },
  { name: 'Backend Developer' },
  { name: 'Mobile Developer' },
  { name: 'Game Developer' },
  { name: 'Data Scientist' },
  { name: 'Data Engineer' },
  { name: 'Machine Learning Engineer' },
  { name: 'AI Engineer / Prompt Engineer' },
  { name: 'Cloud Engineer / DevOps' },
  { name: 'Cybersecurity Specialist' },
  { name: 'Blockchain Developer / Smart Contract Engineer' },
  { name: 'QA Engineer / Software Tester' },
  { name: 'Embedded Systems Engineer' },
  { name: 'AR/VR Developer' },
  { name: 'UI Designer' },
  { name: 'UX Designer / Researcher' },
  { name: 'Product Designer' },
  { name: 'System Administrator' },
  { name: 'Site Reliability Engineer (SRE)' },
  { name: 'Technical Writer' },
  { name: 'Graphic Designer' },
  { name: 'Illustrator / Digital Painter' },
  { name: 'Motion Graphic Designer' },
  { name: '2D Animator' },
  { name: '3D Modeler' },
  { name: '3D Animator' },
  { name: 'Concept Artist' },
  { name: 'Character Designer' },
  { name: 'Visual Effects (VFX) Artist' },
  { name: 'Art Director' },
  { name: 'Photographer' },
  { name: 'Videographer' },
  { name: 'Video Editor / Colorist' },
  { name: 'Interior Designer' },
  { name: 'Architectural Visualizer' },
  { name: 'Industrial/Product Designer' },
  { name: 'Copywriter' },
  { name: 'Content Writer / Blog Writer' },
  { name: 'SEO Specialist / SEO Writer' },
  { name: 'Scriptwriter' },
  { name: 'Technical Writer / Documentation Specialist' },
  { name: 'Editor / Proofreader' },
  { name: 'Ghostwriter' },
  { name: 'Journalist / Investigative Reporter' },
  { name: 'Social Media Content Creator' },
  { name: 'Community Manager' },
  { name: 'Music Producer' },
  { name: 'Composer / Songwriter' },
  { name: 'Arranger' },
  { name: 'Mixing & Mastering Engineer' },
  { name: 'Sound Designer (Game/Film)' },
  { name: 'Audio Engineer / Live Sound' },
  { name: 'Voice Actor / Voice Over Artist' },
  { name: 'Podcast Editor' },
  { name: 'Foley Artist' },
  { name: 'DJ' },
  { name: 'Digital Marketing Specialist' },
  { name: 'Performance Marketing Analyst' },
  { name: 'Brand Strategist' },
  { name: 'Growth Hacker' },
  { name: 'Product Manager' },
  { name: 'Business Analyst' },
  { name: 'Market Research Analyst' },
  { name: 'Sales Strategist' },
  { name: 'Customer Success Manager' },
  { name: 'Project Manager' },
  { name: 'E-commerce Manager' },
  { name: 'Event Planner' },
  { name: 'Legal Consultant' },
  { name: 'Financial Analyst / Planner' },
  { name: 'HR Specialist / Recruiter / Talent Acquisition' },
  { name: 'Career Coach' },
  { name: 'Corporate Trainer' },
  { name: 'Management Consultant' },
  { name: 'Education Consultant' },
  { name: 'Translator / Interpreter' },
  { name: 'Fashion Designer' },
  { name: 'Textile Designer' },
  { name: 'Pattern Maker' },
  { name: 'Stylist' },
  { name: 'Makeup Artist' },
  { name: 'Hair Stylist' },
  { name: 'Jewelry Designer' },
  { name: 'Leather Craftsman' },
  { name: 'Handicraft Artisan' },
  { name: 'Shoe Designer / Maker' },
  { name: 'Actor / Actress' },
  { name: 'Model' },
  { name: 'Stunt Performer' },
  { name: 'Dancer / Choreographer' },
  { name: 'Stage Director' },
  { name: 'Lighting Designer' },
  { name: 'Set Designer / Production Designer' },
  { name: 'Research Scientist' },
  { name: 'Data Analyst (Research)' },
  { name: 'Environmental Consultant' },
  { name: 'Sustainability Specialist' },
  { name: 'Educator / Online Course Creator' },
  { name: 'Instructional Designer' },
];

const roleData = [
  {
    name: 'Recruiter',
  },
  {
    name: 'Talenta',
  },
];

async function main() {
  console.log(`Start seeding ...`);

  // Hapus data lama untuk menghindari duplikasi ID
  await prisma.categories.deleteMany();
  console.log('Deleted existing categories.');

  await prisma.roles.deleteMany();
  console.log('Deleted existing roles.');

  // Masukkan data baru; id dan createdAt akan diisi oleh default Prisma/DB
  await prisma.categories.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });

  await prisma.roles.createMany({
    data: roleData,
    skipDuplicates: true,
  });

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
