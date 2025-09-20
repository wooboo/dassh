"use client"

import { ProfileDropdown } from "@dassh/ui/components/profile-dropdown"
import {
  SidebarMenu,
  SidebarMenuItem,
} from '@dassh/ui/components/sidebar'

/**
 * NavUser Component
 * 
 * Displays the user profile dropdown in the sidebar using the ProfileDropdown widget
 * with Kinde authentication integration.
 */

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ProfileDropdown variant="sidebar" />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
