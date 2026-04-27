import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap, ClipboardList, FileCheck, Calendar, Users, BarChart3, Download,
} from "lucide-react";

/* ─── Mock data ─── */

const graduationList = [
  { name: "Jean Pierre Habimana", id: "AUCA-2023-0147", program: "BSc Information Technology", gpa: 3.65, status: "Eligible" },
  { name: "Grace Uwimana", id: "AUCA-2022-0289", program: "BSc Computer Science", gpa: 3.82, status: "Eligible" },
  { name: "Eric Habimana", id: "AUCA-2023-0198", program: "BSc Information Technology", gpa: 3.41, status: "Eligible" },
  { name: "Marie Claire Niyonsaba", id: "AUCA-2023-0198", program: "BSc Information Technology", gpa: 3.55, status: "Pending Clearance" },
  { name: "David Mugabo", id: "AUCA-2024-0055", program: "BSc Computer Science", gpa: 2.85, status: "Pending Clearance" },
];

const teachingProgress = [
  { lecturer: "Dr. Sarah Mugisha", course: "CS301", sessions: "16/28", pct: 57, status: "On Track" },
  { lecturer: "Dr. Sarah Mugisha", course: "IT201", sessions: "14/28", pct: 50, status: "On Track" },
  { lecturer: "Prof. Agnes Ntamwiza", course: "CS401", sessions: "22/28", pct: 79, status: "Ahead" },
  { lecturer: "Dr. Jean B. Niyonzima", course: "ENG301", sessions: "8/28", pct: 29, status: "Behind" },
  { lecturer: "Mr. Patrick Mugisha", course: "IT101", sessions: "20/28", pct: 71, status: "On Track" },
];

const eligibilityList = [
  { course: "CS301", enrolled: 40, eligible: 36, ineligible: 4 },
  { course: "IT201", enrolled: 43, eligible: 41, ineligible: 2 },
  { course: "CS401", enrolled: 37, eligible: 32, ineligible: 5 },
  { course: "ENG301", enrolled: 41, eligible: 38, ineligible: 3 },
];

const statusColors: Record<string, string> = {
  Eligible: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  "Pending Clearance": "bg-amber-500/10 text-amber-600 border-amber-500/30",
  "On Track": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Ahead: "bg-primary/10 text-primary border-primary/30",
  Behind: "bg-red-500/10 text-red-600 border-red-500/30",
};

const HodReportsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Department Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Graduation lists, teaching progress, eligibility, and more.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <Tabs defaultValue="graduation" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="graduation" className="gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> Graduation
            </TabsTrigger>
            <TabsTrigger value="teaching" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" /> Teaching Progress
            </TabsTrigger>
            <TabsTrigger value="eligibility" className="gap-1.5">
              <Users className="h-3.5 w-3.5" /> Eligibility
            </TabsTrigger>
          </TabsList>

          {/* Graduation List */}
          <TabsContent value="graduation">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">2025 Graduation List</CardTitle>
                <CardDescription>{graduationList.length} students in Information Technology department</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">ID</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Program</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">GPA</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {graduationList.map((student, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm font-medium text-foreground">{student.name}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{student.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{student.program}</TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">{student.gpa.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] ${statusColors[student.status]}`}>
                            {student.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teaching Progress */}
          <TabsContent value="teaching">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Teaching Progress Report</CardTitle>
                <CardDescription>Semester 2025-S1 — sessions logged vs required</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Lecturer</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Sessions</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Coverage</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachingProgress.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm font-medium text-foreground">{row.lecturer}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-semibold">{row.course}</Badge>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{row.sessions}</TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">{row.pct}%</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] ${statusColors[row.status]}`}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eligibility */}
          <TabsContent value="eligibility">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Exam Eligibility Lists</CardTitle>
                <CardDescription>Students eligible for final examinations</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Enrolled</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Eligible</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Ineligible</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibilityList.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-semibold">{row.course}</Badge>
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">{row.enrolled}</TableCell>
                        <TableCell className="text-sm text-emerald-600 font-semibold">{row.eligible}</TableCell>
                        <TableCell className="text-sm text-red-600 font-semibold">{row.ineligible}</TableCell>
                        <TableCell className="text-right text-sm font-mono text-foreground">
                          {Math.round((row.eligible / row.enrolled) * 100)}%
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

export default HodReportsPage;
