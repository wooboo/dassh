"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { ReactNode } from "react";

/**
 * AuthProvider Component
 * 
 * Wrapper component that provides Kinde authentication context to the entire application.
 * This component manages authentication state using React Context and ensures token refreshing.
 * 
 * Usage:
 * ```tsx
 * import { AuthProvider } from "@/components/auth-provider";
 * 
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <AuthProvider>
 *       <html lang="en">
 *         <body>{children}</body>
 *       </html>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <KindeProvider>
      {children}
    </KindeProvider>
  );
}

export default AuthProvider;