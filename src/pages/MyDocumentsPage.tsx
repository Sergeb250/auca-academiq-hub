import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Upload, GraduationCap, CreditCard, Briefcase, BookOpen,
  CheckCircle, Clock, XCircle, AlertTriangle, Eye, Download, FileScan,
} from "lucide-react";
import { academicRecords, documentVerifications } from "@/data/academic-records";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type RecordCategory = "all" | "academic" | "financial" | "internship" | "clearance";

const categoryConfig: Record<RecordCategory, { label: string; icon: React.ElementType; types: string[] }> = {
  all: { label: "All Documents", icon: FileText, types: [] },
  academic: { label: "Academic", icon: GraduationCap, types: ["transcript", "registration_form", "attendance_form"] },
  financial: { label: "Financial", icon: CreditCard, types: ["tuition_receipt", "financial_clearance"] },
  internship: { label: "Internship", icon: Briefcase, types: ["internship_letter", "internship_logbook", "internship_report"] },
  clearance: { label: "Clearance", icon: BookOpen, types: ["clearance_form"] },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  verified: { label: "Verified", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  pending_verification: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/30" },
  uploaded: { label: "Uploaded", icon: FileText, className: "bg-primary/10 text-primary border-primary/30" },
};

const typeLabels: Record<string, string> = {
  transcript: "Official Transcript",
  registration_form: "Registration Form",
  attendance_form: "Attendance Form",
  clearance_form: "Clearance Form",
  tuition_receipt: "Tuition Receipt",
  financial_clearance: "Financial Clearance",
  internship_letter: "Internship Acceptance",
  internship_logbook: "Internship Logbook",
  internship_report: "Internship Report",
};

const MyDocumentsPage = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState<RecordCategory>("all");
  const [verificationDialog, setVerificationDialog] = useState<string | null>(null);

  const myRecords = academicRecords.filter((r) => r.studentId === user?.id);
  const filtered = category === "all"
    ? myRecords
    : myRecords.filter((r) => categoryConfig[category].types.includes(r.type));

  const verified = myRecords.filter((r) => r.status === "verified").length;
  const pending = myRecords.filter((r) => r.status === "pending_verification").length;
  const rejected = myRecords.filter((r) => r.status === "rejected").length;
  const completionPct = myRecords.length > 0 ? Math.round((verified / myRecords.length) * 100) : 0;

  const selectedV = verificationDialog
    ? documentVerifications.find((v) => v.documentId === verificationDialog)
    : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">My Academic Documents</h1>
            <p className="text-sm text-muted-foreground mt-1">
              All your academic records, financial documents, and internship files in one place.
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">{myRecords.length}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Docs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">{verified}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">{pending}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Completion</span>
                  <span className="text-xs font-bold text-foreground">{completionPct}%</span>
                </div>
                <Progress value={completionPct} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category tabs */}
        <Tabs value={category} onValueChange={(v) => setCategory(v as RecordCategory)}>
          <TabsList className="flex-wrap">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="gap-1.5">
                <config.icon className="h-3.5 w-3.5" />
                {config.label}
                {key !== "all" && (
                  <Badge variant="secondary" className="text-[10px] ml-1">
                    {key === "all" ? myRecords.length : myRecords.filter((r) => config.types.includes(r.type)).length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Documents table */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-0 p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Document</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Semester</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Size</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No documents in this category
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rec) => {
                    const st = statusConfig[rec.status];
                    const StIcon = st.icon;
                    const hasVerification = documentVerifications.some((v) => v.documentId === rec.id);
                    return (
                      <TableRow key={rec.id} className="hover:bg-accent/40">
                        <TableCell className="text-sm font-medium text-foreground max-w-[300px] truncate">
                          {rec.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            {typeLabels[rec.type] ?? rec.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{rec.semester}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{rec.fileSize}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                            <StIcon className="mr-1 h-3 w-3" />
                            {st.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {hasVerification && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setVerificationDialog(rec.id)}
                              >
                                <FileScan className="h-3 w-3 mr-1" /> Verify
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <Eye className="h-3 w-3 mr-1" /> View
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Verification result dialog */}
        <Dialog open={!!verificationDialog} onOpenChange={() => setVerificationDialog(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileScan className="h-5 w-5 text-primary" />
                Document Verification Report
              </DialogTitle>
              <DialogDescription>
                Automated analysis of "{selectedV?.fileName}"
              </DialogDescription>
            </DialogHeader>

            {selectedV && (
              <div className="mt-4 space-y-5">
                {/* Classification */}
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Detected Document Type</span>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {selectedV.detectedType ?? "Unknown"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Classification confidence</span>
                      <span className="font-bold text-foreground">{selectedV.confidence}%</span>
                    </div>
                    <Progress
                      value={selectedV.confidence}
                      className={`h-2 ${selectedV.confidence < 60 ? "[&>div]:bg-red-500" : selectedV.confidence < 80 ? "[&>div]:bg-amber-500" : ""}`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedV.keywordsFound.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-[10px]">{kw}</Badge>
                    ))}
                  </div>
                </div>

                {/* Required elements */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <span className="text-sm font-semibold text-foreground">Required Elements Check</span>
                  <div className="space-y-1.5">
                    {selectedV.requiredElements.map((el) => (
                      <div key={el.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{el.label}</span>
                        {el.found ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                            <CheckCircle className="mr-1 h-3 w-3" /> Found
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/30">
                            <XCircle className="mr-1 h-3 w-3" /> Missing
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stamp & Signature */}
                <div className="flex gap-4">
                  <div className="flex-1 rounded-lg border border-border p-3 text-center">
                    <p className="text-2xl font-heading font-bold text-foreground">{selectedV.stampCount}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Stamps detected</p>
                  </div>
                  <div className="flex-1 rounded-lg border border-border p-3 text-center">
                    {selectedV.signatureDetected ? (
                      <>
                        <CheckCircle className="h-7 w-7 mx-auto text-emerald-600" />
                        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 mt-1">Signature found</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-7 w-7 mx-auto text-red-500" />
                        <p className="text-[10px] font-medium uppercase tracking-wider text-red-500 mt-1">No signature</p>
                      </>
                    )}
                  </div>
                </div>

                {/* OCR extracted text preview */}
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <span className="text-sm font-semibold text-foreground">OCR Text Preview</span>
                  <p className="rounded-md bg-muted/50 p-3 text-xs font-mono leading-relaxed text-muted-foreground">
                    {selectedV.ocrText}
                  </p>
                </div>

                {/* Outcome */}
                <div className={`rounded-lg p-4 text-center ${
                  selectedV.status === "verified" ? "bg-emerald-50 border border-emerald-200" :
                  selectedV.status === "partial" ? "bg-amber-50 border border-amber-200" :
                  "bg-red-50 border border-red-200"
                }`}>
                  {selectedV.status === "verified" && (
                    <p className="text-sm font-semibold text-emerald-700">✅ Document fully verified — all requirements met</p>
                  )}
                  {selectedV.status === "partial" && (
                    <p className="text-sm font-semibold text-amber-700">⚠️ Partial verification — some required elements missing</p>
                  )}
                  {selectedV.status === "failed" && (
                    <p className="text-sm font-semibold text-red-700">❌ Verification failed — document does not meet requirements</p>
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

export default MyDocumentsPage;
