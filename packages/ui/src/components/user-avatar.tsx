"use client"

import * as React from "react"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { cn } from "../lib/utils"
import { UserIcon } from "lucide-react"

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  showFallback?: boolean
  fallbackIcon?: React.ReactNode
  user?: {
    picture?: string | null
    given_name?: string | null
    family_name?: string | null
    email?: string | null
  } | null
}

/**
 * UserAvatar - User profile avatar component with automatic state management
 * 
 * Features:
 * - Automatic user detection from Kinde auth
 * - Profile picture with intelligent fallbacks
 * - Initials generation from name
 * - Accessible design with proper ARIA labels
 * - Multiple size variants
 * - shadcn/ui Avatar styling
 */
const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  (
    {
      size = "md",
      showFallback = true,
      fallbackIcon,
      user: propUser,
      className,
      ...props
    },
    ref
  ) => {
    const { user: kindeUser } = useKindeAuth()
    
    // Use provided user prop or fall back to Kinde user
    const user = propUser || kindeUser

    const sizeClasses = {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm", 
      lg: "h-10 w-10 text-base",
      xl: "h-12 w-12 text-lg"
    }

    const getInitials = (firstName?: string | null, lastName?: string | null, email?: string | null): string => {
      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      }
      
      if (firstName) {
        return firstName.substring(0, 2).toUpperCase()
      }
      
      if (lastName) {
        return lastName.substring(0, 2).toUpperCase()
      }
      
      if (email) {
        return email.substring(0, 2).toUpperCase()
      }
      
      return "U"
    }

    const getDisplayName = (): string => {
      if (user?.given_name && user?.family_name) {
        return `${user.given_name} ${user.family_name}`
      }
      
      if (user?.given_name) {
        return user.given_name
      }
      
      if (user?.family_name) {
        return user.family_name
      }
      
      if (user?.email) {
        return user.email
      }
      
      return "User"
    }

    const initials = getInitials(user?.given_name, user?.family_name, user?.email)
    const displayName = getDisplayName()
    const profilePicture = user?.picture

    return (
      <Avatar
        ref={ref}
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        {profilePicture && (
          <AvatarImage
            src={profilePicture}
            alt={`${displayName}'s profile picture`}
            className="object-cover"
          />
        )}
        {showFallback && (
          <AvatarFallback
            className="bg-muted font-medium"
            aria-label={`${displayName}'s avatar`}
          >
            {fallbackIcon ? (
              fallbackIcon
            ) : user ? (
              <span aria-hidden="true">{initials}</span>
            ) : (
              <UserIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </AvatarFallback>
        )}
      </Avatar>
    )
  }
)

UserAvatar.displayName = "UserAvatar"

export { UserAvatar }