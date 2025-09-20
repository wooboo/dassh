"use client"

import * as React from "react"
import { AudioWaveform, BookOpen, Bot, Command, GalleryVerticalEnd, SquareTerminal } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { IconSelector } from "@/components/icon-selector"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@dassh/ui/components/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
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
