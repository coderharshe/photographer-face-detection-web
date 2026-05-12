'use client'

import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

export function UploadZone({ eventId }: { eventId: string }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    setUploading(true)
    const files = Array.from(e.target.files)
    let completed = 0

    // Upload to FastAPI endpoint
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        await fetch(`http://localhost:8000/api/events/${eventId}/upload`, {
          method: 'POST',
          body: formData,
        })
      } catch (err) {
        console.error('Upload failed for', file.name, err)
      } finally {
        completed++
        setProgress(Math.round((completed / files.length) * 100))
      }
    }

    setUploading(false)
    window.location.reload()
  }

  return (
    <div className="border-2 border-dashed border-neutral-800 rounded-2xl p-12 text-center hover:border-neutral-500 transition-colors relative group bg-neutral-900">
      <input 
        type="file" 
        multiple 
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      <div className="pointer-events-none flex flex-col items-center gap-4">
        {uploading ? (
          <>
            <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin" />
            <div>
              <p className="text-xl font-medium text-white">Uploading... {progress}%</p>
              <p className="text-neutral-500 mt-1">Please do not close this window.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-medium text-white">Upload Photos</p>
              <p className="text-neutral-500 mt-1">Drag and drop or click to select files</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
