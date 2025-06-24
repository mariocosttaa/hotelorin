/**
 * Reusable file card component
 */


import { motion } from "framer-motion"
import { MoreHorizontal, Share2, Users } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import type { RecentFile } from "../../types"

interface FileCardProps {
  file: RecentFile
  variant?: "list" | "grid"
}

export function FileCard({ file, variant = "list" }: FileCardProps) {
  if (variant === "grid") {
    return (
      <motion.div
        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        className="flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">{file.icon}</div>
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {file.app} • {file.modified}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {file.shared && (
            <Badge variant="outline" className="rounded-xl">
              <Users className="mr-1 h-3 w-3" />
              {file.collaborators}
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="rounded-xl">
            Open
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="p-3 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-3 md:gap-0"
    >
      <div className="col-span-6 flex items-center gap-3 w-full md:w-auto">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">{file.icon}</div>
        <div>
          <p className="font-medium">{file.name}</p>
          {file.shared && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="mr-1 h-3 w-3" />
              Shared with {file.collaborators} people
            </div>
          )}
        </div>
      </div>
      <div className="col-span-2 text-sm md:text-base">{file.app}</div>
      <div className="col-span-2 text-sm md:text-base">{file.size}</div>
      <div className="col-span-2 flex items-center justify-between w-full md:w-auto">
        <span className="text-sm md:text-base">{file.modified}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
