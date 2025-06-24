/**
 * Fixed Theme Toggle Component with better error handling
 */



import { Moon, Sun } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useDarkMode } from '@/js/shared/context/DarkModeContext'

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useDarkMode()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl hover:bg-muted/50 transition-colors"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const isDark = isDarkMode || (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl hover:bg-muted/50 transition-colors relative overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Switch to {isDark ? "light" : "dark"} mode</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
