import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AcademIQButton } from "@/components/AcademIQ/AcademIQButton";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card px-4 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, publications, authors..."
                  className="pl-9 h-9 bg-background border-border"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 text-[10px] p-0 flex items-center justify-center">
                  3
                </Badge>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                {user?.avatarInitials}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-card px-6 py-3">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 AUCA Connect Publication Hub — Adventist University of Central Africa | Internal Use Only
            </p>
          </footer>
        </div>

        <AcademIQButton />
      </div>
    </SidebarProvider>
  );
}
