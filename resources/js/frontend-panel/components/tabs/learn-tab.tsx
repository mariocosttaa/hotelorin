/**
 * Learn tab content component
 */



import { Award, BookOpen, Bookmark, Clock, Crown, Eye, Lightbulb, Play, Search, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Progress } from "../../components/ui/progress"
import { HeroSection } from "../../components/sections/hero-section"
import { TUTORIALS } from "../../constants/data"

export function LearnTab() {
  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSection
          title="Learn & Grow"
          description="Expand your creative skills with tutorials, courses, and resources."
          primaryButtonText="Upgrade to Pro"
          gradient="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"
        >
          <Crown className="mr-2 h-4 w-4" />
        </HeroSection>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" className="rounded-2xl">
          <Play className="mr-2 h-4 w-4" />
          All Tutorials
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <BookOpen className="mr-2 h-4 w-4" />
          Courses
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <Lightbulb className="mr-2 h-4 w-4" />
          Tips & Tricks
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <TrendingUp className="mr-2 h-4 w-4" />
          Trending
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <Bookmark className="mr-2 h-4 w-4" />
          Saved
        </Button>
        <div className="flex-1"></div>
        <div className="relative w-full md:w-auto mt-3 md:mt-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tutorials..." className="w-full rounded-2xl pl-9 md:w-[200px]" />
        </div>
      </div>

      {/* Featured Tutorials */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Featured Tutorials</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TUTORIALS.slice(0, 3).map((tutorial) => (
            <motion.div key={tutorial.title} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
              <Card className="overflow-hidden rounded-3xl">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="icon" variant="secondary" className="h-14 w-14 rounded-full">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">{tutorial.category}</Badge>
                    <h3 className="mt-2 text-lg font-medium">{tutorial.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{tutorial.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{tutorial.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {tutorial.duration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <Badge variant="outline" className="rounded-xl">
                    {tutorial.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {tutorial.views} views
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Courses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Popular Courses</h2>
          <Button variant="ghost" className="rounded-2xl">
            View All
          </Button>
        </div>
        <div className="rounded-3xl border overflow-hidden">
          <div className="divide-y">
            {TUTORIALS.slice(3, 5).map((tutorial) => (
              <motion.div
                key={tutorial.title}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 flex flex-col md:flex-row gap-3"
              >
                <div className="flex-shrink-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="rounded-xl">
                      {tutorial.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {tutorial.duration}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {tutorial.views} views
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    Watch Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Learning Paths</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            {
              title: "UI/UX Design Fundamentals",
              description: "Master the basics of user interface and experience design",
              level: "Beginner",
              courses: 8,
              hours: 24,
              rating: 4.8,
              progress: 30,
              color: "bg-blue-500",
            },
            {
              title: "Digital Illustration Mastery",
              description: "Create stunning digital artwork and illustrations",
              level: "Intermediate",
              courses: 12,
              hours: 36,
              rating: 4.9,
              progress: 0,
              color: "bg-amber-500",
            },
            {
              title: "Motion Graphics & Animation",
              description: "Create professional motion graphics and animations",
              level: "Advanced",
              courses: 10,
              hours: 30,
              rating: 4.7,
              progress: 0,
              color: "bg-red-500",
            },
          ].map((path) => (
            <Card
              key={path.title}
              className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={`rounded-xl ${path.color}`}>{path.level}</Badge>
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="mt-2">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {path.courses} courses • {path.hours} hours
                    </span>
                    <span>{path.rating} ★</span>
                  </div>
                  <Progress value={path.progress} className="h-2 rounded-xl" />
                  <p className="text-xs text-muted-foreground">
                    {path.progress > 0 ? `${path.progress}% completed` : "Not started"}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full rounded-2xl">
                  {path.progress > 0 ? "Continue Learning" : "Start Learning"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
