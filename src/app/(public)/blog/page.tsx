import { SectionHeader } from '@/components/ui/index'
import { getPublishedBlogPosts } from '@/lib/actions/public'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Blog',
  description: 'Latest news, stories, and educational content from My Chicken Addis.',
}

export default async function BlogPage() {
  const result = await getPublishedBlogPosts()
  const posts = result.success ? result.data.posts : []

  return (
    <>
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="News & Updates"
              title="Blog & Articles"
              description="Stay up to date with the latest poultry farming news, stories, and educational content."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-gray-500 text-lg mb-4">No articles published yet.</p>
              <p className="text-brand-gray-500 text-sm">Check back soon for news and updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl border border-brand-gray-200 overflow-hidden hover:border-brand-cyan/30 transition-all duration-300 hover:-translate-y-1 group">
                  {post.featuredImage && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">{post.category.name}</span>
                    )}
                    <h3 className="text-lg font-bold text-brand-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-brand-cyan transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-brand-gray-500 line-clamp-3 mb-4">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-brand-gray-500">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {post.author.name}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
