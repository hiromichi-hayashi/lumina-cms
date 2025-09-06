import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      email: 'admin@example.com',
      displayName: 'Admin User',
      role: 'admin',
      status: 'active',
      provider: 'email',
    },
  })

  // Create editor user
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000002',
      email: 'editor@example.com',
      displayName: 'Editor User',
      role: 'editor',
      status: 'active',
      provider: 'email',
    },
  })

  // Create author user
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000003',
      email: 'author@example.com',
      displayName: 'Author User',
      role: 'author',
      status: 'active',
      provider: 'email',
    },
  })

  console.log('👥 Users created')

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'technology',
      description: 'Posts about technology and software development',
      depth: 0,
      sortOrder: 1,
    },
  })

  const webDevCategory = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Web development related posts',
      parentId: techCategory.id,
      depth: 1,
      sortOrder: 1,
    },
  })

  const designCategory = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: {
      name: 'Design',
      slug: 'design',
      description: 'Design and UX/UI posts',
      depth: 0,
      sortOrder: 2,
    },
  })

  console.log('📁 Categories created')

  // Create tags
  const reactTag = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      slug: 'react',
      description: 'React framework and library',
    },
  })

  const nextjsTag = await prisma.tag.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: {
      name: 'Next.js',
      slug: 'nextjs',
      description: 'Next.js React framework',
    },
  })

  const typescriptTag = await prisma.tag.upsert({
    where: { slug: 'typescript' },
    update: {},
    create: {
      name: 'TypeScript',
      slug: 'typescript',
      description: 'TypeScript programming language',
    },
  })

  const uiTag = await prisma.tag.upsert({
    where: { slug: 'ui' },
    update: {},
    create: {
      name: 'UI',
      slug: 'ui',
      description: 'User Interface design',
    },
  })

  console.log('🏷️ Tags created')

  // Create sample media asset
  const sampleImage = await prisma.mediaAsset.create({
    data: {
      url: 'https://via.placeholder.com/800x600?text=Sample+Image',
      provider: 'placeholder',
      mimeType: 'image/png',
      width: 800,
      height: 600,
      hash: 'sample-hash-placeholder',
      uploadedBy: adminUser.id,
    },
  })

  console.log('🖼️ Media assets created')

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Lumina CMS',
      slug: 'getting-started-with-lumina-cms',
      contentMd: `# Getting Started with Lumina CMS

Welcome to Lumina CMS! This is a comprehensive content management system built with modern technologies.

## Features

- **User Management**: Role-based access control with admin, editor, author, and moderator roles
- **Content Management**: Rich content creation with Markdown support
- **Categories & Tags**: Hierarchical categorization and flexible tagging
- **Comment System**: Moderated comments with approval workflow
- **Media Management**: Upload and manage images and other media assets
- **SEO Optimization**: Built-in SEO fields for better search visibility

## Getting Started

1. Create your account
2. Choose your role
3. Start creating content!

This CMS is designed to be flexible and scalable for various types of websites and blogs.`,
      excerpt:
        'Welcome to Lumina CMS! Learn about the features and how to get started with this comprehensive content management system.',
      status: 'published',
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: webDevCategory.id,
      coverImageId: sampleImage.id,
      seoTitle: 'Getting Started with Lumina CMS - Complete Guide',
      seoDescription:
        'Learn how to use Lumina CMS, a modern content management system with user management, content creation, and SEO features.',
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Advanced TypeScript Patterns for React Development',
      slug: 'advanced-typescript-patterns-react-development',
      contentMd: `# Advanced TypeScript Patterns for React Development

TypeScript has become an essential tool for React developers. In this post, we'll explore advanced patterns that can improve your code quality and developer experience.

## Generic Components

Creating reusable components with proper typing:

\`\`\`typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Conditional Props

Using discriminated unions for component props:

\`\`\`typescript
type ButtonProps =
  | { variant: 'primary'; onClick: () => void }
  | { variant: 'link'; href: string }

function Button(props: ButtonProps) {
  if (props.variant === 'primary') {
    return <button onClick={props.onClick}>Primary Button</button>
  }
  return <a href={props.href}>Link Button</a>
}
\`\`\`

These patterns help create more maintainable and type-safe React applications.`,
      excerpt:
        'Explore advanced TypeScript patterns that can improve your React development experience and code quality.',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      authorId: editorUser.id,
      categoryId: webDevCategory.id,
      seoTitle: 'Advanced TypeScript Patterns for React - Best Practices',
      seoDescription:
        'Learn advanced TypeScript patterns for React development including generic components and conditional props.',
    },
  })

  const draftPost = await prisma.post.create({
    data: {
      title: 'UI Design Principles for Web Applications',
      slug: 'ui-design-principles-web-applications',
      contentMd: `# UI Design Principles for Web Applications

This is a draft post about UI design principles. More content coming soon...

## Key Principles

1. Consistency
2. Feedback
3. Hierarchy
4. Accessibility

*This post is currently in draft status.*`,
      excerpt:
        'Learn about essential UI design principles that make web applications more user-friendly and accessible.',
      status: 'draft',
      authorId: authorUser.id,
      categoryId: designCategory.id,
      seoTitle: 'UI Design Principles for Web Applications - Draft',
      seoDescription:
        'Essential UI design principles for creating user-friendly web applications.',
    },
  })

  console.log('📝 Posts created')

  // Create post-tag relationships
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: nextjsTag.id },
      { postId: post1.id, tagId: reactTag.id },
      { postId: post2.id, tagId: reactTag.id },
      { postId: post2.id, tagId: typescriptTag.id },
      { postId: draftPost.id, tagId: uiTag.id },
    ],
  })

  console.log('🔗 Post-tag relationships created')

  // Create sample comments
  const comment1 = await prisma.comment.create({
    data: {
      body: 'Great article! Very helpful for getting started with the CMS.',
      status: 'approved',
      postId: post1.id,
      userId: editorUser.id,
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      body: 'Thanks for the feedback! Glad it was helpful.',
      status: 'approved',
      postId: post1.id,
      userId: adminUser.id,
      parentId: comment1.id, // Reply to first comment
    },
  })

  await prisma.comment.create({
    data: {
      body: 'Excellent TypeScript examples. Will definitely use these patterns in my projects.',
      status: 'approved',
      postId: post2.id,
      userId: authorUser.id,
    },
  })

  console.log('💬 Comments created')

  // Create role history for demonstration
  await prisma.userRoleHistory.create({
    data: {
      userId: editorUser.id,
      fromRole: 'author',
      toRole: 'editor',
      changedBy: adminUser.id,
      note: 'Promoted to editor role due to excellent content contributions',
    },
  })

  console.log('📋 Role history created')

  // Create login audit entries
  await prisma.userLoginAudit.createMany({
    data: [
      {
        userId: adminUser.id,
        provider: 'email',
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        success: true,
      },
      {
        userId: editorUser.id,
        provider: 'email',
        ipAddress: '192.168.1.101',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
      },
    ],
  })

  console.log('🔐 Login audit entries created')

  // Create sample invitation
  await prisma.userInvite.create({
    data: {
      email: 'newuser@example.com',
      role: 'author',
      invitedBy: adminUser.id,
      status: 'pending',
    },
  })

  console.log('📧 User invitation created')

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log('  👥 3 users (admin, editor, author)')
  console.log('  📁 3 categories (Technology > Web Development, Design)')
  console.log('  🏷️ 4 tags (React, Next.js, TypeScript, UI)')
  console.log('  📝 3 posts (2 published, 1 draft)')
  console.log('  💬 3 comments (with nested replies)')
  console.log('  🖼️ 1 media asset')
  console.log('  📋 Role history and audit logs')
  console.log('  📧 1 pending invitation')
}

seed()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
