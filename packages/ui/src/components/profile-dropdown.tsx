"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { User, Settings, LogOut, LogIn, UserPlus } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * ProfileDropdown Widget Component
 * 
 * A reusable authentication dropdown widget that can be placed in different locations:
 * - Dashboard sidebar (bottom-left)
 * - Main page header (top-right)
 * 
 * Features:
 * - Displays user avatar and name when authenticated
 * - Shows login/signup options when not authenticated
 * - Provides access to profile settings and logout
 * - Responsive design for both placements
 * - WCAG 2.1 AA compliant accessibility
 */

interface ProfileDropdownProps {
  /**
   * Placement variant for different locations
   * - "sidebar": For dashboard sidebar (bottom-left)
   * - "header": For main page header (top-right)
   */
  variant?: "sidebar" | "header";
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to show full profile info or just avatar
   */
  compact?: boolean;
}

export function ProfileDropdown({ 
  variant = "header", 
  className,
  compact = false 
}: ProfileDropdownProps) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  
  // Loading state
  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center gap-2",
        variant === "sidebar" && "w-full p-2",
        className
      )}>
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        {!compact && (
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        )}
      </div>
    );
  }
  
  // Not authenticated - show login/signup options
  if (!isAuthenticated) {
    return (
      <div className={cn(
        "flex items-center gap-2",
        variant === "sidebar" && "w-full",
        className
      )}>
        {variant === "header" ? (
          // Header variant - compact buttons
          <div className="flex items-center gap-1">
            <LoginLink>
              <Button variant="ghost" size="sm" className="h-8">
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            </LoginLink>
            <RegisterLink>
              <Button size="sm" className="h-8">
                <UserPlus className="h-4 w-4 mr-1" />
                Sign Up
              </Button>
            </RegisterLink>
          </div>
        ) : (
          // Sidebar variant - full-width buttons
          <div className="w-full space-y-1">
            <LoginLink className="w-full">
              <Button variant="ghost" className="w-full justify-start">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </LoginLink>
            <RegisterLink className="w-full">
              <Button className="w-full justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </RegisterLink>
          </div>
        )}
      </div>
    );
  }
  
  // Authenticated - show profile dropdown
  const userDisplayName = user?.given_name || user?.email || "User";
  const userInitials = userDisplayName
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto p-2",
            variant === "sidebar" && "w-full justify-start",
            variant === "header" && "rounded-full",
            className
          )}
          aria-label={`${userDisplayName} profile menu`}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={`${userDisplayName} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-900 text-sm font-medium">
                  {userInitials}
                </div>
              )}
            </Avatar>
            
            {!compact && (
              <div className="text-left">
                <div className="text-sm font-medium truncate max-w-32">
                  {userDisplayName}
                </div>
                {user?.email && (
                  <div className="text-xs text-gray-500 truncate max-w-32">
                    {user.email}
                  </div>
                )}
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56" 
        align={variant === "header" ? "end" : "start"}
        side={variant === "sidebar" ? "top" : "bottom"}
      >
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{userDisplayName}</div>
          {user?.email && (
            <div className="text-xs text-gray-500">{user.email}</div>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a href="/dashboard/profile" className="cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Profile Settings
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href="/dashboard/preferences" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <LogoutLink className="cursor-pointer w-full">
            <div className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </div>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;