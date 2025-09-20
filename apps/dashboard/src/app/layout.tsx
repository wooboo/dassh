import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"
import "@dassh/ui/globals.css"
import { Providers } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Dassh Dashboard",
  description: "Constitutional widget-based dashboard application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}