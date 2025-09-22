"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 shrink-0">
      <SidebarTrigger />

      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 pr-4 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </header>
  )
}