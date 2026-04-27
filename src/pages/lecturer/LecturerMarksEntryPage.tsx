import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const studentMarks = [
  { id: "s1", name: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", cat: 34, exam: 52, total: 86, grade: "A" },
  { id: "s2", name: "Grace Uwimana", campusId: "AUCA-2022-0289", cat: 38, exam: 58, total: 96, grade: "A+" },
  { id: "s3", name: "Eric Habimana", campusId: "AUCA-2023-0198", cat: 22, exam: 35, total: 57, grade: "C" },
  { id: "s4", name: "Marie Claire N.", campusId: "AUCA-2023-0199", cat: 30, exam: 45, total: 75, grade: "B+" },
  { id: "s5", name: "Patrick Kubwimana", campusId: "AUCA-2023-0200", cat: null, exam: null, total: null, grade: "—" },
];

const evaluationReports = [
  { id: "r1", course: "CS301", title: "Mid-Semester Evaluation Report", status: "Submitted", date: "Mar 25, 2025" },
  { id: "r2", course: "IT201", title: "Final Course Evaluation Report", status: "Draft", date: "—" },
];

const LecturerMarksEntryPage = () => {
  const handleSaveMarks = () => {
    toast.success("Marks saved successfully", { description: "You can continue editing until final submission." });
  };

  const handleSubmitToHod = () => {
    toast.success("Marks submitted to HOD", { description: "Verification pending." });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Marks & Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter continuous assessment (CAT) and final exam marks. Generate evaluation reports.
          </p>
        </div>

        <Tabs defaultValue="marks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="marks">Student Marks Entry</TabsTrigger>
            <TabsTrigger value="evaluations">Evaluation Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="marks">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-heading">CS301 — Software Engineering</CardTitle>
                    <CardDescription>Max CAT: 40 | Max Exam: 60 | Total: 100</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSaveMarks}>Save Draft</Button>
                    <Button size="sm" onClick={handleSubmitToHod}>Submit to HOD</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                      <TableHead className="w-24 text-[11px] uppercase tracking-wider text-center">CAT (/40)</TableHead>
                      <TableHead className="w-24 text-[11px] uppercase tracking-wider text-center">Exam (/60)</TableHead>
                      <TableHead className="text-center text-[11px] uppercase tracking-wider">Total</TableHead>
                      <TableHead className="text-center text-[11px] uppercase tracking-wider">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentMarks.map(s => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <p className="text-xs font-semibold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.campusId}</p>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            className="h-8 text-xs text-center font-mono" 
                            defaultValue={s.cat ?? ""} 
                            placeholder="-"
                            max={40}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            className="h-8 text-xs text-center font-mono" 
                            defaultValue={s.exam ?? ""} 
                            placeholder="-"
                            max={60}
                          />
                        </TableCell>
                        <TableCell className="text-center text-sm font-mono font-bold">
                          {s.total ?? "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`text-[10px] ${
                            s.grade.startsWith("A") ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                            s.grade.startsWith("B") ? "bg-blue-50 text-blue-700 border-blue-300" :
                            s.grade.startsWith("C") ? "bg-amber-50 text-amber-700 border-amber-300" :
                            s.grade === "—" ? "bg-slate-50 text-slate-500" :
                            "bg-red-50 text-red-700 border-red-300"
                          }`}>
                            {s.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluations">
            <div className="flex justify-end mb-3">
              <Button size="sm">Create New Report</Button>
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Report Title</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-center text-[11px] uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationReports.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs font-semibold text-foreground">{r.course}</TableCell>
                        <TableCell className="text-xs text-foreground">{r.title}</TableCell>
                        <TableCell className="text-[10px] text-muted-foreground">{r.date}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`text-[10px] ${r.status === "Submitted" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-slate-100 text-slate-700"}`}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            {r.status === "Draft" ? "Edit" : "View"}
                          </Button>
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

export default LecturerMarksEntryPage;
