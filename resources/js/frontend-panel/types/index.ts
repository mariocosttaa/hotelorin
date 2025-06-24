/**
 * Type definitions for the Creative Suite application
 */

export interface App {
  name: string
  icon: React.JSX.Element
  description: string
  category: string
  recent: boolean
  new: boolean
  progress: number
}

export interface RecentFile {
  name: string
  app: string
  modified: string
  icon: React.JSX.Element
  shared: boolean
  size: string
  collaborators: number
}

export interface Project {
  name: string
  description: string
  progress: number
  dueDate: string
  members: number
  files: number
}

export interface Tutorial {
  title: string
  description: string
  duration: string
  level: string
  instructor: string
  category: string
  views: string
}

export interface CommunityPost {
  title: string
  author: string
  likes: number
  comments: number
  image: string
  time: string
}

export interface SidebarItem {
  key: string
  title: string
  icon: React.JSX.Element
  url?: string
  items?: {
    title: string
    url: string
    key: string
  }[]
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  icon?: React.JSX.Element
}

export interface Message {
  id: string
  sender: string
  avatar: string
  message: string
  time: string
  unread: boolean
}

export interface CloudStorage {
  used: number
  total: number
  files: number
  lastSync: string
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  plan: string
  joinDate: string
}
