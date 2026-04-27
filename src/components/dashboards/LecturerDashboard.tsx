import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { teachingLogEntries, SEMESTER_TOTAL_SESSIONS } from "@/data/teaching-log";
import { getExamPapersByLecturer } from "@/data/exam-papers";

/* ─── Mock data ─── */

const publications = [
  { title: "Impact of Mobile Banking on Financial Inclusion in Rwanda", views: 189, citations: 14, status: "Published", date: "2024-09-15" },
  { title: "Digital Transformation in East African Universities", views: 67, citations: 5, status: "Published", date: "2024-11-20" },
  { title: "Blockchain Applications in Supply Chain Management", views: 34, citations: 2, status: "Under Review", date: "2025-02-01" },
];

const supervisedStudents = [
  { name: "Grace Uwimana", project: "Machine Learning for Crop Disease Detection", progress: 95, status: "Ready for Defense" },
  { name: "Eric Habimana", project: "Blockchain-Based Land Registry for Rwanda", progress: 78, status: "Final Draft" },
  { name: "Marie Claire N.", project: "E-Commerce Platform for Local Artisans", progress: 65, status: "Under Review" },
  { name: "Patrick Kubwimana", project: "Water Quality Monitoring System", progress: 52, status: "Writing" },
  { name: "David Mugabo", project: "Solar Energy Management Dashboard", progress: 88, status: "Revision" },
  { name: "Claudine Ingabire", project: "Rwanda Tourism Recommendation Engine", progress: 40, status: "Research Phase" },
  { name: "Jean Paul Habineza", project: "Kinyarwanda NLP Text Classifier", progress: 30, status: "Proposal" },
  { name: "Joseph Nsengimana", project: "Mobile Health Tracking Application", progress: 72, status: "Development" },
];

const pendingReviews = [
  { title: "E-Commerce Platform for Local Artisans", student: "Marie Claire N.", department: "IT", submitted: "Mar 12, 2025" },
  { title: "Water Quality Monitoring System", student: "Patrick K.", department: "Engineering", submitted: "Mar 14, 2025" },
];

const upcomingClasses = [
  { course: "CS301", name: "Software Engineering", day: "Monday", time: "08:00 - 10:00", room: "AUCA Hall A", students: 40 },
  { course: "IT201", name: "Web Development", day: "Tuesday", time: "10:00 - 12:00", room: "AUCA Hall B", students: 43 },
  { course: "CS301", name: "Software Engineering", day: "Wednesday", time: "08:00 - 10:00", room: "AUCA Hall A", students: 40 },
  { course: "IT201", name: "Web Development", day: "Thursday", time: "10:00 - 12:00", room: "AUCA Hall B", students: 43 },
];

const recentActivity = [
  { action: "Marked attendance for CS301 — 38 present, 2 absent", time: "Today, 10:15 AM" },
  { action: "Submitted exam paper for CS301 to exam office", time: "Yesterday, 2:30 PM" },
  { action: "Published teaching log entry: API Design and REST", time: "2 days ago" },
  { action: "Reviewed project submission: E-Commerce Platform", time: "3 days ago" },
  { action: "Updated IT201 exam paper — added 2 new questions", time: "4 days ago" },
];

const statusStyle: Record<string, string> = {
  Published: "bg-emerald-500/10 text-emerald-700 border-emerald-400/30",
  "Under Review": "bg-primary/10 text-primary border-primary/30",
};

export function LecturerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name.split(" ").pop() ?? "there";

  // Teaching log stats
  const myLogEntries = teachingLogEntries.filter((e) => e.lecturerId === (user?.id ?? ""));
  const courseGroups: Record<string, number> = {};
  myLogEntries.forEach((e) => {
    courseGroups[e.courseCode] = (courseGroups[e.courseCode] ?? 0) + 1;
  });
  const totalLogged = myLogEntries.length;
  const logPct = Math.round((totalLogged / SEMESTER_TOTAL_SESSIONS) * 100);

  // Exam papers
  const examPapers = getExamPapersByLecturer(user?.id ?? "");
  const flaggedCount = examPapers.filter((p) => p.status === "flagged").length;

  return (
    <div className="space-y-6">
      {/* ── Greeting bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary to-primary/85 text-base font-semibold text-primary-foreground shadow-md">
            {user?.avatarInitials}
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.department} · Lecturer
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/teaching-log")}>
            Teaching Log
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/exam-upload")}>
            Exam Upload
          </Button>
          <Button size="sm" onClick={() => navigate("/submit/publication")}>
            Submit Publication
          </Button>
        </div>
      </div>

      {/* ── Row 1: Teaching Log + Exam Papers + Schedule ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Teaching log ring + per-course breakdown */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Teaching Log</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/teaching-log")}>
                View full log
              </Button>
            </div>
            <CardDescription>Semester 2025-S1 progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ring */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${logPct * 2.39} ${239 - logPct * 2.39}`}
                  />
                </svg>
                <span className="absolute text-sm font-bold text-foreground">{logPct}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{totalLogged} of {SEMESTER_TOTAL_SESSIONS} sessions</p>
                <p className="text-xs text-muted-foreground">{Object.keys(courseGroups).length} courses active</p>
              </div>
            </div>
            {/* Per-course breakdown */}
            {Object.entries(courseGroups).map(([code, count]) => {
              const pct = Math.round((count / SEMESTER_TOTAL_SESSIONS) * 100);
              return (
                <div key={code} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{code}</span>
                    <span className="font-mono text-muted-foreground">{count} sessions</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Exam papers status */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Exam Papers</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/exam-upload")}>
                Manage
              </Button>
            </div>
            <CardDescription>Topic coverage and submission status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {flaggedCount > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-3">
                <p className="text-xs font-semibold text-red-800">
                  {flaggedCount} paper(s) have topic coverage issues
                </p>
                <p className="text-[10px] text-red-600 mt-0.5">
                  Exam questions reference topics not found in your teaching log. Review and resolve before submission.
                </p>
              </div>
            )}
            {examPapers.map((paper) => (
              <div key={paper.id} className={`rounded-lg border p-3 ${paper.status === "flagged" ? "border-red-200 bg-red-50/30" : "border-border"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{paper.courseCode} — {paper.courseName}</span>
                  <Badge variant="outline" className={`text-[10px] ${
                    paper.status === "flagged" ? "bg-red-500/10 text-red-700 border-red-400/30" :
                    paper.status === "approved_by_hod" ? "bg-emerald-500/10 text-emerald-700 border-emerald-400/30" :
                    "bg-amber-500/10 text-amber-700 border-amber-400/30"
                  }`}>
                    {paper.status === "flagged" ? "Coverage Issue" :
                     paper.status === "approved_by_hod" ? "HOD Approved" :
                     paper.status.replace("_", " ")}
                  </Badge>
                </div>
                {paper.coverageReport && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Topic coverage</span>
                      <span className={`font-bold ${paper.coverageReport.coveragePct >= 80 ? "text-emerald-700" : "text-red-700"}`}>
                        {paper.coverageReport.coveragePct}%
                      </span>
                    </div>
                    <Progress
                      value={paper.coverageReport.coveragePct}
                      className={`h-1.5 ${paper.coverageReport.coveragePct < 80 ? "[&>div]:bg-red-500" : ""}`}
                    />
                    {paper.coverageReport.flagCount > 0 && (
                      <p className="text-[10px] text-red-600">
                        {paper.coverageReport.flagCount} untaught topic(s) found in exam questions
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly schedule */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">This Week's Classes</CardTitle>
            <CardDescription>Upcoming teaching sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingClasses.map((cls, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{cls.course} — {cls.name}</span>
                  <span className="text-[10px] text-muted-foreground">{cls.students} students</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {cls.day} · {cls.time} · {cls.room}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Supervised Students + Publications ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Supervised students */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading">Supervised Students</CardTitle>
                <CardDescription>{supervisedStudents.length} students under supervision</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/supervised")}>
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Progress</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supervisedStudents.slice(0, 6).map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{s.project}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-foreground">{s.progress}%</span>
                        <Progress value={s.progress} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px]">{s.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Publications + Pending reviews + Activity */}
        <div className="space-y-4">
          {/* Publications */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-heading">My Publications</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/my-publications")}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {publications.map((pub, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{pub.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{pub.views} views · {pub.citations} citations</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-[10px] ${statusStyle[pub.status] ?? ""}`}>
                    {pub.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending student reviews */}
          {pendingReviews.length > 0 && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-heading">Pending Student Reviews</CardTitle>
                  <Badge variant="destructive" className="text-[10px]">{pendingReviews.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingReviews.map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground">by {r.student} · {r.department} · {r.submitted}</p>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 text-xs h-7">Review</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent activity */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {recentActivity.map((a, i) => (
                <div key={i} className={`py-2.5 ${i < recentActivity.length - 1 ? "border-b border-border/40" : ""}`}>
                  <p className="text-xs text-foreground">{a.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
