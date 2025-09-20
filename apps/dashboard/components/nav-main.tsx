"use client"

import type React from "react"

import {
  ChevronRight,
  Plus,
  GripVertical,
  Pencil,
  Save,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@dassh/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@dassh/ui/components/sidebar"
import { Button } from "@dassh/ui/components/button"

export function NavMain({
  items,
  onAddSection,
  onAddBoard,
  onReorderSections,
  onReorderBoards,
  onMoveBoardBetweenSections,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  onAddSection?: () => void
  onAddBoard?: (sectionTitle: string) => void
  onReorderSections?: (fromIndex: number, toIndex: number) => void
  onReorderBoards?: (sectionTitle: string, fromIndex: number, toIndex: number) => void
  onMoveBoardBetweenSections?: (fromSection: string, toSection: string, boardIndex: number, targetIndex: number) => void
}) {
  const [moveMode, setMoveMode] = useState(false)
  const [draggedSection, setDraggedSection] = useState<number | null>(null)
  const [draggedBoard, setDraggedBoard] = useState<{ sectionTitle: string; boardIndex: number } | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{
    type: "section" | "board" | "cross-section"
    index: number
    sectionTitle?: string
  } | null>(null)

  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    if (!moveMode) return
    setDraggedSection(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    if (!moveMode) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedSection !== null && draggedSection !== index) {
      setDropIndicator({ type: "section", index })
    }
  }

  const handleSectionDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!moveMode) return
    e.preventDefault()
    if (draggedSection !== null && draggedSection !== dropIndex && onReorderSections) {
      onReorderSections(draggedSection, dropIndex)
    }
    setDraggedSection(null)
    setDropIndicator(null)
  }

  const handleBoardDragStart = (e: React.DragEvent, sectionTitle: string, boardIndex: number) => {
    if (!moveMode) return
    setDraggedBoard({ sectionTitle, boardIndex })
    e.dataTransfer.effectAllowed = "move"
    e.stopPropagation()
  }

  const handleBoardDragOver = (e: React.DragEvent, sectionTitle: string, boardIndex: number) => {
    if (!moveMode) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    e.stopPropagation()

    if (draggedBoard) {
      if (draggedBoard.sectionTitle === sectionTitle) {
        // Same section reordering
        if (draggedBoard.boardIndex !== boardIndex) {
          setDropIndicator({ type: "board", index: boardIndex, sectionTitle })
        }
      } else {
        // Cross-section move
        setDropIndicator({ type: "cross-section", index: boardIndex, sectionTitle })
      }
    }
  }

  const handleBoardDrop = (e: React.DragEvent, sectionTitle: string, dropIndex: number) => {
    if (!moveMode) return
    e.preventDefault()
    e.stopPropagation()

    if (draggedBoard) {
      if (draggedBoard.sectionTitle === sectionTitle && draggedBoard.boardIndex !== dropIndex && onReorderBoards) {
        // Same section reordering
        onReorderBoards(sectionTitle, draggedBoard.boardIndex, dropIndex)
      } else if (draggedBoard.sectionTitle !== sectionTitle && onMoveBoardBetweenSections) {
        // Cross-section move
        onMoveBoardBetweenSections(draggedBoard.sectionTitle, sectionTitle, draggedBoard.boardIndex, dropIndex)
      }
    }
    setDraggedBoard(null)
    setDropIndicator(null)
  }

  const moveSectionUp = (index: number) => {
    if (index > 0 && onReorderSections) {
      onReorderSections(index, index - 1)
    }
  }

  const moveSectionDown = (index: number) => {
    if (index < items.length - 1 && onReorderSections) {
      onReorderSections(index, index + 1)
    }
  }

  const moveBoardUp = (sectionTitle: string, boardIndex: number) => {
    if (boardIndex > 0 && onReorderBoards) {
      onReorderBoards(sectionTitle, boardIndex, boardIndex - 1)
    }
  }

  const moveBoardDown = (sectionTitle: string, boardIndex: number) => {
    const section = items.find((item) => item.title === sectionTitle)
    if (section && section.items && boardIndex < section.items.length - 1 && onReorderBoards) {
      onReorderBoards(sectionTitle, boardIndex, boardIndex + 1)
    }
  }

  const moveBoardToPreviousSection = (currentSectionTitle: string, boardIndex: number) => {
    const currentSectionIndex = items.findIndex((item) => item.title === currentSectionTitle)
    if (currentSectionIndex > 0 && onMoveBoardBetweenSections) {
      const targetSection = items[currentSectionIndex - 1]
      const targetIndex = targetSection.items?.length || 0
      onMoveBoardBetweenSections(currentSectionTitle, targetSection.title, boardIndex, targetIndex)
    }
  }

  const moveBoardToNextSection = (currentSectionTitle: string, boardIndex: number) => {
    const currentSectionIndex = items.findIndex((item) => item.title === currentSectionTitle)
    if (currentSectionIndex < items.length - 1 && onMoveBoardBetweenSections) {
      const targetSection = items[currentSectionIndex + 1]
      onMoveBoardBetweenSections(currentSectionTitle, targetSection.title, boardIndex, 0)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        Boards
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMoveMode(!moveMode)}
            className={`h-6 w-6 p-0 ${moveMode ? "bg-sidebar-accent" : ""}`}
            title={moveMode ? "Save changes" : "Edit boards"}
          >
            {moveMode ? <Save className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
          </Button>
          {onAddSection && moveMode && (
            <button
              onClick={onAddSection}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-sidebar-accent rounded"
              title="Add new section"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <div key={item.title} className="relative">
            {dropIndicator?.type === "section" && dropIndicator.index === index && (
              <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
            )}
            <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem
                draggable={moveMode}
                onDragStart={(e) => handleSectionDragStart(e, index)}
                onDragOver={(e) => handleSectionDragOver(e, index)}
                onDrop={(e) => handleSectionDrop(e, index)}
                onDragLeave={() => setDropIndicator(null)}
                className={`${draggedSection === index ? "opacity-50" : ""} transition-opacity`}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="group">
                    {moveMode && (
                      <div className="flex items-center gap-1 mr-1">
                        <GripVertical className="h-4 w-4 opacity-50 cursor-grab active:cursor-grabbing" />
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSectionUp(index)
                            }}
                            disabled={index === 0}
                            className="h-3 w-3 p-0"
                          >
                            <ArrowUp className="h-2 w-2" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveSectionDown(index)
                            }}
                            disabled={index === items.length - 1}
                            className="h-3 w-3 p-0"
                          >
                            <ArrowDown className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    {onAddBoard && moveMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddBoard(item.title)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-sidebar-accent rounded ml-1"
                        title="Add new board"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem, boardIndex) => (
                      <div key={subItem.title} className="relative">
                        {dropIndicator?.type === "board" &&
                          dropIndicator.index === boardIndex &&
                          dropIndicator.sectionTitle === item.title && (
                            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
                          )}
                        {dropIndicator?.type === "cross-section" &&
                          dropIndicator.index === boardIndex &&
                          dropIndicator.sectionTitle === item.title && (
                            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-green-500 rounded-full z-10" />
                          )}
                        <SidebarMenuSubItem
                          draggable={moveMode}
                          onDragStart={(e) => handleBoardDragStart(e, item.title, boardIndex)}
                          onDragOver={(e) => handleBoardDragOver(e, item.title, boardIndex)}
                          onDrop={(e) => handleBoardDrop(e, item.title, boardIndex)}
                          onDragLeave={() => setDropIndicator(null)}
                          className={`${draggedBoard?.sectionTitle === item.title && draggedBoard?.boardIndex === boardIndex ? "opacity-50" : ""} transition-opacity group/board`}
                        >
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url} className="flex items-center">
                              {moveMode && (
                                <div className="flex items-center gap-1 mr-1">
                                  <GripVertical className="h-3 w-3 opacity-50 cursor-grab active:cursor-grabbing" />
                                  <div className="flex items-center gap-0.5">
                                    <div className="flex flex-col">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          moveBoardUp(item.title, boardIndex)
                                        }}
                                        disabled={boardIndex === 0}
                                        className="h-2 w-2 p-0"
                                        title="Move up within section"
                                      >
                                        <ArrowUp className="h-1.5 w-1.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          moveBoardDown(item.title, boardIndex)
                                        }}
                                        disabled={!item.items || boardIndex === item.items.length - 1}
                                        className="h-2 w-2 p-0"
                                        title="Move down within section"
                                      >
                                        <ArrowDown className="h-1.5 w-1.5" />
                                      </Button>
                                    </div>
                                    <div className="flex flex-col">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          moveBoardToPreviousSection(item.title, boardIndex)
                                        }}
                                        disabled={index === 0}
                                        className="h-2 w-2 p-0"
                                        title="Move to previous section"
                                      >
                                        <ArrowLeft className="h-1.5 w-1.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          moveBoardToNextSection(item.title, boardIndex)
                                        }}
                                        disabled={index === items.length - 1}
                                        className="h-2 w-2 p-0"
                                        title="Move to next section"
                                      >
                                        <ArrowRight className="h-1.5 w-1.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </div>
                    ))}
                    {moveMode && (
                      <div
                        className="relative h-4"
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = "move"
                          e.stopPropagation()

                          if (draggedBoard) {
                            const endIndex = item.items?.length || 0
                            if (draggedBoard.sectionTitle === item.title) {
                              // Same section reordering to end
                              if (draggedBoard.boardIndex !== endIndex) {
                                setDropIndicator({ type: "board", index: endIndex, sectionTitle: item.title })
                              }
                            } else {
                              // Cross-section move to end
                              setDropIndicator({ type: "cross-section", index: endIndex, sectionTitle: item.title })
                            }
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()

                          if (draggedBoard) {
                            const endIndex = item.items?.length || 0
                            if (draggedBoard.sectionTitle === item.title && onReorderBoards) {
                              // Same section reordering to end
                              onReorderBoards(item.title, draggedBoard.boardIndex, endIndex)
                            } else if (draggedBoard.sectionTitle !== item.title && onMoveBoardBetweenSections) {
                              // Cross-section move to end
                              onMoveBoardBetweenSections(
                                draggedBoard.sectionTitle,
                                item.title,
                                draggedBoard.boardIndex,
                                endIndex,
                              )
                            }
                          }
                          setDraggedBoard(null)
                          setDropIndicator(null)
                        }}
                        onDragLeave={() => setDropIndicator(null)}
                      >
                        {dropIndicator?.type === "board" &&
                          dropIndicator.index === (item.items?.length || 0) &&
                          dropIndicator.sectionTitle === item.title && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
                          )}
                        {dropIndicator?.type === "cross-section" &&
                          dropIndicator.index === (item.items?.length || 0) &&
                          dropIndicator.sectionTitle === item.title && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 rounded-full z-10" />
                          )}
                      </div>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
