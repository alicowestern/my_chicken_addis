'use server'

import { prisma } from '@/lib/database/prisma'
import { 
  type ActionResult, 
  handleActionError, 
  requireAuth,
  requireAnyPermission,
  parsePagination,
  buildPaginationMeta,
  type PaginationParams,
  type PaginatedResult
} from '@/lib/actions/utils'
import type { BlogPost, BlogCategory } from '@prisma/client'
import { z } from 'zod'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

export async function getBlogPosts(params: PaginationParams): Promise<ActionResult<PaginatedResult<BlogPost & { category: BlogCategory | null }>>> {
  try {
    await requireAnyPermission(['blog:read', 'blog:write'])
    
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)
    
    const where: any = { deletedAt: null }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])
    
    return {
      success: true,
      data: {
        items: posts,
        meta: buildPaginationMeta(total, page, limit),
      },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getBlogPostById(id: string): Promise<ActionResult<BlogPost>> {
  try {
    await requireAnyPermission(['blog:read', 'blog:write'])
    
    const post = await prisma.blogPost.findUnique({
      where: { id, deletedAt: null },
    })
    
    if (!post) throw new Error('Record not found')
    return { success: true, data: post }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createBlogPost(formData: FormData): Promise<ActionResult<BlogPost>> {
  try {
    const user = await requireAnyPermission(['blog:write'])
    
    const raw = Object.fromEntries(formData.entries())
    const data = blogPostSchema.parse({
      ...raw,
      categoryId: raw.categoryId === '' ? null : raw.categoryId
    })
    
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        authorId: user.id,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    })
    
    return { success: true, data: post }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<ActionResult<BlogPost>> {
  try {
    await requireAnyPermission(['blog:write'])
    
    const raw = Object.fromEntries(formData.entries())
    const data = blogPostSchema.parse({
      ...raw,
      categoryId: raw.categoryId === '' ? null : raw.categoryId
    })
    
    // Check if transitioning to published
    const existingPost = await prisma.blogPost.findUnique({ where: { id } })
    const isNewlyPublished = existingPost?.status !== 'PUBLISHED' && data.status === 'PUBLISHED'
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: isNewlyPublished ? new Date() : undefined,
      },
    })
    
    return { success: true, data: post }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult<void>> {
  try {
    await requireAnyPermission(['blog:write'])
    
    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    
    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}
