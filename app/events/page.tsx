"use client"

import { useState, useEffect, useCallback } from 'react'
import { ArrowUp, Heart, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { CameraModal } from "@/components/camera-modal"
import { Button } from "@/components/ui/button"

// Sample data structure for photos
interface Photo {
  id: number
  username: string
  imageUrl: string
  caption: string
  aspectRatio: string
  gridArea: string
  hearts: number
}

// Initial photos data
const initialPhotos: Photo[] = [
  {
    id: 1,
    username: "saraswati_devotee",
    imageUrl: "/event1.png",
    caption: "Morning prayers and preparations 🙏",
    aspectRatio: "aspect-[3/4]",
    gridArea: "span 2 / span 1",
    hearts: 24,
  },
  {
    id: 2,
    username: "puja_enthusiast",
    imageUrl: "/cambridge.jpg",
    caption: "Beautiful decorations for the altar ✨",
    aspectRatio: "aspect-[4/3]",
    gridArea: "span 1 / span 1",
    hearts: 18,
  },
  {
    id: 3,
    username: "temple_vibes",
    imageUrl: "/republic day.jpg",
    caption: "Traditional sweets for prasad 🍯",
    aspectRatio: "aspect-[3/4]",
    gridArea: "span 2 / span 1",
    hearts: 32,
  }
]

/**
 * Custom hook to handle scroll-to-top functionality
 */
function useScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { showScrollTop, scrollToTop }
}

export default function EventsPage() {
  // Move all hooks to the top
  const { user } = useAuth()
  const { showScrollTop, scrollToTop } = useScrollToTop()
  const [photoData, setPhotoData] = useState(initialPhotos)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const handleHeartClick = useCallback((id: number) => {
    setPhotoData(prevData =>
      prevData.map(photo =>
        photo.id === id ? { ...photo, hearts: photo.hearts + 1 } : photo
      )
    )
  }, [])
  const handlePhotoCapture = useCallback((photoData: { imageUrl: string; caption: string; username: string }) => {
    const newPhoto: Photo = {
      id: Date.now(),
      username: photoData.username,
      imageUrl: photoData.imageUrl,
      caption: photoData.caption,
      aspectRatio: "aspect-[3/4]",
      gridArea: "span 2 / span 1",
      hearts: 0
    }
    setPhotoData(prevData => [newPhoto, ...prevData])
  }, [])

  // Early return after all hooks are defined
  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="max-w-md mx-auto pb-16">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4 border-b border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Event Gallery</h1>
            <p className="text-muted-foreground text-sm">Photos from our community</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
            onClick={() => setIsCameraOpen(true)}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 auto-rows-[minmax(0,auto)] gap-4">
          {photoData.map((photo) => (
            <motion.div
              key={photo.id}
              className={`relative ${photo.gridArea}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
                <div className={`relative ${photo.aspectRatio}`}>
                  {photo.imageUrl.startsWith('data:') ? (
                    // For captured photos (data URLs)
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption}
                      fill
                      className="object-cover"
                      unoptimized // Required for data URLs
                    />
                  ) : (
                    // For static images
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white font-medium text-sm">
                      {photo.username}
                    </p>
                  </div>
                  <motion.button
                    className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full transition-opacity duration-200 flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleHeartClick(photo.id)}
                  >
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">{photo.hearts}</span>
                  </motion.button>
                </div>
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">{photo.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="fixed bottom-20 right-4 bg-primary text-white p-2 rounded-full shadow-lg"
              onClick={scrollToTop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCapture={handlePhotoCapture}
      />
    </div>
  )
} 