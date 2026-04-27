import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

const projects = [
  { id: "p1", student: "Grace Uwimana", title: "Machine Learning for Crop Disease Detection", supervisor: "Dr. Sarah Mugisha", progress: 95, status: "Ready for Defense", semester: "2025-S1" },
  { id: "p2", student: "Eric Habimana", title: "Blockchain-Based Land Registry for Rwanda", supervisor: "Dr. Sarah Mugisha", progress: 78, status: "Final Draft", semester: "2025-S1" },
  { id: "p3", student: "Marie Claire N.", title: "E-Commerce Platform for Local Artisans", supervisor: "Unassigned", progress: 65, status: "Needs Supervisor", semester: "2025-S1" },
  { id: "p4", student: "Patrick Kubwimana", title: "Water Quality Monitoring System", supervisor: "Unassigned", progress: 52, status: "Needs Supervisor", semester: "2025-S1" },
  { id: "p5", student: "David Mugabo", title: "Solar Energy Management Dashboard", supervisor: "Prof. Agnes Ntamwiza", progress: 88, status: "Revision", semester: "2025-S1" },
  { id: "p6", student: "Claudine Ingabire", title: "Rwanda Tourism Recommendation Engine", supervisor: "Dr. Jean B. Niyonzima", progress: 40, status: "Research Phase", semester: "2025-S1" },
  { id: "p7", student: "Jean Paul H.", title: "Kinyarwanda NLP Text Classifier", supervisor: "Unassigned", progress: 30, status: "Needs Supervisor", semester: "2025-S1" },
  { id: "p8", student: "Joseph Nsengimana", title: "Mobile Health Tracking Application", supervisor: "Dr. Sarah Mugisha", progress: 72, status: "Development", semester: "2025-S1" },
];

const lecturers = [
  { id: "u2", name: "Dr. Sarah Mugisha", currentLoad: 4 },
  { id: "u9", name: "Prof. Agnes Ntamwiza", currentLoad: 1 },
  { id: "u10", name: "Dr. Jean B. Niyonzima", currentLoad: 1 },
  { id: "u11", name: "Mr. Patrick Mugisha", currentLoad: 0 },
  { id: "u12", name: "Dr. Celestin Hakizimana", currentLoad: 2 },
];

const HodProjectSupervisionPage = () => {
  const [assignDialog, setAssignDialog] = useState<string | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState("");

  const unassigned = projects.filter(p => p.supervisor === "Unassigned").length;
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Project Supervision</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Assign supervisors to student projects and track progress across the department.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Projects", value: projects.length },
            { label: "Needs Supervisor", value: unassigned, highlight: unassigned > 0 },
            { label: "Average Progress", value: `${avgProgress}%` },
            { label: "Ready for Defense", value: projects.filter(p => p.status === "Ready for Defense").length },
          ].map(s => (
            <Card key={s.label} className={`border-border shadow-sm text-center ${s.highlight ? "ring-1 ring-amber-300/50" : ""}`}>
              <CardContent className="p-4">
                <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lecturer load */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Lecturer Supervision Load</CardTitle>
            <CardDescription>Current project assignments per lecturer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {lecturers.map(l => (
              <div key={l.id} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                  {l.name.split(" ").pop()?.[0]}{l.name.split(" ")[0][0] === "D" || l.name.split(" ")[0][0] === "P" || l.name.split(" ")[0][0] === "M" ? l.name.split(" ")[0][0] : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{l.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{l.currentLoad} students</span>
                  </div>
                  <Progress value={Math.min((l.currentLoad / 5) * 100, 100)} className={`h-1.5 mt-1 ${l.currentLoad >= 4 ? "[&>div]:bg-amber-500" : ""}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Student Projects — 2025-S1</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Project Title</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Supervisor</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Progress</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map(p => (
                  <TableRow key={p.id} className={p.supervisor === "Unassigned" ? "bg-amber-50/40" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                          {p.student.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{p.student}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-foreground max-w-[200px] truncate">{p.title}</TableCell>
                    <TableCell>
                      {p.supervisor === "Unassigned" ? (
                        <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-400/30">Unassigned</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{p.supervisor}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="w-20 space-y-0.5">
                        <span className="text-[10px] font-mono font-bold">{p.progress}%</span>
                        <Progress value={p.progress} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.supervisor === "Unassigned" ? (
                        <Button size="sm" className="h-7 text-xs" onClick={() => { setAssignDialog(p.id); setSelectedLecturer(""); }}>
                          Assign Supervisor
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setAssignDialog(p.id); setSelectedLecturer(""); }}>
                          Reassign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Assign dialog */}
        <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Assign Project Supervisor</DialogTitle>
              <DialogDescription>
                {projects.find(p => p.id === assignDialog)?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Select Lecturer</Label>
                <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a lecturer..." /></SelectTrigger>
                  <SelectContent>
                    {lecturers.map(l => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name} ({l.currentLoad} current students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAssignDialog(null)}>Cancel</Button>
                <Button onClick={() => {
                  const lec = lecturers.find(l => l.id === selectedLecturer);
                  toast.success(`Supervisor assigned: ${lec?.name ?? ""}`, { description: "Notification sent to lecturer" });
                  setAssignDialog(null);
                }} disabled={!selectedLecturer}>
                  Assign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default HodProjectSupervisionPage;
