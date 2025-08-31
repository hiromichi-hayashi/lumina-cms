import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword', // In real app, this would be hashed
    },
  })

  // Create some tags
  const webTag = await prisma.tag.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: { name: 'Web Development' },
  })

  const nextjsTag = await prisma.tag.upsert({
    where: { name: 'Next.js' },
    update: {},
    create: { name: 'Next.js' },
  })

  // Create some sample posts
  await prisma.post.upsert({
    where: { id: 'sample-post-1' },
    update: {},
    create: {
      id: 'sample-post-1',
      title: 'Getting Started with Portfolio CMS',
      content:
        'This is a sample post to demonstrate the Portfolio CMS functionality.',
      published: true,
      authorId: user.id,
      tags: {
        connect: [{ id: webTag.id }, { id: nextjsTag.id }],
      },
    },
  })

  await prisma.post.upsert({
    where: { id: 'sample-post-2' },
    update: {},
    create: {
      id: 'sample-post-2',
      title: 'Draft Post Example',
      content: 'This is a draft post that is not yet published.',
      published: false,
      authorId: user.id,
      tags: {
        connect: [{ id: webTag.id }],
      },
    },
  })

  console.log('✅ Database seeded successfully!')
}

seed()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
