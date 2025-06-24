/**
 * Notifications Dropdown Component
 */

import { Bell, CheckCheck, Settings } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Badge } from "../../components/ui/badge"
import { cn } from '../../lib/utils'
import type { Notification } from "../../types"

interface NotificationsDropdownProps {
  notifications?: Notification[]
  unreadCount?: number
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
}

export function NotificationsDropdown({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
}: NotificationsDropdownProps) {
  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500"
      case "warning":
        return "text-orange-500"
      case "error":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-2xl relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs">
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                    !notification.read && "bg-blue-50/50",
                  )}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className={cn("mt-0.5", getNotificationColor(notification.type))}>{notification.icon}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <DropdownMenuItem className="w-full justify-center">
            <Settings className="mr-2 h-4 w-4" />
            Notification Settings
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
