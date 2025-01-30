"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from 'lucide-react'
import React from 'react'

interface TimelineEvent {
  time: string
  event: string
  icon: React.ReactNode
}

interface TimelineCardProps {
  events: TimelineEvent[]
  date: {
    month: string
    day: number
  }
}

export function TimelineCard({ events, date }: TimelineCardProps) {
  return (
    <Card className="bg-white/80 border border-primary/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-space-grotesk text-primary flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Order of Proceedings
        </CardTitle>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center bg-primary/5 rounded-lg p-2 min-w-[60px] shadow-sm"
        >
          <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
            {date.month}
          </span>
          <span className="text-2xl font-bold text-primary leading-none mt-1">
            {date.day}
          </span>
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 pl-6">
          {/* Main vertical line - white color */}
          <div className="absolute left-6 top-2 bottom-2 w-[2px] bg-white/80 -z-10" />
          
          {events.map((event, index) => (
            <motion.div
              key={event.time}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start relative"
            >
              {/* Icon container - positioned absolutely for perfect alignment */}
              <div className="absolute -left-6 flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/5 rounded-full shadow-sm flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {event.icon}
                  </div>
                </div>
              </div>
              
              {/* Content - with left padding to account for absolute icon */}
              <div className="flex-grow pl-10 pt-2">
                <p className="font-space-grotesk font-medium text-primary text-lg">
                  {event.time}
                </p>
                <p className="text-primary-light font-poppins mt-1">
                  {event.event}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

