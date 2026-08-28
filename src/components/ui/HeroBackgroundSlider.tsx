'use client'

import React, { useState, useEffect } from 'react'

const images = [
  "/Images/img1.webp",
  "/Images/img2.png"
]

export default function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 z-0 bg-brand-dark-deep">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ))}
      {/* Light gradient just at the bottom to transition into the next section smoothly */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-dark-deep to-transparent" />
    </div>
  )
}
