/**
 * Messages Dropdown Component
 */


import { MessageSquare, Plus, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Badge } from "../../components/ui/badge"
import { cn } from '../../lib/utils'
import type { Message } from "../../types"

interface MessagesDropdownProps {
  messages?: Message[]
  unreadCount?: number
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
}

export function MessagesDropdown({
  messages = [],
  unreadCount = 0,
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
}: MessagesDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-2xl relative">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Messages</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 h-8" />
          </div>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No messages</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                    message.unread && "bg-blue-50/50",
                  )}
                  onClick={() => onMarkAsRead(message.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{message.sender}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">{message.time}</p>
                        {message.unread && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-1">
          {unreadCount > 0 && <DropdownMenuItem onClick={onMarkAllAsRead}>Mark all as read</DropdownMenuItem>}
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Message Settings
          </DropdownMenuItem>
          <DropdownMenuItem>View All Messages</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
