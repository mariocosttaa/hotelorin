/**
 * Files tab content component
 */



import { ArrowUpDown, Clock, Cloud, FileText, PanelLeft, Plus, Search, Star, Trash, Users } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { HeroSection } from "../../components/sections/hero-section"
import { FileCard } from "../../components/cards/file-card"
import { RECENT_FILES } from "../../constants/data"

export function FilesTab() {
  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSection
          title="Your Creative Files"
          description="Access, manage, and share all your design files in one place."
          primaryButtonText="Upload Files"
          secondaryButtonText="Cloud Storage"
          gradient="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600"
        >
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30">
              <Cloud className="mr-2 h-4 w-4" />
              Cloud Storage
            </Button>
            <Button className="rounded-2xl bg-white text-blue-700 hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </HeroSection>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" className="rounded-2xl">
          <FileText className="mr-2 h-4 w-4" />
          All Files
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
          <Star className="mr-2 h-4 w-4" />
          Favorites
        </Button>
        <Button variant="outline" className="rounded-2xl">
          <Trash className="mr-2 h-4 w-4" />
          Trash
        </Button>
        <div className="flex-1"></div>
        <div className="relative w-full md:w-auto mt-3 md:mt-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search files..." className="w-full rounded-2xl pl-9 md:w-[200px]" />
        </div>
      </div>

      {/* Files List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Files</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-2xl">
              <PanelLeft className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="rounded-2xl">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border overflow-hidden">
          <div className="bg-muted/50 p-3 hidden md:grid md:grid-cols-12 text-sm font-medium">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">App</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Modified</div>
          </div>
          <div className="divide-y">
            {RECENT_FILES.map((file) => (
              <FileCard key={file.name} file={file} variant="list" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
