"use client"

import * as React from "react"
import { AudioWaveform, BookOpen, Bot, Command, GalleryVerticalEnd, SquareTerminal } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { IconSelector } from "@/components/icon-selector"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Dashboard Admin",
    email: "admin@dassh.dev",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "DASSH Project",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Development",
      logo: AudioWaveform,
      plan: "Pro",
    },
    {
      name: "Production",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
      ],
    },
    {
      title: "Widgets",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All Widgets",
          url: "/widgets",
        },
        {
          title: "Create Widget",
          url: "/widgets/create",
        },
        {
          title: "Templates",
          url: "/widgets/templates",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Getting Started",
          url: "/docs",
        },
        {
          title: "Widget API",
          url: "/docs/api",
        },
        {
          title: "Examples",
          url: "/docs/examples",
        },
        {
          title: "Changelog",
          url: "/docs/changelog",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = React.useState(data.navMain)
  const [showIconSelector, setShowIconSelector] = React.useState(false)

  const handleAddSection = () => {
    setShowIconSelector(true)
  }

  const handleConfirmSection = (sectionName: string, icon: any) => {
    const newSection = {
      title: sectionName,
      url: "#",
      icon: icon,
      items: [],
    }
    setNavItems([...navItems, newSection])
  }

  const handleAddBoard = (sectionTitle: string) => {
    const boardName = prompt("Enter board name:")
    if (boardName) {
      setNavItems(
        navItems.map((section) =>
          section.title === sectionTitle
            ? {
                ...section,
                items: [...(section.items || []), { title: boardName, url: "#" }],
              }
            : section,
        ),
      )
    }
  }

  const handleReorderSections = (fromIndex: number, toIndex: number) => {
    const newItems = [...navItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    setNavItems(newItems)
  }

  const handleReorderBoards = (sectionTitle: string, fromIndex: number, toIndex: number) => {
    setNavItems(
      navItems.map((section) => {
        if (section.title === sectionTitle && section.items) {
          const newItems = [...section.items]
          const [movedItem] = newItems.splice(fromIndex, 1)
          newItems.splice(toIndex, 0, movedItem)
          return { ...section, items: newItems }
        }
        return section
      }),
    )
  }

  const handleMoveBoardBetweenSections = (
    fromSection: string,
    toSection: string,
    boardIndex: number,
    targetIndex: number,
  ) => {
    const fromSectionIndex = navItems.findIndex((section) => section.title === fromSection)
    const toSectionIndex = navItems.findIndex((section) => section.title === toSection)

    if (fromSectionIndex === -1 || toSectionIndex === -1) return

    const newItems = [...navItems]
    const fromSectionItems = [...(newItems[fromSectionIndex].items || [])]
    const toSectionItems = [...(newItems[toSectionIndex].items || [])]

    // Remove board from source section
    const [movedBoard] = fromSectionItems.splice(boardIndex, 1)

    // Add board to target section
    toSectionItems.splice(targetIndex, 0, movedBoard)

    // Update both sections
    newItems[fromSectionIndex] = { ...newItems[fromSectionIndex], items: fromSectionItems }
    newItems[toSectionIndex] = { ...newItems[toSectionIndex], items: toSectionItems }

    setNavItems(newItems)
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            items={navItems}
            onAddSection={handleAddSection}
            onAddBoard={handleAddBoard}
            onReorderSections={handleReorderSections}
            onReorderBoards={handleReorderBoards}
            onMoveBoardBetweenSections={handleMoveBoardBetweenSections}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <IconSelector open={showIconSelector} onOpenChange={setShowIconSelector} onConfirm={handleConfirmSection} />
    </>
  )
}
