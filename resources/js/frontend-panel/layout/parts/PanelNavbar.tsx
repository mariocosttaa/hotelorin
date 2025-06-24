/**
 * Fixed header with better responsive design
 */


import { useState } from "react"
import { Menu, PanelLeft } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { NotificationsDropdown } from "../../components/dropdowns/notifications-dropdown"
import { MessagesDropdown } from "../../components/dropdowns/messages-dropdown"
import { UserDropdown } from "../../components/dropdowns/user-dropdown"
import { CloudStorageModal } from "../../components/modals/cloud-storage-modal"
import { ProfileModal } from "../../components/modals/profile-modal"
import ThemeToggle from "../../components/ui/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { useDarkMode } from '@/js/shared/context/DarkModeContext'
import '@/css/tailwind.css'
import { useTranslation } from 'react-i18next'
import { router, usePage } from "@inertiajs/react"
import { routeLang } from "@/js/shared/helpers/routeLang"
import { InertiaMiddlewareProps } from "@/js/shared/types/Inertia-middleware-prop"


interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function PanelNavbar({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const { isDarkMode, toggleTheme } = useDarkMode()
  const [cloudStorageOpen, setCloudStorageOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { t: __ } = useTranslation(['menu', 'static-text'])
  const { auth, tenant } = usePage<InertiaMiddlewareProps>().props;

  const panelRoute = routeLang('panel-index');

  const goBack = () => {
    router.get(panelRoute);
  }

  return (
    <>
      <header className="sticky top-4 z-40 mx-4">
        <div className="flex h-16 items-center gap-2 sm:gap-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl px-4 sm:px-6 shadow-lg shadow-black/5 dark:shadow-black/20">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl hover:bg-muted/50 flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:flex rounded-xl hover:bg-muted/50 transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center justify-between min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#e2af04] truncate">
                <span className="hidden sm:inline">{ tenant.name }</span>
                <span className="sm:hidden">{__('Hotelon', { ns: 'static-text' })}</span>
              </h1>
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">{__('Online', { ns: 'static-text' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Cloud Storage Button - Hidden on small screens */}
              <div className="hidden sm:block">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-muted/50 transition-colors"
                        onClick={() => setCloudStorageOpen(true)}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cloud Storage</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Messages Dropdown - Always visible */}
              <div>
                <MessagesDropdown />
              </div>

              {/* Notifications Dropdown */}
              <NotificationsDropdown />

              {/* User Profile Dropdown */}
              <UserDropdown
                theme={isDarkMode ? "dark" : "light"}
                setTheme={toggleTheme}
                onOpenProfile={() => setProfileOpen(true)}
                onOpenSettings={() => console.log("Open settings")}
                onSignOut={goBack}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <CloudStorageModal open={cloudStorageOpen} onOpenChange={setCloudStorageOpen} />
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
