"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@dassh/ui/components/auth-provider"
import { QueryProvider } from "./providers/trpc-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
