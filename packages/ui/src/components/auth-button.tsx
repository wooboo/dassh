"use client"

import * as React from "react"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Button } from "./button"
import { cn } from "../lib/utils"
import { LoaderIcon, LogInIcon, LogOutIcon } from "lucide-react"

export interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  loadingText?: string
  signInText?: string
  signOutText?: string
}

/**
 * AuthButton - Authentication button component with automatic state management
 * 
 * Features:
 * - Automatic sign-in/sign-out state detection
 * - Loading state handling
 * - Accessible keyboard navigation
 * - Customizable text and icons
 * - shadcn/ui Button styling
 */
const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      showIcon = true,
      loadingText = "Loading...",
      signInText = "Sign In",
      signOutText = "Sign Out",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const { isAuthenticated, isLoading, user } = useKindeAuth()

    const getButtonContent = () => {
      if (isLoading) {
        return (
          <>
            {showIcon && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            {loadingText}
          </>
        )
      }

      if (isAuthenticated) {
        return (
          <>
            {showIcon && <LogOutIcon className="mr-2 h-4 w-4" />}
            {signOutText}
          </>
        )
      }

      return (
        <>
          {showIcon && <LogInIcon className="mr-2 h-4 w-4" />}
          {signInText}
        </>
      )
    }

    const getAriaLabel = () => {
      if (isLoading) {
        return "Authentication in progress"
      }
      
      if (isAuthenticated) {
        return `Sign out ${user?.given_name ? `(${user.given_name})` : ''}`
      }
      
      return "Sign in to your account"
    }

    // Loading state - show disabled button
    if (isLoading) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(className)}
          disabled={true}
          aria-label={getAriaLabel()}
          {...props}
        >
          {getButtonContent()}
        </Button>
      )
    }

    // Authenticated state - show logout button
    if (isAuthenticated) {
      return (
        <LogoutLink>
          <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(className)}
            disabled={disabled}
            aria-label={getAriaLabel()}
            {...props}
          >
            {getButtonContent()}
          </Button>
        </LogoutLink>
      )
    }

    // Unauthenticated state - show login button
    return (
      <LoginLink>
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(className)}
          disabled={disabled}
          aria-label={getAriaLabel()}
          {...props}
        >
          {getButtonContent()}
        </Button>
      </LoginLink>
    )
  }
)

AuthButton.displayName = "AuthButton"

export { AuthButton }