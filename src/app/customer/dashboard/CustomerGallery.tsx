'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Search, Download } from 'lucide-react'
import { EventImage } from '../../photographer/dashboard/events/[id]/EventImage'
import { getPresignedUrl } from '@/app/actions/storage'

export function CustomerGallery() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setSearched(false)
    }
  }

  const searchFaces = async () => {
    if (!file) return
    setLoading(true)
    setSearched(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:8000/api/faces/search', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.matches) {
        setMatches(data.matches)
      } else {
        setMatches([])
      }
    } catch (err) {
      console.error(err)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (originalUrl: string) => {
    const url = await getPresignedUrl(originalUrl)
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-12">
      <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-light mb-6">Find Your Photos</h2>
        
        {!preview ? (
          <div className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors rounded-2xl p-12 relative cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              capture="user"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-xl text-white font-medium">Take a Selfie</p>
                <p className="text-neutral-500 mt-2">Upload a clear photo of your face to find your memories.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-neutral-800">
              <img src={preview} alt="Selfie preview" className="object-cover w-full h-full" />
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => { setPreview(null); setFile(null); setMatches([]); setSearched(false); }}
                className="px-6 py-3 rounded-full border border-neutral-700 hover:bg-neutral-800 transition-colors"
              >
                Retake
              </button>
              <button 
                onClick={searchFaces}
                disabled={loading}
                className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? 'Searching...' : 'Search Photos'}
              </button>
            </div>
          </div>
        )}
      </section>

      {searched && (
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
            <h3 className="text-2xl font-light">
              {loading ? 'Scanning events...' : `Found ${matches.length} matching photos`}
            </h3>
          </div>

          {!loading && matches.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              <AnimatePresence>
                {matches.map((match) => (
                  <motion.div 
                    key={match.imageId}
                    className="relative group bg-neutral-900 rounded-2xl overflow-hidden aspect-[4/5]"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <EventImage objectKey={match.optimizedUrl} alt="Matched photo" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={() => handleDownload(match.originalUrl)}
                        className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <Download className="w-5 h-5" />
                        Download High-Res
                      </button>
                    </div>
                    
                    {/* Similarity Score Badge */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-neutral-700">
                      {Math.round(match.similarity * 100)}% Match
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && matches.length === 0 && (
            <div className="py-32 text-center text-neutral-500 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
              <p className="text-xl">No matching photos found.</p>
              <p className="mt-2 text-sm">Try uploading a clearer selfie or check back later if the event was recent.</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
