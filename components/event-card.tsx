"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface EventCardProps {
  title: string
  time: string
  date: string
  category: string
  imageUrl?: string
  className?: string
}

export function EventCard({
  title,
  time,
  date,
  category,
  imageUrl = "/event1.png",
  className,
}: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn("overflow-hidden", className)}
    >
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={imageError ? "/event-placeholder.svg" : imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
          <Badge className="absolute top-4 right-4">{category}</Badge>
          <motion.button
            className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isLiked ? "fill-primary text-primary" : "text-primary/50"
              )}
            />
          </motion.button>
        </div>
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{title}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
                <span>•</span>
                <span>{date}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {/* Add any additional content here */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

