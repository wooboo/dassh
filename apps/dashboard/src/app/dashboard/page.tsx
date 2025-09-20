import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@dassh/ui/components/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@dassh/ui/components/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@dassh/ui/components/sidebar'

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    DASSH
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-900 dark:text-blue-100">Analytics</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">System metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">1,234</div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-900 dark:text-green-100">Active Users</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">Currently online</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">89</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5 new today</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-900 dark:text-purple-100">Widgets</CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">Total components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">15</div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">3 created this week</p>
              </CardContent>
            </Card>
          </div>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Welcome to DASSH Dashboard</CardTitle>
              <CardDescription>Your constitutional widget-based dashboard platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border">
                      🎯 Create New Widget
                    </button>
                    <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border">
                      📊 Manage Dashboard Layout
                    </button>
                    <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border">
                      📈 View Analytics
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 rounded-lg bg-muted/30 border">
                      <span className="font-medium">Analytics widget</span> updated
                      <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border">
                      <span className="font-medium">New user dashboard</span> created
                      <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border">
                      <span className="font-medium">System performance</span> optimized
                      <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
