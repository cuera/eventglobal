"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, RotateCcw, Save } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Add type declaration for showSaveFilePicker
declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
  }
}

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CameraModal({ isOpen, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<string>('')
  const [isButtonPressed, setIsButtonPressed] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize camera when modal opens
  useEffect(() => {
    let stream: MediaStream | null = null

    async function initCamera() {
      try {
        setIsInitializing(true)
        // Try to get the webcam first
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user' // Default to webcam
          },
          audio: false
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setIsInitializing(false)
          }
          setHasPermission(true)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setHasPermission(false)
        setIsInitializing(false)
      }
    }

    if (isOpen && !capturedImage) {
      initCamera()
    }

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen, capturedImage])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to image and save
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)

    // Save to local storage
    try {
      localStorage.setItem('lastCapturedImage', imageDataUrl)
    } catch (error) {
      console.error('Error saving to local storage:', error)
    }
  }

  const saveToDevice = async () => {
    if (!capturedImage) return

    try {
      setSaveStatus('saving')
      
      // Convert base64 to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      
      // Try using the File System Access API first
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: `saraswati-puja-${new Date().getTime()}.jpg`,
            types: [{
              description: 'JPEG Image',
              accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
            }],
          })
          const writable = await handle.createWritable()
          await writable.write(blob)
          await writable.close()
          setSaveStatus('success')
          return
        } catch {
          // User cancelled or API not supported, fall back to share API
          console.log('File System Access API failed, trying Share API')
        }
      }

      // Try Web Share API as fallback
      if (navigator.share) {
        try {
          const file = new File([blob], `saraswati-puja-${new Date().getTime()}.jpg`, {
            type: 'image/jpeg'
          })
          await navigator.share({
            files: [file],
            title: 'Saraswati Puja Photo',
          })
          setSaveStatus('success')
          return
        } catch {
          console.log('Share API failed, falling back to download')
        }
      }

      // Final fallback: traditional download
      const link = document.createElement('a')
      link.href = capturedImage
      link.download = `saraswati-puja-${new Date().getTime()}.jpg`
      link.click()
      setSaveStatus('success')
      
    } catch (error) {
      console.error('Error saving photo:', error)
      setSaveStatus('error')
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setSaveStatus('')
  }

  const handleClose = () => {
    setCapturedImage(null)
    setSaveStatus('')
    onClose()
  }

  const handleCaptureStart = () => {
    setIsButtonPressed(true)
  }

  const handleCaptureEnd = () => {
    setIsButtonPressed(false)
    capturePhoto()
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
          <canvas ref={canvasRef} className="hidden" />

          <div className="relative flex-1">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Loading State */}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-white/70 text-sm">Initializing camera...</p>
                </div>
              </div>
            )}

            {/* Permission Denied Message */}
            {hasPermission === false && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4 bg-black">
                <div className="space-y-4">
                  <Camera className="w-12 h-12 mx-auto opacity-50" />
                  <p>Camera access denied. Please enable camera access in your browser settings.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setHasPermission(null)
                      setIsInitializing(true)
                      window.location.reload() // Force browser to re-request permissions
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Camera View / Captured Image */}
            <div className="w-full h-full relative">
              {capturedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={capturedImage}
                    alt="Captured photo"
                    fill
                    priority
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Camera Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Save Status Message */}
            {saveStatus && (
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm ${
                saveStatus === 'success' ? 'bg-green-500' : 
                saveStatus === 'error' ? 'bg-red-500' : 
                'bg-white/20'
              } text-white transition-all`}>
                {saveStatus === 'saving' && 'Saving photo...'}
                {saveStatus === 'success' && 'Photo saved!'}
                {saveStatus === 'error' && 'Failed to save photo'}
              </div>
            )}

            {/* Camera Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
              {capturedImage ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 w-12 h-12 backdrop-blur-sm"
                    onClick={retakePhoto}
                  >
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 w-16 h-16 rounded-full border-2 backdrop-blur-sm"
                    onClick={saveToDevice}
                    disabled={saveStatus === 'saving'}
                  >
                    <Save className="h-8 w-8" />
                  </Button>
                </>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`relative w-20 h-20 rounded-full transition-all duration-200 ${
                      isButtonPressed 
                        ? 'bg-white/20 scale-95' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    onMouseDown={handleCaptureStart}
                    onMouseUp={handleCaptureEnd}
                    onTouchStart={handleCaptureStart}
                    onTouchEnd={handleCaptureEnd}
                    disabled={!hasPermission}
                  >
                    <div className={`absolute inset-2 rounded-full transition-all duration-200 ${
                      isButtonPressed 
                        ? 'bg-white/80 scale-90' 
                        : 'bg-white'
                    }`} />
                    <div className="absolute inset-0 rounded-full border-4 border-white" />
                  </Button>
                  {/* Focus Ring */}
                  <div className="absolute -inset-1 rounded-full border border-white/20 pointer-events-none" />
                </motion.div>
              )}
            </div>

            {/* Camera Instructions */}
            {!capturedImage && (
              <div className="absolute bottom-28 left-0 right-0 text-center text-white/60 text-sm">
                Tap the button to take a photo
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 