"use client"

import { Home, Camera, Image, Facebook, Instagram } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { CameraModal } from "./camera-modal"

export function BottomNav() {
  const pathname = usePathname()
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-primary/20 backdrop-blur-sm">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center p-3">
            <Link
              href="/"
              className={`flex flex-col items-center ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href="/events"
              className={`flex flex-col items-center ${pathname === "/events" ? "text-primary" : "text-muted-foreground"}`}
            >
              <Image className="w-6 h-6" />
              <span className="text-xs mt-1">Gallery</span>
            </Link>
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs mt-1">Camera</span>
            </button>
            <Link
              href="https://instagram.com/saraswatipuja"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-xs mt-1">Instagram</span>
            </Link>
            <Link
              href="https://facebook.com/saraswatipuja"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-xs mt-1">Facebook</span>
            </Link>
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

