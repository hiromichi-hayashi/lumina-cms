import { z } from 'zod'

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

export const PostResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  authorId: z.string(),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const PostsListResponseSchema = z.object({
  posts: z.array(PostResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type PostResponse = z.infer<typeof PostResponseSchema>
export type PostsListResponse = z.infer<typeof PostsListResponseSchema>
