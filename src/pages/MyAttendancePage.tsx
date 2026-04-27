import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle, XCircle, Clock, AlertTriangle, UserCheck, TrendingUp,
} from "lucide-react";
import { attendanceRecords, computeAttendanceSummaries } from "@/data/attendance";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import { CHART_COLORS } from "@/types";

const ELIGIBILITY_THRESHOLD = 75;

const statusConfig: Record<string, { label: string; className: string }> = {
  present: { label: "Present", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  absent: { label: "Absent", className: "bg-red-500/10 text-red-600 border-red-500/30" },
  late: { label: "Late", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  excused: { label: "Excused", className: "bg-sky-500/10 text-sky-600 border-sky-500/30" },
};

const MyAttendancePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const summaries = computeAttendanceSummaries(attendanceRecords, user.id);
  const myRecords = attendanceRecords.filter((r) => r.studentId === user.id);
  const overallPct = summaries.length > 0
    ? Math.round(summaries.reduce((s, c) => s + c.attendancePct, 0) / summaries.length)
    : 0;
  const allEligible = summaries.every((s) => s.eligible);

  // Chart data per course
  const chartData = summaries.map((s) => ({
    course: s.courseCode,
    attendance: s.attendancePct,
    fill: s.eligible ? CHART_COLORS.present : CHART_COLORS.rejected,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">My Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your attendance per course. Minimum {ELIGIBILITY_THRESHOLD}% required for exam eligibility.
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Overall attendance ring */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={overallPct >= ELIGIBILITY_THRESHOLD ? "hsl(var(--primary))" : "#DC2626"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${overallPct * 2.51} ${251 - overallPct * 2.51}`}
                  />
                </svg>
                <span className="absolute text-lg font-heading font-bold text-foreground">{overallPct}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Overall Attendance</p>
                <p className="text-xs text-muted-foreground">{summaries.length} courses tracked</p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility status */}
          <Card className={`border-border shadow-sm ${allEligible ? "" : "ring-2 ring-red-400/30"}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${allEligible ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                {allEligible ? (
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {allEligible ? "All Courses Eligible" : "Eligibility at Risk"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {allEligible
                    ? "You meet the attendance threshold for all courses"
                    : `${summaries.filter((s) => !s.eligible).length} course(s) below ${ELIGIBILITY_THRESHOLD}%`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total stats */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-lg font-heading font-bold text-emerald-600">
                  {myRecords.filter((r) => r.status === "present").length}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Present</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-heading font-bold text-red-600">
                  {myRecords.filter((r) => r.status === "absent").length}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-heading font-bold text-amber-600">
                  {myRecords.filter((r) => r.status === "late").length}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Late</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-heading font-bold text-sky-600">
                  {myRecords.filter((r) => r.status === "excused").length}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Excused</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Per-course breakdown */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Chart */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Attendance by course</CardTitle>
              <CardDescription>
                Red bar = below {ELIGIBILITY_THRESHOLD}% threshold
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                  <XAxis dataKey="course" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11} unit="%" width={36} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", fontSize: 12 }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  {/* Reference line at 75% */}
                  <Bar dataKey="attendance" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {chartData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* 75% threshold line label */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-px w-4 bg-amber-500" />
                <span className="text-[10px] font-medium text-amber-600">
                  {ELIGIBILITY_THRESHOLD}% eligibility threshold
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Per-course cards */}
          <div className="space-y-3">
            {summaries.map((s) => (
              <Card key={s.courseCode} className={`border-border shadow-sm ${!s.eligible ? "ring-2 ring-red-400/20" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.courseCode} — {s.courseName}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.totalSessions} sessions · {s.present + s.excused} attended
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${s.eligible
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : "bg-red-500/10 text-red-600 border-red-500/30"}`}
                    >
                      {s.eligible ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                      {s.eligible ? "Eligible" : "At Risk"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className={`font-bold ${s.attendancePct >= ELIGIBILITY_THRESHOLD ? "text-emerald-600" : "text-red-600"}`}>
                        {s.attendancePct}%
                      </span>
                    </div>
                    <Progress
                      value={s.attendancePct}
                      className={`h-2 ${s.attendancePct < ELIGIBILITY_THRESHOLD ? "[&>div]:bg-red-500" : ""}`}
                    />
                  </div>
                  <div className="mt-2 flex gap-3 text-[10px] font-medium">
                    <span className="text-emerald-600">✓ {s.present} present</span>
                    <span className="text-red-600">✗ {s.absent} absent</span>
                    <span className="text-amber-600">{s.late} late</span>
                    <span className="text-sky-600">{s.excused} excused</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Attendance log table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Attendance log</CardTitle>
            <CardDescription>All recorded sessions this semester</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRecords.sort((a, b) => b.date.localeCompare(a.date)).map((rec) => {
                  const st = statusConfig[rec.status];
                  return (
                    <TableRow key={rec.id}>
                      <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">
                        {new Date(rec.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-semibold">{rec.courseCode}</Badge>
                        <span className="ml-2 text-xs text-muted-foreground">{rec.courseName}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                          {st.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MyAttendancePage;
