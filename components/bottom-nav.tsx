"use client"

import { Home, Camera, Calendar, Facebook, Instagram } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { CameraModal } from "./camera-modal"

const SOCIAL_LINKS = {
  instagram: "https://instagram.com/saraswatipuja",
  facebook: "https://facebook.com/saraswatipuja"
}

export function BottomNav() {
  const pathname = usePathname()
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const handleSocialClick = (platform: 'facebook' | 'instagram') => {
    const url = SOCIAL_LINKS[platform]
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-primary/20 backdrop-blur-lg shadow-lg pb-safe">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center p-3">
            <Link
              href="/"
              className={`flex flex-col items-center relative ${
                pathname === "/" 
                ? "text-primary after:absolute after:bottom-[-12px] after:w-1/2 after:h-1 after:bg-primary after:rounded-full" 
                : "text-primary/60 hover:text-primary/80"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href="/events"
              className={`flex flex-col items-center relative ${
                pathname === "/events" 
                ? "text-primary after:absolute after:bottom-[-12px] after:w-1/2 after:h-1 after:bg-primary after:rounded-full" 
                : "text-primary/60 hover:text-primary/80"
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs mt-1">Events</span>
            </Link>
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex flex-col items-center text-primary/60 hover:text-primary/80 transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs mt-1">Camera</span>
            </button>
            <button
              onClick={() => handleSocialClick('instagram')}
              className="flex flex-col items-center text-primary/60 hover:text-primary/80 transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-xs mt-1">Instagram</span>
            </button>
            <button
              onClick={() => handleSocialClick('facebook')}
              className="flex flex-col items-center text-primary/60 hover:text-primary/80 transition-colors"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-xs mt-1">Facebook</span>
            </button>
          </div>
        </div>
      </nav>
      
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
      />
    </>
  )
}

