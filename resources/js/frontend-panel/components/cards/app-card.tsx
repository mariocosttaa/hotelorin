/**
 * Enhanced app card with modern design
 */


import { cn } from '../../lib/utils'
import { motion } from "framer-motion"
import { Star, Download, ExternalLink } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import type { App } from "../../types"

interface AppCardProps {
  app: App
  showProgress?: boolean
  showCategory?: boolean
}

export function AppCard({ app, showProgress = false, showCategory = false }: AppCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="group overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500 rounded-3xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/50 to-muted group-hover:from-violet-500/10 group-hover:to-indigo-500/10 transition-all duration-300 shadow-sm">
                {app.icon}
              </div>
              {app.new && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">N</span>
                </div>
              )}
            </div>
            {app.new ? (
              <Badge className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
                New
              </Badge>
            ) : showCategory ? (
              <Badge variant="outline" className="rounded-xl border-border/50 bg-muted/30">
                {app.category}
              </Badge>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <CardTitle className="text-lg font-semibold mb-2">{app.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">{app.description}</CardDescription>
          {showProgress && app.progress < 100 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Installation</span>
                <span className="font-medium">{app.progress}%</span>
              </div>
              <Progress value={app.progress} className="h-2 rounded-full bg-muted/50" />
            </div>
          )}
        </CardContent>
        <CardFooter className={cn("pt-0", showCategory ? "flex gap-2" : "")}>
          <Button
            variant="secondary"
            className={cn(
              "rounded-2xl bg-muted/50 hover:bg-muted/80 transition-colors shadow-sm",
              showCategory ? "flex-1" : "w-full",
            )}
          >
            {app.progress < 100 ? (
              <>
                <Download className="mr-2 h-4 w-4" />
                {showProgress ? "Continue Install" : "Install"}
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </>
            )}
          </Button>
          {showCategory && (
            <Button variant="outline" size="icon" className="rounded-2xl border-border/50 hover:bg-muted/50">
              <Star className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
