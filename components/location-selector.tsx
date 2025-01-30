"use client"

import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const locations = [
  "Temple Hall",
  "Community Center",
  "Main Auditorium",
  "Garden Area",
]

export function LocationSelector() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Select Location</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {locations.map((location) => (
            <DropdownMenuItem key={location}>
              {location}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}

