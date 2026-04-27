import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { getAllFlaggedPapers, examPapers } from "@/data/exam-papers";

/* ─── Mock data ─── */

const examPapersQueue = [
  { id: "ex1", course: "CS301 — Software Engineering", lecturer: "Dr. Sarah Mugisha", submitted: "Mar 10, 2025", coverage: 100, flags: 0, status: "cleared" },
  { id: "ex2", course: "IT201 — Web Development", lecturer: "Dr. Sarah Mugisha", submitted: "Mar 14, 2025", coverage: 58, flags: 3, status: "flagged" },
  { id: "ex3", course: "CS401 — Machine Learning", lecturer: "Prof. Agnes Ntamwiza", submitted: "Mar 15, 2025", coverage: 83, flags: 1, status: "flagged" },
  { id: "ex4", course: "ENG301 — Circuit Design", lecturer: "Dr. Jean B. Niyonzima", submitted: "Mar 16, 2025", coverage: 42, flags: 3, status: "flagged" },
];

const mismatchAlerts = [
  { course: "IT201", question: "Q3: Docker containerization", detail: "Docker was not covered in teaching log", severity: "high" },
  { course: "IT201", question: "Q7: GraphQL API design", detail: "GraphQL not found in teaching log entries", severity: "high" },
  { course: "CS401", question: "Q5: Reinforcement Learning", detail: "RL was partially covered (1 session only)", severity: "medium" },
  { course: "ENG301", question: "Q2: FPGA design", detail: "FPGA not in teaching log", severity: "high" },
  { course: "ENG301", question: "Q4: Signal processing", detail: "Signal processing not covered", severity: "high" },
  { course: "ENG301", question: "Q6: Power electronics", detail: "Topic not found in log entries", severity: "medium" },
];

const teachingLogCoverage = [
  { lecturer: "Dr. Sarah Mugisha", initials: "SM", logged: 16, required: 28, courses: ["CS301", "IT201"] },
  { lecturer: "Prof. Agnes Ntamwiza", initials: "AN", logged: 22, required: 28, courses: ["CS401"] },
  { lecturer: "Dr. Jean B. Niyonzima", initials: "JN", logged: 8, required: 28, courses: ["ENG301"] },
  { lecturer: "Mr. Patrick Mugisha", initials: "PM", logged: 20, required: 28, courses: ["IT101"] },
  { lecturer: "Dr. Celestin Hakizimana", initials: "CH", logged: 25, required: 28, courses: ["BUS301"] },
];

const gradeDistribution = [
  { course: "CS301", courseName: "Software Engineering", A: 8, B: 15, C: 12, D: 4, F: 1, total: 40, avg: "B" },
  { course: "IT201", courseName: "Web Development", A: 12, B: 18, C: 10, D: 3, F: 0, total: 43, avg: "B+" },
  { course: "CS401", courseName: "Machine Learning", A: 5, B: 10, C: 14, D: 6, F: 2, total: 37, avg: "C+" },
  { course: "ENG301", courseName: "Circuit Design", A: 6, B: 12, C: 15, D: 5, F: 3, total: 41, avg: "C+" },
];

const deptStats = {
  totalStudents: 247,
  totalLecturers: 12,
  coursesOffered: 18,
  graduatingStudents: 34,
  examsPending: examPapersQueue.filter((e) => e.status === "flagged").length,
  examsCleared: examPapersQueue.filter((e) => e.status === "cleared").length,
};

const recentActivity = [
  { action: "Dr. Sarah Mugisha submitted CS301 exam paper — cleared with 100% coverage", time: "2 hours ago" },
  { action: "IT201 exam paper flagged — Docker and GraphQL not in teaching log", time: "1 day ago" },
  { action: "ENG301 exam paper flagged — 3 topics not covered: FPGA, Signal Processing, Power Electronics", time: "1 day ago" },
  { action: "Prof. Agnes N. logged 2 new teaching sessions for CS401", time: "2 days ago" },
  { action: "Dr. Jean B. N. submitted attendance report for ENG301", time: "3 days ago" },
  { action: "34 students confirmed for May 2025 graduation ceremony", time: "5 days ago" },
];

export function HodDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const flaggedPapers = getAllFlaggedPapers();

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
              {user?.department} Department
            </h1>
            <p className="text-sm text-muted-foreground">
              Head of Department · {user?.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/hod/exam-review")}>
            Review Exams
          </Button>
          <Button size="sm" onClick={() => navigate("/hod/reports")}>
            Dept. Reports
          </Button>
        </div>
      </div>

      {/* ── Row 1: Department summary counters ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Students", value: deptStats.totalStudents },
          { label: "Lecturers", value: deptStats.totalLecturers },
          { label: "Courses", value: deptStats.coursesOffered },
          { label: "Graduating", value: deptStats.graduatingStudents },
          { label: "Exams Pending", value: deptStats.examsPending, highlight: true },
          { label: "Exams Cleared", value: deptStats.examsCleared },
        ].map((s) => (
          <Card key={s.label} className={`border-border shadow-sm text-center ${s.highlight ? "ring-1 ring-amber-300/50" : ""}`}>
            <CardContent className="p-4">
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Row 2: Exam papers queue + Topic mismatch alerts ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Exam papers for review */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading">Exam Papers for Review</CardTitle>
                <CardDescription>{examPapersQueue.length} papers submitted this semester</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate("/hod/exam-review")}>
                Review all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {examPapersQueue.map((exam) => (
              <div key={exam.id} className={`rounded-lg border p-3 ${exam.flags > 0 ? "border-red-200 bg-red-50/30" : "border-border"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">{exam.course}</p>
                    <p className="text-[10px] text-muted-foreground">{exam.lecturer} · {exam.submitted}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {exam.flags > 0 && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-400/30 text-[10px]">
                        {exam.flags} flags
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Topic coverage</span>
                    <span className={`font-bold ${exam.coverage >= 80 ? "text-emerald-700" : "text-red-700"}`}>
                      {exam.coverage}%
                    </span>
                  </div>
                  <Progress
                    value={exam.coverage}
                    className={`h-1.5 ${exam.coverage < 80 ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Topic mismatch alerts */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading">Topic Mismatch Alerts</CardTitle>
                <CardDescription>Exam questions on topics not in teaching logs</CardDescription>
              </div>
              <Badge variant="destructive" className="text-[10px]">{mismatchAlerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[360px] overflow-y-auto">
            {mismatchAlerts.map((alert, i) => (
              <div key={i} className={`rounded-lg border p-3 ${alert.severity === "high" ? "border-red-200 bg-red-50/40" : "border-amber-200 bg-amber-50/40"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`text-[10px] ${
                    alert.severity === "high"
                      ? "bg-red-500/10 text-red-700 border-red-400/30"
                      : "bg-amber-500/10 text-amber-700 border-amber-400/30"
                  }`}>
                    {alert.severity}
                  </Badge>
                  <span className="text-[10px] font-semibold text-foreground">{alert.course}</span>
                </div>
                <p className="text-xs font-medium text-foreground">{alert.question}</p>
                <p className="text-[10px] text-red-600 mt-0.5">{alert.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Teaching log coverage + Grade distribution ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Teaching log coverage per lecturer */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Teaching Log Coverage by Lecturer</CardTitle>
            <CardDescription>Sessions logged vs required this semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachingLogCoverage.map((lec) => {
              const pct = Math.round((lec.logged / lec.required) * 100);
              const isLow = pct < 50;
              return (
                <div key={lec.lecturer} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                      {lec.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{lec.lecturer}</span>
                        <span className={`text-[10px] font-mono ${isLow ? "text-red-700 font-bold" : "text-muted-foreground"}`}>
                          {lec.logged}/{lec.required} ({pct}%)
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{lec.courses.join(", ")}</p>
                    </div>
                  </div>
                  <Progress value={pct} className={`h-1.5 ml-9 ${isLow ? "[&>div]:bg-red-500" : ""}`} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Grade distribution */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Grade Distribution — Current Semester</CardTitle>
            <CardDescription>Course-level grade breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">A</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">B</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">C</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">D</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">F</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Avg</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeDistribution.map((g) => (
                  <TableRow key={g.course}>
                    <TableCell>
                      <span className="text-xs font-semibold text-foreground">{g.course}</span>
                      <span className="block text-[10px] text-muted-foreground">{g.courseName}</span>
                    </TableCell>
                    <TableCell className="text-center text-xs font-mono text-emerald-700">{g.A}</TableCell>
                    <TableCell className="text-center text-xs font-mono text-sky-700">{g.B}</TableCell>
                    <TableCell className="text-center text-xs font-mono text-amber-700">{g.C}</TableCell>
                    <TableCell className="text-center text-xs font-mono text-orange-700">{g.D}</TableCell>
                    <TableCell className="text-center text-xs font-mono text-red-700">{g.F}</TableCell>
                    <TableCell className="text-right text-xs font-bold text-foreground">{g.avg}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Recent activity + Quick reports ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity log */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">Department Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentActivity.map((a, i) => (
              <div key={i} className={`py-2.5 ${i < recentActivity.length - 1 ? "border-b border-border/40" : ""}`}>
                <p className="text-xs text-foreground leading-relaxed">{a.action}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Department report shortcuts */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">Department Reports</CardTitle>
            <CardDescription>Quick access to key reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Graduation Lists", desc: "2025 graduating class", route: "/hod/reports" },
                { label: "Teaching Progress", desc: "Semester coverage report", route: "/hod/reports" },
                { label: "Marks Moderation", desc: "Grade moderation status", route: "/hod/reports" },
                { label: "Exam Timetable", desc: "Final exam schedule", route: "/exam-office/timetable" },
                { label: "Eligibility Lists", desc: "Exam eligibility by course", route: "/hod/eligibility" },
                { label: "Attendance Reports", desc: "Department attendance", route: "/hod/attendance" },
              ].map((r) => (
                <Button
                  key={r.label}
                  variant="outline"
                  className="h-auto flex-col items-start gap-0.5 p-3 text-left hover:bg-accent/40"
                  onClick={() => navigate(r.route)}
                >
                  <span className="text-xs font-semibold">{r.label}</span>
                  <span className="text-[10px] text-muted-foreground">{r.desc}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
