import { useAuth, UserRole } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Search, FileText, CalendarDays, Upload, Bell, HelpCircle,
  BookOpen, Users, Shield, Settings, BarChart3, Clock, GraduationCap, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: number;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["student", "lecturer", "moderator", "admin"] },
  { title: "Browse Repository", url: "/browse", icon: Search, roles: ["student", "lecturer", "moderator", "admin"] },
  { title: "My Submissions", url: "/my-submissions", icon: FileText, roles: ["student"] },
  { title: "Submit Project", url: "/submit/project", icon: Upload, roles: ["student"] },
  { title: "My Publications", url: "/my-publications", icon: BookOpen, roles: ["lecturer"] },
  { title: "Submit Publication", url: "/submit/publication", icon: Upload, roles: ["lecturer"] },
  { title: "Supervised Students", url: "/supervised", icon: Users, roles: ["lecturer"] },
  { title: "Moderation Queue", url: "/moderation", icon: Shield, badge: 5, roles: ["moderator", "admin"] },
  { title: "User Management", url: "/admin/users", icon: Users, roles: ["admin"] },
  { title: "Reservation Settings", url: "/admin/reservations", icon: CalendarDays, roles: ["admin"] },
  { title: "Access Schedule", url: "/admin/schedule", icon: Clock, roles: ["admin"] },
  { title: "Reports & Audit", url: "/admin/reports", icon: BarChart3, roles: ["admin"] },
  { title: "Settings", url: "/admin/settings", icon: Settings, roles: ["admin"] },
  { title: "My Reservations", url: "/my-reservations", icon: CalendarDays, roles: ["student", "lecturer"] },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 3, roles: ["student", "lecturer", "moderator", "admin"] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  if (!user) return null;

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-heading font-bold text-sm text-foreground leading-tight">AUCA Connect</p>
                <p className="text-xs text-primary font-medium">Publication Hub</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/70"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/help" className="hover:bg-sidebar-accent/70" activeClassName="bg-sidebar-accent">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Help</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {user.avatarInitials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
