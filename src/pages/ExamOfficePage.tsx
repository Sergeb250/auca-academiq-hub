import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock, MapPin, Users, Armchair, Download, Clock, FileCheck,
} from "lucide-react";
import { examTimetable } from "@/data/academic-records";

/* ─── Seating arrangements mock ─── */
const seatingPlans = [
  { examId: "et1", courseCode: "CS301", venue: "AUCA Hall A", rows: 10, columns: 12, totalSeats: 120, assignedStudents: 40 },
  { examId: "et2", courseCode: "IT201", venue: "AUCA Hall B", rows: 10, columns: 10, totalSeats: 100, assignedStudents: 43 },
  { examId: "et3", courseCode: "CS401", venue: "AUCA Hall A", rows: 10, columns: 12, totalSeats: 120, assignedStudents: 37 },
  { examId: "et4", courseCode: "ENG301", venue: "Engineering Lab", rows: 6, columns: 10, totalSeats: 60, assignedStudents: 41 },
];

/* ─── Eligibility lists mock ─── */
const eligibilityData = [
  { courseCode: "CS301", courseName: "Software Engineering", enrolled: 40, eligible: 36, ineligible: 4, pct: 90 },
  { courseCode: "IT201", courseName: "Web Development",     enrolled: 43, eligible: 41, ineligible: 2, pct: 95 },
  { courseCode: "CS401", courseName: "Machine Learning",    enrolled: 37, eligible: 32, ineligible: 5, pct: 86 },
  { courseCode: "ENG301", courseName: "Circuit Design",      enrolled: 41, eligible: 38, ineligible: 3, pct: 93 },
  { courseCode: "IT101", courseName: "Introduction to IT",   enrolled: 55, eligible: 52, ineligible: 3, pct: 95 },
];

/* ─── Marks validation mock ─── */
const marksValidation = [
  { courseCode: "CS301", lecturer: "Dr. Sarah Mugisha", status: "validated" as const, totalStudents: 40, submitted: 40, flagged: 0 },
  { courseCode: "IT201", lecturer: "Dr. Sarah Mugisha", status: "pending" as const, totalStudents: 43, submitted: 38, flagged: 3 },
  { courseCode: "CS401", lecturer: "Prof. Agnes Ntamwiza", status: "validated" as const, totalStudents: 37, submitted: 37, flagged: 0 },
  { courseCode: "ENG301", lecturer: "Dr. Jean B. Niyonzima", status: "flagged" as const, totalStudents: 41, submitted: 41, flagged: 5 },
];

const markStatusColors: Record<string, string> = {
  validated: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  flagged: "bg-red-500/10 text-red-600 border-red-500/30",
};

const ExamOfficePage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Examination Office</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage exam timetables, seating arrangements, eligibility, and marks validation.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export All
          </Button>
        </div>

        <Tabs defaultValue="timetable" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="timetable" className="gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" /> Timetable
            </TabsTrigger>
            <TabsTrigger value="seating" className="gap-1.5">
              <Armchair className="h-3.5 w-3.5" /> Seating Plan
            </TabsTrigger>
            <TabsTrigger value="eligibility" className="gap-1.5">
              <Users className="h-3.5 w-3.5" /> Eligibility
            </TabsTrigger>
            <TabsTrigger value="marks" className="gap-1.5">
              <FileCheck className="h-3.5 w-3.5" /> Marks Validation
            </TabsTrigger>
          </TabsList>

          {/* ─── Timetable ─── */}
          <TabsContent value="timetable">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Final Exam Timetable — 2025 S1</CardTitle>
                <CardDescription>{examTimetable.length} exams scheduled</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Time</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Venue</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Capacity</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Invigilator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examTimetable.sort((a, b) => a.date.localeCompare(b.date)).map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">
                          {new Date(exam.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {exam.startTime} — {exam.endTime}
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline" className="text-[10px] font-semibold">{exam.courseCode}</Badge>
                            <span className="ml-2 text-xs text-muted-foreground">{exam.courseName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <MapPin className="inline mr-1 h-3 w-3" />{exam.venue}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-foreground">{exam.seatCapacity}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{exam.invigilator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Seating Plan ─── */}
          <TabsContent value="seating">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seatingPlans.map((plan) => (
                <Card key={plan.examId} className="border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-heading">{plan.courseCode}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">
                        <MapPin className="mr-1 h-3 w-3" />{plan.venue}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Visual seating grid */}
                    <div className="rounded-lg border border-border p-4 bg-muted/30">
                      <div className="mb-3 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Front — Invigilator Desk</p>
                        <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-primary/30" />
                      </div>
                      <div
                        className="grid gap-1 mx-auto"
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(plan.columns, 12)}, 1fr)`,
                          maxWidth: Math.min(plan.columns * 24, 288),
                        }}
                      >
                        {Array.from({ length: Math.min(plan.rows * plan.columns, 60) }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-4 w-4 rounded-sm ${i < plan.assignedStudents ? "bg-primary/30" : "bg-border/50"}`}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex justify-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-sm bg-primary/30" /> Assigned ({plan.assignedStudents})
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-sm bg-border/50" /> Empty ({plan.totalSeats - plan.assignedStudents})
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                      <span>{plan.rows} rows × {plan.columns} columns</span>
                      <span className="font-semibold text-foreground">{plan.assignedStudents}/{plan.totalSeats} seats</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ─── Eligibility ─── */}
          <TabsContent value="eligibility">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Exam Eligibility Lists</CardTitle>
                <CardDescription>Based on 75% minimum attendance requirement</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-center">Enrolled</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-center">Eligible</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-center">Ineligible</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibilityData.map((row) => (
                      <TableRow key={row.courseCode}>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-semibold">{row.courseCode}</Badge>
                          <span className="ml-2 text-xs text-muted-foreground">{row.courseName}</span>
                        </TableCell>
                        <TableCell className="text-center text-sm font-semibold text-foreground">{row.enrolled}</TableCell>
                        <TableCell className="text-center text-sm font-semibold text-emerald-600">{row.eligible}</TableCell>
                        <TableCell className="text-center text-sm font-semibold text-red-600">{row.ineligible}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] ${
                            row.pct >= 90 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                            "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          }`}>
                            {row.pct}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Marks Validation ─── */}
          <TabsContent value="marks">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Marks Approval & Validation</CardTitle>
                <CardDescription>Review submitted grades before official recording</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Lecturer</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-center">Submitted</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-center">Total</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-center">Flagged</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marksValidation.map((row) => (
                      <TableRow key={row.courseCode} className={row.status === "flagged" ? "bg-red-50/50" : ""}>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-semibold">{row.courseCode}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.lecturer}</TableCell>
                        <TableCell className="text-center text-sm font-semibold text-foreground">{row.submitted}</TableCell>
                        <TableCell className="text-center text-sm font-mono text-muted-foreground">{row.totalStudents}</TableCell>
                        <TableCell className="text-center">
                          {row.flagged > 0 ? (
                            <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/30">
                              {row.flagged} issues
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] ${markStatusColors[row.status]}`}>
                            {row.status === "validated" ? "✓ Validated" :
                             row.status === "pending" ? "Pending" : "⚠ Flagged"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ExamOfficePage;
