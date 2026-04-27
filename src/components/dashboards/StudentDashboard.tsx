import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceRecords, computeAttendanceSummaries } from "@/data/attendance";
import { academicRecords } from "@/data/academic-records";
import { Activity } from "lucide-react";

/* ─── Mock workflow data ─── */

const recentSubmissions = [
  { title: "Smart Parking System using IoT Sensors", type: "Final Year Project", status: "Published", date: "2025-01-15", reviewer: "Dr. Sarah Mugisha" },
  { title: "Analysis of Mobile Banking Adoption in Rwanda", type: "Research Study", status: "Under Review", date: "2025-02-20", reviewer: "Prof. Agnes Ntamwiza" },
  { title: "AI-Powered Crop Disease Detection App", type: "Final Year Project", status: "Draft", date: "2025-03-10", reviewer: "—" },
  { title: "Blockchain for Land Registry", type: "Final Year Project", status: "Rejected", date: "2024-11-05", reviewer: "Dr. Jean B. Niyonzima" },
];

const upcomingDeadlines = [
  { task: "Final Year Project submission deadline", course: "CS301", date: "Apr 15, 2025", daysLeft: 12 },
  { task: "Clearance form completion", course: "Registrar", date: "Apr 20, 2025", daysLeft: 17 },
  { task: "Library fine payment", course: "Library", date: "Apr 10, 2025", daysLeft: 7 },
  { task: "Internship report submission", course: "IT201", date: "Apr 25, 2025", daysLeft: 22 },
];

const recentNotifications = [
  { message: "Your transcript has been verified by the registrar office", time: "2 hours ago", type: "success" as const },
  { message: "Clearance form is missing library stamp — please resubmit", time: "1 day ago", type: "warning" as const },
  { message: "CS301 attendance dropped below 80% — you are at risk", time: "2 days ago", type: "danger" as const },
  { message: "Internship logbook approved by supervisor", time: "3 days ago", type: "success" as const },
  { message: "New exam timetable published for May 2025", time: "5 days ago", type: "info" as const },
];

const statusStyle: Record<string, string> = {
  Published: "bg-emerald-500/10 text-emerald-700 border-emerald-400/30",
  "Under Review": "bg-primary/10 text-primary border-primary/30",
  Draft: "bg-muted text-muted-foreground border-border",
  Rejected: "bg-red-500/10 text-red-700 border-red-400/30",
};

const notifStyle: Record<string, string> = {
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  danger: "border-l-red-500",
  info: "border-l-sky-500",
};

function greetingForHour(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name.split(" ")[0] ?? "there";
  const hour = typeof window !== "undefined" ? new Date().getHours() : 12;
  const greeting = greetingForHour(hour);
  const yearLine =
    user?.year && /^year\s+/i.test(user.year.trim())
      ? user.year
      : user?.year
        ? `Year ${user.year}`
        : null;

  // Attendance data
  const summaries = computeAttendanceSummaries(attendanceRecords, user?.id ?? "");
  const overallPct = summaries.length > 0
    ? Math.round(summaries.reduce((s, c) => s + c.attendancePct, 0) / summaries.length)
    : 0;
  const atRiskCourses = summaries.filter((s) => !s.eligible);

  // Academic records
  const myRecords = academicRecords.filter((r) => r.studentId === (user?.id ?? ""));
  const verifiedDocs = myRecords.filter((r) => r.status === "verified").length;
  const pendingDocs = myRecords.filter((r) => r.status === "pending_verification").length;
  const rejectedDocs = myRecords.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* ── Greeting bar with avatar and role context ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary to-primary/85 text-base font-semibold text-primary-foreground shadow-md"
            aria-hidden
          >
            {user?.avatarInitials}
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">
              {greeting}, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.department}{yearLine ? ` · ${yearLine}` : ""} · {user?.campusId}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="hidden sm:flex text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full items-center font-medium border border-emerald-200 mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Sync Active
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/submit/document")}>
            Upload Document
          </Button>
          <Button size="sm" onClick={() => navigate("/submit/project")}>
            Submit Project
          </Button>
        </div>
      </div>

       <div className="bg-blue-50/50 text-blue-800 text-sm p-4 rounded-xl border border-blue-100 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        <span>Insights are hidden for a cleaner view. Click <span className="font-semibold cursor-pointer hover:underline text-primary">Show Insights</span> whenever you want to review them.</span>
      </div>

      {/* ── Row 1: Document status + Attendance overview + Deadlines ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Document verification status */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Document Verification</CardTitle>
              <button
                type="button"
                className="text-[11px] font-semibold uppercase tracking-widest text-primary hover:text-foreground"
                onClick={() => navigate("/my-documents")}
              >
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overall progress</span>
                <span className="font-semibold text-foreground">
                  {verifiedDocs} of {myRecords.length} verified
                </span>
              </div>
              <Progress value={myRecords.length > 0 ? (verifiedDocs / myRecords.length) * 100 : 0} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-emerald-200/50 bg-emerald-50/50 p-2">
                <p className="text-lg font-heading font-bold text-emerald-700">{verifiedDocs}</p>
                <p className="text-[10px] font-medium text-emerald-600">Verified</p>
              </div>
              <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-2">
                <p className="text-lg font-heading font-bold text-amber-700">{pendingDocs}</p>
                <p className="text-[10px] font-medium text-amber-600">Pending</p>
              </div>
              <div className="rounded-lg border border-red-200/50 bg-red-50/50 p-2">
                <p className="text-lg font-heading font-bold text-red-700">{rejectedDocs}</p>
                <p className="text-[10px] font-medium text-red-600">Rejected</p>
              </div>
            </div>
            {/* Latest records list */}
            <div className="space-y-1.5">
              {myRecords.slice(0, 4).map((rec) => (
                <div key={rec.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-xs text-foreground truncate max-w-[180px]">{rec.title}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] ml-2 shrink-0 ${
                      rec.status === "verified" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                      rec.status === "rejected" ? "bg-red-500/10 text-red-600 border-red-500/30" :
                      "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {rec.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance overview */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Attendance Overview</CardTitle>
              <button
                type="button"
                className="text-[11px] font-semibold uppercase tracking-widest text-primary hover:text-foreground"
                onClick={() => navigate("/my-attendance")}
              >
                Details
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ring */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke={overallPct >= 75 ? "hsl(var(--primary))" : "#DC2626"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${overallPct * 2.39} ${239 - overallPct * 2.39}`}
                  />
                </svg>
                <span className="absolute text-sm font-bold text-foreground">{overallPct}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Overall attendance</p>
                <p className="text-xs text-muted-foreground">{summaries.length} courses this semester</p>
                {atRiskCourses.length > 0 && (
                  <p className="text-[10px] font-semibold text-red-600 mt-1">
                    {atRiskCourses.length} course(s) below 75% threshold
                  </p>
                )}
              </div>
            </div>
            {/* Per-course bars */}
            {summaries.map((s) => (
              <div key={s.courseCode} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{s.courseCode} — {s.courseName}</span>
                  <span className={`font-bold ${s.eligible ? "text-emerald-600" : "text-red-600"}`}>
                    {s.attendancePct}%
                  </span>
                </div>
                <Progress
                  value={s.attendancePct}
                  className={`h-1.5 ${s.attendancePct < 75 ? "[&>div]:bg-red-500" : ""}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className={`rounded-lg border p-3 ${d.daysLeft <= 7 ? "border-red-200 bg-red-50/30" : "border-border"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">{d.task}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{d.course} · {d.date}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${
                      d.daysLeft <= 7 ? "bg-red-500/10 text-red-700 border-red-400/30" :
                      d.daysLeft <= 14 ? "bg-amber-500/10 text-amber-700 border-amber-400/30" :
                      "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {d.daysLeft} days left
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Recent Submissions table + Notifications feed ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Submissions */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading">Recent Submissions</CardTitle>
                <CardDescription>Your latest project and document submissions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/my-submissions")}>
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Title</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Reviewer</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((s, i) => (
                  <TableRow key={i} className="cursor-pointer hover:bg-accent/40">
                    <TableCell className="max-w-[200px] truncate text-sm font-medium text-foreground">{s.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.type}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.reviewer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${statusStyle[s.status] ?? ""}`}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{s.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/notifications")}>
                All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentNotifications.map((n, i) => (
              <div key={i} className={`border-l-2 pl-3 py-2.5 ${notifStyle[n.type]} ${i < recentNotifications.length - 1 ? "border-b border-border/40" : ""}`}>
                <p className="text-xs text-foreground leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Academic Summary + Quick Navigation ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Semester academic progress */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">Semester Academic Progress</CardTitle>
            <CardDescription>2025-S1 course completion and documentation status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Attendance</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Documents</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Eligibility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((s) => {
                  const courseDocs = myRecords.filter((r) => r.title.includes(s.courseCode)).length;
                  return (
                    <TableRow key={s.courseCode}>
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">{s.courseCode}</span>
                        <span className="block text-[10px] text-muted-foreground">{s.courseName}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-mono font-bold ${s.eligible ? "text-emerald-700" : "text-red-700"}`}>
                          {s.attendancePct}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {courseDocs > 0 ? `${courseDocs} filed` : "None"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${s.eligible ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-red-50 text-red-700 border-red-300"}`}>
                          {s.eligible ? "Eligible" : "At Risk"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick navigation */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">Quick Navigation</CardTitle>
            <CardDescription>Frequently used services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "My Documents", desc: "View all academic files", route: "/my-documents" },
                { label: "Attendance Record", desc: "Check per-course status", route: "/my-attendance" },
                { label: "Upload Document", desc: "Submit academic forms", route: "/submit/document" },
                { label: "Submit Project", desc: "Final year submission", route: "/submit/project" },
                { label: "Browse Archive", desc: "Search published works", route: "/browse" },
                { label: "My Reservations", desc: "Library reservations", route: "/my-reservations" },
                { label: "Notifications", desc: "Alerts and updates", route: "/notifications" },
                { label: "Help Center", desc: "Guidelines and FAQ", route: "/help" },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  className="h-auto flex-col items-start gap-0.5 p-3 text-left hover:bg-accent/40"
                  onClick={() => navigate(item.route)}
                >
                  <span className="text-xs font-semibold">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
