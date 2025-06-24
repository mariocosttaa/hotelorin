/**
 * Reusable hero section component
 */



import type React from "react"

import { motion } from "framer-motion"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"

interface HeroSectionProps {
  title: string
  description: string
  primaryButtonText: string
  secondaryButtonText?: string
  badgeText?: string
  gradient: string
  children?: React.ReactNode
}

export function HeroSection({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  badgeText,
  gradient,
  children,
}: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`overflow-hidden rounded-3xl ${gradient} p-8 text-white`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          {badgeText && <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">{badgeText}</Badge>}
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="max-w-[600px] text-white/80">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-2xl bg-white text-indigo-700 hover:bg-white/90">{primaryButtonText}</Button>
            {secondaryButtonText && (
              <Button
                variant="outline"
                className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  )
}
