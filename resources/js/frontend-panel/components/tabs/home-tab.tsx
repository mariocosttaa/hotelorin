/**
 * Home tab content component
 */



import { motion } from "framer-motion"
import { Heart, MessageSquare } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { HeroSection } from "../../components/sections/hero-section"
import { AppCard } from "../../components/cards/app-card"
import { FileCard } from "../../components/cards/file-card"
import { APPS, RECENT_FILES, PROJECTS, COMMUNITY_POSTS } from "../../constants/data"

export function HomeTab() {
  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSection
          title="Welcome to DesignAli Creative Suite"
          description="Unleash your creativity with our comprehensive suite of professional design tools and resources."
          primaryButtonText="Explore Plans"
          secondaryButtonText="Take a Tour"
          badgeText="Premium"
          gradient="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600"
        >
          <div className="hidden lg:block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative h-40 w-40"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
              <div className="absolute inset-4 rounded-full bg-white/20" />
              <div className="absolute inset-8 rounded-full bg-white/30" />
              <div className="absolute inset-12 rounded-full bg-white/40" />
              <div className="absolute inset-16 rounded-full bg-white/50" />
            </motion.div>
          </div>
        </HeroSection>
      </section>

      {/* Recent Apps */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Apps</h2>
          <Button variant="ghost" className="rounded-2xl">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {APPS.filter((app) => app.recent).map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>
      </section>

      {/* Recent Files and Active Projects */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Files</h2>
            <Button variant="ghost" className="rounded-2xl">
              View All
            </Button>
          </div>
          <div className="rounded-3xl border">
            <div className="grid grid-cols-1 divide-y">
              {RECENT_FILES.slice(0, 4).map((file) => (
                <FileCard key={file.name} file={file} variant="grid" />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Active Projects</h2>
            <Button variant="ghost" className="rounded-2xl">
              View All
            </Button>
          </div>
          <div className="rounded-3xl border">
            <div className="grid grid-cols-1 divide-y">
              {PROJECTS.slice(0, 3).map((project) => (
                <motion.div key={project.name} whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="text-sm text-muted-foreground">Due {project.dueDate}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-xl h-2">
                      <div
                        className="bg-primary h-2 rounded-xl transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span>{project.members} members</span>
                    <span>{project.files} files</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Community Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Community Highlights</h2>
          <Button variant="ghost" className="rounded-2xl">
            Explore
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COMMUNITY_POSTS.map((post) => (
            <motion.div key={post.title} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
              <Card className="overflow-hidden rounded-3xl">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">by {post.author}</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      {post.likes}
                      <MessageSquare className="ml-2 h-4 w-4 text-blue-500" />
                      {post.comments}
                    </div>
                    <span className="text-muted-foreground">{post.time}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
