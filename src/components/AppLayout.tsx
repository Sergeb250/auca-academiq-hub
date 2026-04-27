import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AcademIQButton } from "@/components/AcademIQ/AcademIQButton";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background font-sans">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/85 px-6 shadow-sm backdrop-blur-xl">
            <SidebarTrigger className="text-muted-foreground transition-colors hover:text-primary" />
            <div className="ml-2 max-w-xl flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects, publications, authors..."
                  className="h-10 rounded-full border-2 border-primary/20 bg-background/80 pl-9 text-sm font-medium text-foreground transition-all focus-visible:border-primary focus-visible:bg-card focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-5">
              <button type="button" className="relative text-muted-foreground transition-colors hover:text-primary">
                <Bell className="h-5 w-5" />
                <div className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
                  3
                </div>
              </button>
              <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5">
                {user?.avatarInitials}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10 flex-1 bg-transparent p-6 md:p-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="z-10 border-t border-border bg-transparent px-8 py-4">
            <p className="text-center text-xs font-medium text-muted-foreground">
              © {new Date().getFullYear()} AUCA Connect Publication Hub • Internal Use Only
            </p>
          </footer>
        </div>

        <AcademIQButton />
      </div>
    </SidebarProvider>
  );
}
