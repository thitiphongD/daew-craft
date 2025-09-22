"use client"

import {
  Code2,
  Type,
  Braces,
  Link as LinkIcon,
  FileText
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Snippet",
    url: "/snippets",
    icon: Code2,
  },
  {
    title: "Text Transform",
    url: "/text",
    icon: Type,
  },
  {
    title: "JSON Formatter",
    url: "/json-formatter",
    icon: Braces,
  },
  {
    title: "URL Encoder/Decoder",
    url: "/url-encoder-decoder",
    icon: LinkIcon,
  },
  {
    title: "Base64 Encoder/Decoder",
    url: "/base64-encoder-decoder",
    icon: FileText,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-blue-500" />
          <Link className="text-xl font-bold gradient-text" href="/">DaewCraft</Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium  ml-1 transition-colors">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}