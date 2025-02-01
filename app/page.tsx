"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { LocationSelector } from "@/components/location-selector"
import { EventCard } from "@/components/event-card"
import { ProfilePicture } from "@/components/profile-picture"
import { TimelineCard } from "@/components/timeline-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Sun, Music, Utensils } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const { user } = useAuth()
  // Respect user's reduced motion preferences
  const shouldReduceMotion = useReducedMotion()

  if (!user) {
    return <LoginForm />
  }

  return (
    <motion.div className="space-y-6 p-4" variants={container} initial="hidden" animate="show">
      <motion.div
        className="flex items-center justify-between"
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      >
        <LocationSelector />
        <ProfilePicture />
      </motion.div>

      <motion.div className="space-y-2" variants={item}>
        <motion.h1
          className="text-3xl font-bold text-primary"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
        >
          Vasant Panchami
        </motion.h1>
        <motion.p
          className="text-primary-light text-lg"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
        >
          Celebrate Saraswati Puja with us
        </motion.p>
      </motion.div>

      <motion.div className="relative" variants={item} whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}>
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for events"
          className="pl-10 bg-white/80 focus:ring-2 ring-primary/20 transition-all"
        />
      </motion.div>

      <motion.section className="space-y-4" variants={item}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Featured Event</h2>
        </div>

        <EventCard
          title="Saraswati Puja 2025"
          time="9:00 AM"
          date="February 3rd, 2025"
          category="Cultural"
          imageUrl="/event1.png"
          className="mb-4"
        />

        <motion.div
          className="bg-white/80 p-6 rounded-lg border border-primary/20 shadow-sm"
          variants={item}
          whileHover={shouldReduceMotion ? undefined : { y: -5 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary">Event Details</h3>
          <p className="text-muted-foreground mb-4">
            Dear Parents, you are cordially invited to celebrate Vasant Panchami and receive blessings from Ma
            Saraswati.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Date:</span> Monday, February 3rd, 2025
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Time:</span> 9:00 AM
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Location:</span> C-Plaza
            </p>
          </div>
          <motion.div className="mt-6" whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}>
            <p className="text-sm text-center italic text-primary">
              ॐ सरवयै च वहे पुयै च धीमह तो देवी चोदयात्
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <TimelineCard 
            events={[
              {
                time: "9:00 AM",
                event: "Puja Commences",
                icon: <Sun className="w-full h-full text-primary" />,
              },
              {
                time: "9:55 AM",
                event: "Anjali Begins",
                icon: <Music className="w-full h-full text-primary" />,
              },
              {
                time: "10:00 AM",
                event: "Khichdi Prasad Vitaran Seva",
                icon: <Utensils className="w-full h-full text-primary" />,
              },
            ]}
            date={{
              month: "Feb",
              day: 3
            }}
          />
        </motion.div>
      </motion.section>

      <motion.section className="space-y-4" variants={item}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Other Events</h2>
          <motion.a
            href="#"
            className="text-primary-light text-sm"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          >
            See All
          </motion.a>
        </div>

        <EventCard
          title="Republic Day"
          time="2:00 PM"
          date="January 26th, 2025"
          category="National"
          imageUrl="/republic day.jpg"
        />

        <EventCard
          title="Cambridge School"
          time="4:00 PM"
          date="February 3rd, 2025"
          category="Academics"
          imageUrl="/cambridge.jpg"
        />
      </motion.section>
    </motion.div>
  )
}

