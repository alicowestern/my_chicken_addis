'use client'

import React, { useState } from 'react'

interface Media {
  id: string
  url: string
  title?: string | null
  type?: string | null
  alt?: string | null
  caption?: string | null
  fileType?: string | null
  category: string
}

export default function GalleryGrid({ items }: { items: Media[] }) {
  const [category, setCategory] = useState('ALL')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))]

  const filtered = category === 'ALL' ? items : items.filter((i) => i.category === category)

  return (
    <div>
      {/* Filters */}
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 text-sm font-semibold rounded-full border transition-colors ${
                category === cat
                  ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
                  : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {cat === 'ALL' ? 'All Photos' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item.url)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-[rgba(255,255,255,0.05)] bg-brand-surface"
          >
            {item.fileType?.includes('image') || !item.fileType ? (
              <img
                src={item.url}
                alt={item.alt || item.title || 'Gallery image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-dark text-brand-muted text-sm">
                Video Document
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div>
                <p className="text-white font-medium text-sm line-clamp-1">{item.title || item.caption || item.alt}</p>
                <p className="text-brand-cyan text-xs font-bold mt-1 uppercase tracking-wider">{item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  )
}
