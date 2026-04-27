import { useAuth, UserRole } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Search, FileText, CalendarDays, Upload, Bell, HelpCircle,
  BookOpen, Users, Shield, Settings, BarChart3, Clock, LogOut, ClipboardList,
  FileCheck, GraduationCap, FolderOpen, Stamp, UserCheck, FileUp,
  ClipboardCheck, CalendarClock, Armchair, ListChecks, ScrollText,
  FileSearch, FileScan, BookMarked, Briefcase, Kanban, Award, TrendingUp, PenTool, BookType
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: number;
  roles: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Sidebar structure organized by OFFICE / WORKFLOW
 * Each group maps to a distinct office in the university hierarchy.
 */
const navGroups: NavGroup[] = [
  /* ─── Shared Overview ─── */
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["student", "lecturer", "hod", "moderator", "admin"] },
      { title: "Browse Archive", url: "/browse", icon: Search, roles: ["student", "lecturer", "hod", "moderator", "admin"] },
    ],
  },

  /* ─── Student Office ─── */
  {
    label: "Student Records",
    items: [
      { title: "My Documents", url: "/my-documents", icon: FolderOpen, roles: ["student"] },
      { title: "My Submissions", url: "/my-submissions", icon: FileText, roles: ["student"] },
      { title: "Submit Project", url: "/submit/project", icon: Upload, roles: ["student"] },
      { title: "Upload Document", url: "/submit/document", icon: FileUp, roles: ["student"] },
      { title: "Attendance", url: "/my-attendance", icon: ClipboardCheck, roles: ["student"] },
      { title: "My Reservations", url: "/my-reservations", icon: CalendarDays, roles: ["student"] },
    ],
  },

  /* ─── Lecturer Office ─── */
  {
    label: "Lecturer Office",
    items: [
      { title: "Course Materials", url: "/course-materials", icon: BookType, roles: ["lecturer"] },
      { title: "Teaching Log", url: "/teaching-log", icon: ClipboardList, roles: ["lecturer"] },
      { title: "Attendance Mgmt", url: "/attendance-management", icon: UserCheck, roles: ["lecturer"] },
      { title: "Marks Entry", url: "/marks-entry", icon: PenTool, roles: ["lecturer"] },
      { title: "Exam Upload", url: "/exam-upload", icon: FileUp, roles: ["lecturer"] },
      { title: "Supervised Students", url: "/supervised", icon: GraduationCap, roles: ["lecturer"] },
      { title: "My Publications", url: "/my-publications", icon: BookOpen, roles: ["lecturer"] },
    ],
  },

  /* ─── Head of Department ─── */
  {
    label: "HOD Office",
    items: [
      { title: "Curriculum Mgmt", url: "/hod/curriculum", icon: BookType, roles: ["hod"] },
      { title: "Teaching Progress", url: "/hod/teaching-progress", icon: TrendingUp, roles: ["hod"] },
      { title: "Exam Validation", url: "/hod/exam-review", icon: FileCheck, roles: ["hod"] },
      { title: "Marks Moderation", url: "/hod/marks-moderation", icon: ScrollText, roles: ["hod"] },
      { title: "Project Supervision", url: "/hod/projects", icon: Kanban, roles: ["hod"] },
      { title: "Internships", url: "/hod/internships", icon: Briefcase, roles: ["hod"] },
      { title: "Graduation Lists", url: "/hod/graduations", icon: Award, roles: ["hod"] },
      { title: "Dept. Reports", url: "/hod/reports", icon: BarChart3, roles: ["hod"] },
      { title: "Eligibility Lists", url: "/hod/eligibility", icon: ListChecks, roles: ["hod"] },
    ],
  },

  /* ─── Examination Office ─── */
  {
    label: "Exam Office",
    items: [
      { title: "Exam Timetable", url: "/exam-office/timetable", icon: CalendarClock, roles: ["hod", "admin"] },
      { title: "Seating Plan", url: "/exam-office/seating", icon: Armchair, roles: ["hod", "admin"] },
      { title: "Eligibility Lists", url: "/exam-office/eligibility", icon: ListChecks, roles: ["admin"] },
      { title: "Marks Validation", url: "/exam-office/marks", icon: FileCheck, roles: ["admin"] },
    ],
  },

  /* ─── Moderator / Library ─── */
  {
    label: "Library / Moderation",
    items: [
      { title: "Moderation Queue", url: "/moderation", icon: Shield, badge: 5, roles: ["moderator", "admin"] },
      { title: "Doc Verification", url: "/document-verification", icon: FileScan, roles: ["moderator", "admin"] },
      { title: "Published Archive", url: "/browse", icon: BookMarked, roles: ["moderator"] },
    ],
  },

  /* ─── Admin ─── */
  {
    label: "Administration",
    items: [
      { title: "User Management", url: "/admin/users", icon: Users, roles: ["admin"] },
      { title: "Reports & Audit", url: "/admin/reports", icon: BarChart3, roles: ["admin"] },
      { title: "System Settings", url: "/admin/settings", icon: Settings, roles: ["admin"] },
    ],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  if (!user) return null;

  const linkBase =
    "group relative z-10 flex w-full items-center rounded-lg border border-transparent px-3 py-2 text-[13px] font-medium text-muted-foreground transition-all hover:border-primary/15 hover:bg-accent/60 hover:text-foreground";
  const linkActive =
    "border-primary/25 bg-card text-foreground shadow-sm shadow-primary/10";

  return (
    <Sidebar collapsible="icon" className="z-10 border-r border-border bg-card/90 font-body backdrop-blur-sm">
      <SidebarContent className="bg-transparent">
        {/* Brand header */}
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              <img src="/auca-logo.png" alt="AUCA" className="h-7 w-7 object-contain" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-[15px] font-semibold leading-tight tracking-tight text-foreground">AUCA Connect</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">Student Archive System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation groups */}
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(user.role));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label} className="mb-0.5 bg-transparent">
              <SidebarGroupLabel className="mt-3 px-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-0.5 space-y-0.5 px-3">
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.url + item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/dashboard"}
                          className={linkBase}
                          activeClassName={linkActive}
                        >
                          <item.icon className="mr-3 h-4 w-4 shrink-0 text-primary" />
                          {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                          {!collapsed && item.badge && (
                            <div className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                              {item.badge}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        {/* Bottom utilities */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="mb-2 px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/notifications" className={linkBase} activeClassName={linkActive}>
                    <Bell className="mr-3 h-4 w-4 shrink-0 text-primary" />
                    {!collapsed && <span className="flex-1 truncate">Notifications</span>}
                    {!collapsed && (
                      <div className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                        3
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/help" className={linkBase} activeClassName={linkActive}>
                    <HelpCircle className="mr-3 h-4 w-4 shrink-0 text-primary" />
                    {!collapsed && <span className="truncate">Help</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="border-t border-border bg-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border-2 border-border bg-muted/30 text-[13px] font-semibold text-foreground">
            {user.avatarInitials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">{user.name}</p>
              <p className="text-[11px] font-medium capitalize text-muted-foreground">
                {user.role === "hod" ? "Head of Dept." : user.role === "moderator" ? "Librarian" : user.role}
              </p>
            </div>
          )}
          {!collapsed && (
            <button type="button" onClick={logout} className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
