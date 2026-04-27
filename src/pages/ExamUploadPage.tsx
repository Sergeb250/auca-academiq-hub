import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getExamPapersByLecturer, courseSyllabi } from "@/data/exam-papers";
import type { ExamPaper, TopicCoverageReport } from "@/data/exam-papers";
import { teachingLogEntries } from "@/data/teaching-log";

const statusLabels: Record<string, { label: string; className: string }> = {
  draft:                 { label: "Draft",              className: "bg-muted text-muted-foreground border-border" },
  topic_review:          { label: "Topic Review",       className: "bg-amber-500/10 text-amber-700 border-amber-400/30" },
  flagged:               { label: "Coverage Issue",     className: "bg-red-500/10 text-red-700 border-red-400/30" },
  cleared:               { label: "Cleared",            className: "bg-emerald-500/10 text-emerald-700 border-emerald-400/30" },
  submitted_to_office:   { label: "Sent to Exam Office",className: "bg-sky-500/10 text-sky-700 border-sky-400/30" },
  approved_by_hod:       { label: "HOD Approved",       className: "bg-emerald-600/10 text-emerald-700 border-emerald-500/30" },
  rejected:              { label: "Rejected",           className: "bg-red-600/10 text-red-700 border-red-500/30" },
};

const ExamUploadPage = () => {
  const { user } = useAuth();
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null);
  const [showReport, setShowReport] = useState(false);

  const papers = useMemo(() => getExamPapersByLecturer(user?.id ?? ""), [user?.id]);

  // Teaching log entries for the current lecturer
  const myLogEntries = useMemo(
    () => teachingLogEntries.filter((e) => e.lecturerId === (user?.id ?? "")),
    [user?.id]
  );

  // Group teaching log by course for quick overview
  const courseLogMap = useMemo(() => {
    const map: Record<string, { count: number; topics: string[] }> = {};
    myLogEntries.forEach((entry) => {
      if (!map[entry.courseCode]) map[entry.courseCode] = { count: 0, topics: [] };
      map[entry.courseCode].count++;
      map[entry.courseCode].topics.push(entry.topicsCovered);
    });
    return map;
  }, [myLogEntries]);

  const handleSubmitToOffice = (paper: ExamPaper) => {
    if (paper.coverageReport && paper.coverageReport.flagCount > 0) {
      toast.error("Cannot submit — coverage issues must be resolved", {
        description: `${paper.coverageReport.flagCount} topic(s) were not covered in your teaching log. Address them first or provide justification.`,
      });
      return;
    }
    toast.success("Exam paper forwarded to the Examination Office", {
      description: `${paper.courseCode} exam has been submitted for HOD review.`,
    });
  };

  const report = selectedPaper?.coverageReport;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">
            Exam Paper Upload and Topic Matching
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload exam papers for your courses. The system automatically verifies that
            every exam question is matched to topics you covered in your teaching log.
            Papers with coverage gaps are flagged before they reach the exam office.
          </p>
        </div>

        {/* Workflow step indicators */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-5 divide-x divide-border">
              {[
                { step: 1, title: "Upload Paper",     desc: "Submit exam questions" },
                { step: 2, title: "Topic Matching",    desc: "Auto-check vs teaching log" },
                { step: 3, title: "Coverage Review",   desc: "Resolve any gaps" },
                { step: 4, title: "Submit to Office",  desc: "Forward if cleared" },
                { step: 5, title: "HOD Approval",      desc: "Final validation" },
              ].map((s) => (
                <div key={s.step} className="p-4 text-center">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 text-sm font-bold text-primary">
                    {s.step}
                  </div>
                  <p className="text-xs font-semibold text-foreground">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="papers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="papers">My Exam Papers</TabsTrigger>
            <TabsTrigger value="upload">Upload New Paper</TabsTrigger>
            <TabsTrigger value="log-coverage">Teaching Log Coverage</TabsTrigger>
          </TabsList>

          {/* ─── Exam Papers Tab ─── */}
          <TabsContent value="papers">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">
                  Submitted Exam Papers
                </CardTitle>
                <CardDescription>
                  {papers.length} papers for {Object.keys(courseLogMap).length} courses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Duration</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Questions</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Coverage</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {papers.map((paper) => {
                      const st = statusLabels[paper.status];
                      const hasFlags = paper.coverageReport && paper.coverageReport.flagCount > 0;
                      return (
                        <TableRow key={paper.id} className={hasFlags ? "bg-red-50/40" : ""}>
                          <TableCell>
                            <div>
                              <span className="text-sm font-semibold text-foreground">{paper.courseCode}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{paper.courseName}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              Uploaded {paper.uploadDate}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{paper.duration}</TableCell>
                          <TableCell className="text-sm font-mono text-foreground">
                            {paper.questions.length} Qs / {paper.totalMarks} marks
                          </TableCell>
                          <TableCell>
                            {paper.coverageReport ? (
                              <div className="space-y-1 w-24">
                                <div className="flex justify-between text-[10px]">
                                  <span className={paper.coverageReport.coveragePct >= 80 ? "text-emerald-700" : "text-red-700"}>
                                    {paper.coverageReport.coveragePct}%
                                  </span>
                                  {paper.coverageReport.flagCount > 0 && (
                                    <span className="font-bold text-red-600">
                                      {paper.coverageReport.flagCount} flags
                                    </span>
                                  )}
                                </div>
                                <Progress
                                  value={paper.coverageReport.coveragePct}
                                  className={`h-1.5 ${paper.coverageReport.coveragePct < 80 ? "[&>div]:bg-red-500" : ""}`}
                                />
                              </div>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">Pending analysis</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                              {st.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => { setSelectedPaper(paper); setShowReport(true); }}
                              >
                                View Report
                              </Button>
                              {(paper.status === "cleared" || paper.status === "draft") && (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleSubmitToOffice(paper)}
                                >
                                  Submit
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Upload New Paper Tab ─── */}
          <TabsContent value="upload">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-heading">Upload New Exam Paper</CardTitle>
                <CardDescription>
                  Upload your exam paper as a PDF or fill in questions manually. The system
                  will automatically cross-reference your teaching log.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File upload zone */}
                <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Drag and drop your exam paper PDF here, or click to browse
                  </p>
                  <Button variant="outline">Choose File</Button>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    Accepted formats: PDF, DOCX (max 20 MB)
                  </p>
                </div>

                {/* What happens next */}
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">What happens after upload:</p>
                  <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1.5">
                    <li>The system extracts question text and identifies topic keywords</li>
                    <li>Each question is matched against your teaching log entries for this course</li>
                    <li>A coverage report is generated showing covered, uncovered, and partial topics</li>
                    <li>If all topics are covered, the paper is cleared for submission to the exam office</li>
                    <li>If gaps are found, you must either update your teaching log or modify the exam</li>
                  </ol>
                </div>

                {/* Course teaching log status */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Your teaching log status per course:</p>
                  {Object.entries(courseLogMap).map(([code, data]) => {
                    const syllabus = courseSyllabi.find((s) => s.courseCode === code);
                    const syllabusTopics = syllabus?.topics.length ?? 0;
                    const matchedCount = syllabus
                      ? syllabus.topics.filter((t) =>
                          data.topics.some((logged) => logged.toLowerCase().includes(t.toLowerCase().split(" ")[0]))
                        ).length
                      : 0;
                    const pct = syllabusTopics > 0 ? Math.round((matchedCount / syllabusTopics) * 100) : 0;
                    return (
                      <div key={code} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{code}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{data.count} sessions logged</span>
                          </div>
                          <span className={`text-xs font-bold ${pct >= 70 ? "text-emerald-700" : "text-amber-700"}`}>
                            {matchedCount}/{syllabusTopics} syllabus topics covered
                          </span>
                        </div>
                        <Progress value={pct} className={`h-1.5 ${pct < 70 ? "[&>div]:bg-amber-500" : ""}`} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Teaching Log Coverage Tab ─── */}
          <TabsContent value="log-coverage">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">
                  Teaching Log vs Syllabus Coverage
                </CardTitle>
                <CardDescription>
                  Topics you have covered in class, matched against the official course syllabus.
                  Uncovered topics will be flagged if they appear in your exam paper.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                {courseSyllabi
                  .filter((s) => courseLogMap[s.courseCode])
                  .map((syllabus) => {
                    const logged = courseLogMap[syllabus.courseCode]?.topics ?? [];
                    return (
                      <div key={syllabus.courseCode} className="rounded-lg border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            {syllabus.courseCode} — {syllabus.courseName}
                          </p>
                          <Badge variant="outline" className="text-[10px]">
                            {syllabus.topics.length} syllabus topics
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {syllabus.topics.map((topic) => {
                            const isCovered = logged.some((l) =>
                              l.toLowerCase().includes(topic.toLowerCase().split(" ")[0]) ||
                              topic.toLowerCase().includes(l.toLowerCase().split(" ")[0])
                            );
                            return (
                              <div
                                key={topic}
                                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
                                  isCovered
                                    ? "border-emerald-300/50 bg-emerald-50/50 text-emerald-800"
                                    : "border-red-300/50 bg-red-50/50 text-red-800"
                                }`}
                              >
                                <span className="font-semibold">{isCovered ? "COVERED" : "NOT COVERED"}</span>
                                <span className="text-foreground">{topic}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ─── Coverage Report Dialog ─── */}
        <Dialog open={showReport} onOpenChange={() => setShowReport(false)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Topic Coverage Report — {selectedPaper?.courseCode}
              </DialogTitle>
              <DialogDescription>
                {selectedPaper?.courseName} | {selectedPaper?.semester} | Uploaded {selectedPaper?.uploadDate}
              </DialogDescription>
            </DialogHeader>

            {selectedPaper && report && (
              <div className="mt-4 space-y-5">
                {/* Overall score */}
                <div className={`rounded-lg p-5 text-center ${
                  report.coveragePct >= 80
                    ? "bg-emerald-50 border border-emerald-200"
                    : report.coveragePct >= 60
                      ? "bg-amber-50 border border-amber-200"
                      : "bg-red-50 border border-red-200"
                }`}>
                  <p className="text-3xl font-heading font-bold text-foreground">{report.coveragePct}%</p>
                  <p className="text-sm text-muted-foreground mt-1">syllabus coverage in exam questions</p>
                  {report.flagCount > 0 && (
                    <p className="text-xs font-semibold text-red-700 mt-2">
                      {report.flagCount} topics flagged as not covered in teaching log
                    </p>
                  )}
                </div>

                {/* Questions breakdown */}
                <div className="rounded-lg border border-border">
                  <div className="p-3 border-b border-border bg-muted/30">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Question-by-Question Analysis
                    </p>
                  </div>
                  <div className="divide-y divide-border">
                    {selectedPaper.questions.map((q) => {
                      const covered = q.topicKeywords.every((kw) =>
                        report.coveredTopics.some((t) => t.toLowerCase().includes(kw.toLowerCase().split(" ")[0]) || kw.toLowerCase().includes(t.toLowerCase().split(" ")[0]))
                      );
                      const partial = !covered && q.topicKeywords.some((kw) =>
                        report.partialTopics.some((pt) => pt.topic.toLowerCase().includes(kw.toLowerCase().split(" ")[0]))
                      );
                      return (
                        <div key={q.number} className={`p-3 ${!covered && !partial ? "bg-red-50/50" : ""}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground">
                                <span className="font-bold mr-2">Q{q.number}</span>
                                ({q.marks} marks) {q.text}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {q.topicKeywords.map((kw) => {
                                  const kwCovered = report.coveredTopics.some((t) =>
                                    t.toLowerCase().includes(kw.toLowerCase().split(" ")[0]) || kw.toLowerCase().includes(t.toLowerCase().split(" ")[0])
                                  );
                                  return (
                                    <Badge
                                      key={kw}
                                      variant="outline"
                                      className={`text-[9px] ${kwCovered ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-red-50 text-red-700 border-red-300"}`}
                                    >
                                      {kwCovered ? "TAUGHT" : "NOT TAUGHT"}: {kw}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[10px] shrink-0 ${
                                covered ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                                partial ? "bg-amber-50 text-amber-700 border-amber-300" :
                                "bg-red-50 text-red-700 border-red-300"
                              }`}
                            >
                              {covered ? "Covered" : partial ? "Partial" : "Gap Found"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Uncovered topics list */}
                {report.uncoveredTopics.length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 space-y-2">
                    <p className="text-sm font-semibold text-red-800">
                      Topics NOT in Teaching Log
                    </p>
                    <p className="text-xs text-red-700">
                      The following topics appear in exam questions but were never covered in your
                      teaching log. You must either remove these questions, add the missing sessions
                      to your log, or provide written justification.
                    </p>
                    <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                      {report.uncoveredTopics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Partial coverage */}
                {report.partialTopics.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-2">
                    <p className="text-sm font-semibold text-amber-800">
                      Partially Covered Topics
                    </p>
                    {report.partialTopics.map((pt) => (
                      <div key={pt.topic} className="text-xs">
                        <span className="font-semibold text-amber-900">{pt.topic}:</span>{" "}
                        <span className="text-amber-700">{pt.reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3">
                  {report.flagCount > 0 ? (
                    <>
                      <Button variant="outline" onClick={() => setShowReport(false)}>
                        Close and Edit Paper
                      </Button>
                      <Button variant="outline" className="text-amber-700 border-amber-400">
                        Submit Justification
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setShowReport(false)}>
                        Close
                      </Button>
                      <Button onClick={() => { handleSubmitToOffice(selectedPaper); setShowReport(false); }}>
                        Forward to Exam Office
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ExamUploadPage;
