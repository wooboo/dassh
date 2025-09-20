"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Command,
  FileText,
  Folder,
  GalleryVerticalEnd,
  Home,
  Inbox,
  MessageSquare,
  Search,
  Settings,
  SquareTerminal,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@dassh/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dassh/ui/components/dialog"
import { Input } from "@dassh/ui/components/input"
import { Label } from "@dassh/ui/components/label"

const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: "Terminal", icon: SquareTerminal },
  { name: "Bot", icon: Bot },
  { name: "Book", icon: BookOpen },
  { name: "Audio", icon: AudioWaveform },
  { name: "Command", icon: Command },
  { name: "Gallery", icon: GalleryVerticalEnd },
  { name: "Home", icon: Home },
  { name: "Calendar", icon: Calendar },
  { name: "FileText", icon: FileText },
  { name: "Folder", icon: Folder },
  { name: "Inbox", icon: Inbox },
  { name: "Message", icon: MessageSquare },
  { name: "Search", icon: Search },
  { name: "Settings", icon: Settings },
  { name: "Star", icon: Star },
  { name: "Users", icon: Users },
]

interface IconSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string, icon: LucideIcon) => void
}

export function IconSelector({ open, onOpenChange, onConfirm }: IconSelectorProps) {
  const [sectionName, setSectionName] = React.useState("")
  const [selectedIcon, setSelectedIcon] = React.useState<LucideIcon>(SquareTerminal)

  const handleConfirm = () => {
    if (sectionName.trim()) {
      onConfirm(sectionName.trim(), selectedIcon)
      setSectionName("")
      setSelectedIcon(SquareTerminal)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSectionName("")
    setSelectedIcon(SquareTerminal)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>Choose a name and icon for your new section.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">Section Name</Label>
            <Input
              id="section-name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Enter section name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm()
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Select Icon</Label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {availableIcons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setSelectedIcon(Icon)}
                  className={`p-3 rounded-md border-2 transition-colors hover:bg-accent ${
                    selectedIcon === Icon ? "border-primary bg-accent" : "border-border"
                  }`}
                  title={name}
                >
                  <Icon className="h-5 w-5 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!sectionName.trim()}>
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
