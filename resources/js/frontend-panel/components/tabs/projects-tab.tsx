/**
 * Projects tab content component
 */



import { Archive, Clock, Layers, Plus, Search, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardFooter } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { HeroSection } from "../../components/sections/hero-section"
import { ProjectCard } from "../../components/cards/project-card"
import { PROJECTS } from "../../constants/data"

export function ProjectsTab() {
  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSection
          title="Project Management"
          description="Organize your creative work into projects and collaborate with your team."
          primaryButtonText="New Project"
          gradient="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600"
        >
          <Plus className="mr-2 h-4 w-4" />
        </HeroSection>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" className="rounded-2xl">
          <Layers className="mr-2 h-4 w-4" />
          All Projects
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <Clock className="mr-2 h-4 w-4" />
          Recent
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <Users className="mr-2 h-4 w-4" />
          Shared
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <Archive className="mr-2 h-4 w-4" />
          Archived
        </Button>
        <div className="flex-1"></div>
        <div className="relative w-full md:w-auto mt-3 md:mt-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects..." className="w-full rounded-2xl pl-9 md:w-[200px]" />
        </div>
      </div>

      {/* Active Projects */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Projects</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
          <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
            <Card className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed p-8 hover:border-primary/50 transition-all duration-300">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Create New Project</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Start a new creative project from scratch or use a template
              </p>
              <Button className="rounded-2xl">New Project</Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Project Templates */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Project Templates</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              title: "Brand Identity",
              description: "Complete brand design package",
              gradient: "from-blue-500 to-purple-600",
              badge: "Popular",
            },
            {
              title: "Marketing Campaign",
              description: "Multi-channel marketing assets",
              gradient: "from-amber-500 to-red-600",
              badge: "New",
            },
            {
              title: "Website Redesign",
              description: "Complete website design workflow",
              gradient: "from-green-500 to-teal-600",
              badge: "Featured",
            },
            {
              title: "Product Launch",
              description: "Product launch campaign assets",
              gradient: "from-pink-500 to-rose-600",
              badge: "Popular",
            },
          ].map((template) => (
            <Card key={template.title} className="overflow-hidden rounded-3xl">
              <div className={`aspect-video bg-gradient-to-br ${template.gradient} p-6 text-white`}>
                <h3 className="text-lg font-medium">{template.title}</h3>
                <p className="text-sm text-white/80">{template.description}</p>
              </div>
              <CardFooter className="flex justify-between p-4">
                <Badge variant="outline" className="rounded-xl">
                  {template.badge}
                </Badge>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
