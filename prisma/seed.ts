import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Data kategori dari file JSON
const categoriesData = [
  { id: 1, name: 'Web Developer', created_at: '2025-09-22T09:27:30.000Z' },
  { id: 2, name: 'Android Developer', created_at: '2025-09-22T09:27:30.000Z' },
  { id: 3, name: 'Full-Stack Developer', created_at: '2025-09-22T22:46:44.000Z' },
  { id: 4, name: 'Frontend Developer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 5, name: 'Backend Developer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 7, name: 'Mobile Developer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 8, name: 'Game Developer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 9, name: 'Data Scientist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 10, name: 'Data Engineer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 11, name: 'Machine Learning Engineer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 12, name: 'AI Engineer / Prompt Engineer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 13, name: 'Cloud Engineer / DevOps', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 14, name: 'Cybersecurity Specialist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 15, name: 'Blockchain Developer / Smart Contract Engineer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 16, name: 'QA Engineer / Software Tester', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 17, name: 'Embedded Systems Engineer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 18, name: 'AR/VR Developer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 19, name: 'UI Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 20, name: 'UX Designer / Researcher', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 21, name: 'Product Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 22, name: 'System Administrator', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 23, name: 'Site Reliability Engineer (SRE)', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 24, name: 'Technical Writer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 25, name: 'Graphic Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 26, name: 'Illustrator / Digital Painter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 27, name: 'Motion Graphic Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 28, name: '2D Animator', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 29, name: '3D Modeler', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 30, name: '3D Animator', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 31, name: 'Concept Artist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 32, name: 'Character Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 33, name: 'Visual Effects (VFX) Artist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 34, name: 'Art Director', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 35, name: 'Photographer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 36, name: 'Videographer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 37, name: 'Video Editor / Colorist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 38, name: 'Interior Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 39, name: 'Architectural Visualizer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 40, name: 'Industrial/Product Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 41, name: 'Copywriter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 42, name: 'Content Writer / Blog Writer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 43, name: 'SEO Specialist / SEO Writer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 44, name: 'Scriptwriter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 45, name: 'Technical Writer / Documentation Specialist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 46, name: 'Editor / Proofreader', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 47, name: 'Ghostwriter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 48, name: 'Journalist / Investigative Reporter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 49, name: 'Social Media Content Creator', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 50, name: 'Community Manager', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 51, name: 'Music Producer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 52, name: 'Composer / Songwriter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 53, name: 'Arranger', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 54, name: 'Mixing & Mastering Engineer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 55, name: 'Sound Designer (Game/Film)', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 56, name: 'Audio Engineer / Live Sound', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 57, name: 'Voice Actor / Voice Over Artist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 58, name: 'Podcast Editor', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 59, name: 'Foley Artist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 60, name: 'DJ', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 61, name: 'Digital Marketing Specialist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 62, name: 'Performance Marketing Analyst', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 63, name: 'Brand Strategist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 64, name: 'Growth Hacker', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 65, name: 'Product Manager', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 66, name: 'Business Analyst', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 67, name: 'Market Research Analyst', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 68, name: 'Sales Strategist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 69, name: 'Customer Success Manager', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 70, name: 'Project Manager', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 71, name: 'E-commerce Manager', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 72, name: 'Event Planner', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 73, name: 'Legal Consultant', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 74, name: 'Financial Analyst / Planner', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 75, name: 'HR Specialist / Recruiter / Talent Acquisition', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 76, name: 'Career Coach', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 77, name: 'Corporate Trainer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 78, name: 'Management Consultant', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 79, name: 'Education Consultant', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 80, name: 'Translator / Interpreter', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 81, name: 'Fashion Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 82, name: 'Textile Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 83, name: 'Pattern Maker', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 84, name: 'Stylist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 85, name: 'Makeup Artist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 86, name: 'Hair Stylist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 87, name: 'Jewelry Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 88, name: 'Leather Craftsman', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 89, name: 'Handicraft Artisan', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 90, name: 'Shoe Designer / Maker', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 91, name: 'Actor / Actress', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 92, name: 'Model', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 93, name: 'Stunt Performer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 94, name: 'Dancer / Choreographer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 95, name: 'Stage Director', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 96, name: 'Lighting Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 97, name: 'Set Designer / Production Designer', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 98, name: 'Research Scientist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 99, name: 'Data Analyst (Research)', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 100, name: 'Environmental Consultant', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 101, name: 'Sustainability Specialist', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 102, name: 'Educator / Online Course Creator', created_at: '2025-09-28T13:54:09.000Z' },
  { id: 103, name: 'Instructional Designer', created_at: '2025-09-28T13:54:09.000Z' },
];

async function main() {
  console.log(`Start seeding ...`);

  // Hapus data lama untuk menghindari duplikasi ID
  await prisma.category.deleteMany();
  console.log('Deleted existing categories.');

  // Ubah format data agar sesuai dengan model Prisma
  const formattedCategories = categoriesData.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: new Date(category.created_at), // Konversi string ke objek Date
  }));

  // Masukkan data baru menggunakan createMany untuk efisiensi
  await prisma.category.createMany({
    data: formattedCategories,
    skipDuplicates: true, // Lewati jika ada duplikasi (opsional)
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
