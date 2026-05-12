'use client'

import { useEffect, useState } from 'react'
import { getPresignedUrl } from '@/app/actions/storage'
import Image from 'next/image'

export function EventImage({ objectKey, alt }: { objectKey: string, alt: string }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadUrl() {
      const signedUrl = await getPresignedUrl(objectKey)
      if (signedUrl) setUrl(signedUrl)
    }
    loadUrl()
  }, [objectKey])

  if (!url) {
    return <div className="w-full h-full bg-neutral-800 animate-pulse rounded-lg" />
  }

  return (
    <div className="relative w-full aspect-square bg-neutral-900 rounded-lg overflow-hidden">
      {/* Note: since Next.js Image component requires domain config for external URLs, 
          we might just use an img tag for presigned URLs to avoid configuration overhead 
          or we can configure cloudflarestorage.com in next.config.mjs */}
      <img 
        src={url} 
        alt={alt}
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
      />
    </div>
  )
}
