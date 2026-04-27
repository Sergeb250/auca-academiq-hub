import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle, XCircle, AlertTriangle, Users, UserCheck, Clock,
} from "lucide-react";
import { courseAttendanceData, computeAttendanceSummaries } from "@/data/attendance";

const ELIGIBILITY_THRESHOLD = 75;

const courses = [
  { code: "CS301", name: "Software Engineering" },
  { code: "IT201", name: "Web Development" },
];

const AttendanceManagementPage = () => {
  const [selectedCourse, setSelectedCourse] = useState("CS301");

  // Get all unique students for the selected course
  const courseRecords = courseAttendanceData.filter((r) => r.courseCode === selectedCourse);
  const studentIds = [...new Set(courseRecords.map((r) => r.studentId))];

  const summaries = studentIds.map((sid) => {
    const recs = courseRecords.filter((r) => r.studentId === sid);
    const present = recs.filter((r) => r.status === "present" || r.status === "late").length;
    const absent = recs.filter((r) => r.status === "absent").length;
    const late = recs.filter((r) => r.status === "late").length;
    const excused = recs.filter((r) => r.status === "excused").length;
    const total = recs.length;
    const pct = total > 0 ? Math.round(((present + excused) / total) * 100) : 0;
    return {
      studentId: sid,
      studentName: recs[0]?.studentName ?? "",
      campusId: recs[0]?.campusId ?? "",
      totalSessions: total,
      present: present - late, // corrected for double count
      absent,
      late,
      excused,
      attendancePct: pct,
      eligible: pct >= ELIGIBILITY_THRESHOLD,
    };
  });

  const eligible = summaries.filter((s) => s.eligible).length;
  const atRisk = summaries.filter((s) => !s.eligible).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Attendance Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track student attendance. Students below {ELIGIBILITY_THRESHOLD}% are ineligible for exams.
            </p>
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">{summaries.length}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Enrolled</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">{eligible}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Eligible</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`border-border shadow-sm ${atRisk > 0 ? "ring-2 ring-red-400/30" : ""}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">{atRisk}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">At Risk</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">
                  {summaries.length > 0 ? summaries[0].totalSessions : 0}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student roster table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-heading">Student Attendance Roster</CardTitle>
                <CardDescription>
                  {selectedCourse} — {courses.find((c) => c.code === selectedCourse)?.name}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="text-xs gap-1">
                <UserCheck className="h-3 w-3" /> Mark Today
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Campus ID</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-center">Present</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-center">Absent</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-center">Late</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Attendance</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Eligibility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries
                  .sort((a, b) => a.attendancePct - b.attendancePct)
                  .map((s) => (
                    <TableRow key={s.studentId} className={!s.eligible ? "bg-red-50/50" : ""}>
                      <TableCell className="text-sm font-medium text-foreground">{s.studentName}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{s.campusId}</TableCell>
                      <TableCell className="text-center text-sm font-semibold text-emerald-600">{s.present}</TableCell>
                      <TableCell className="text-center text-sm font-semibold text-red-600">{s.absent}</TableCell>
                      <TableCell className="text-center text-sm font-semibold text-amber-600">{s.late}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{s.attendancePct}%</span>
                          </div>
                          <Progress
                            value={s.attendancePct}
                            className={`h-2 ${s.attendancePct < ELIGIBILITY_THRESHOLD ? "[&>div]:bg-red-500" : ""}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={`text-[10px] ${
                          s.eligible
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-red-500/10 text-red-600 border-red-500/30"
                        }`}>
                          {s.eligible ? (
                            <><CheckCircle className="mr-1 h-3 w-3" /> Eligible</>
                          ) : (
                            <><XCircle className="mr-1 h-3 w-3" /> Ineligible</>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AttendanceManagementPage;
