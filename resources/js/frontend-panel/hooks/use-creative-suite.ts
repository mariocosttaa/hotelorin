"use client"

/**
 * Custom hook for managing Creative Suite application state
 */

import { useEffect, useState } from "react"
import type { Notification, Message } from "../types"
import { NOTIFICATIONS, MESSAGES } from "../constants/data"

export function useCreativeSuite() {
  const [progress, setProgress] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)
  const [messages, setMessages] = useState<Message[]>(MESSAGES)
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const markMessageAsRead = (id: string) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, unread: false } : message)))
  }

  const markAllMessagesAsRead = () => {
    setMessages((prev) => prev.map((message) => ({ ...message, unread: false })))
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length
  const unreadMessagesCount = messages.filter((m) => m.unread).length

  return {
    progress,
    notifications,
    messages,
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    expandedItems,
    toggleExpanded,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    markMessageAsRead,
    markAllMessagesAsRead,
    unreadNotificationsCount,
    unreadMessagesCount,
  }
}
