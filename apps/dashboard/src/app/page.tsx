import Link from "next/link";
import { Button } from "@dassh/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@dassh/ui/components/card";
import { ProfileDropdown } from "@dassh/ui/components/profile-dropdown";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with authentication */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">DASSH</h2>
          </div>
          <ProfileDropdown variant="header" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-24 space-y-12">
        <div className="z-10 w-full max-w-5xl text-center">
          <h1 className="text-6xl font-bold mb-4">DASSH</h1>
          <p className="text-2xl text-muted-foreground mb-8">Constitutional Widget-Based Dashboard Platform</p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                🚀 Open Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                📊 Manage Dashboards
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="w-full max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/widgets" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧩 Widgets
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover widget templates and create your own dashboard components.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/settings" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚙️ Configuration
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Configure your dashboard settings and widget preferences.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/analytics" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Analytics
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View analytics and performance metrics for your widgets.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 Documentation
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn about the constitutional requirements and best practices.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground max-w-2xl">
          <p>
            Built with constitutional compliance, accessibility-first design, and modern web standards. 
            Powered by Next.js 15+, shadcn/ui, and Tailwind CSS.
          </p>
        </div>
      </main>
    </div>
  );
}