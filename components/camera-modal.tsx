"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Image as ImageIcon, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onPhotoCapture?: (photoData: {
    imageUrl: string
    caption: string
    username: string
  }) => void
}

export function CameraModal({ isOpen, onClose, onPhotoCapture }: CameraModalProps) {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [caption, setCaption] = useState("")

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !stream && !capturedImage) {
      startCamera()
    }
    
    // Cleanup when component unmounts or modal closes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen, stream, capturedImage])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      })
      setStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setHasPermission(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setHasPermission(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const handleClose = () => {
    stopCamera()
    setCapturedImage(null)
    setCaption("")
    onClose()
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw the video frame to the canvas
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert to data URL
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageUrl)
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const handleSave = () => {
    if (capturedImage && user && onPhotoCapture) {
      onPhotoCapture({
        imageUrl: capturedImage,
        caption: caption || "A moment from Saraswati Puja 🙏",
        username: user.name
      })
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          <div className="relative flex-1">
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              {!capturedImage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={capturePhoto}
                >
                  <Camera className="h-6 w-6" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            {hasPermission === false && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                <p>Camera access denied. Please enable camera access in your browser settings.</p>
              </div>
            )}
            
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex flex-col">
                <div className="relative flex-1">
                  <Image
                    src={capturedImage}
                    alt="Captured photo"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
                <div className="bg-black/80 p-4 space-y-4">
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                    className="w-full bg-white/10 text-white placeholder:text-white/60 rounded-lg p-2 border border-white/20"
                  />
                  <div className="flex justify-between gap-4">
                    <Button
                      variant="ghost"
                      className="flex-1 text-white hover:bg-white/20"
                      onClick={retakePhoto}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={handleSave}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Save to Gallery
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 