import { useState, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle, XCircle, AlertTriangle, Upload, FileScan, FileText,
  Stamp, Signature, Eye, Loader2,
} from "lucide-react";
import { documentVerifications } from "@/data/academic-records";
import type { DocumentVerification, VerificationStatus } from "@/types";

const statusConfig: Record<VerificationStatus, { label: string; className: string; icon: React.ElementType }> = {
  verified: { label: "Verified", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle },
  partial: { label: "Partial", className: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: AlertTriangle },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-600 border-red-500/30", icon: XCircle },
  pending: { label: "Pending", className: "bg-primary/10 text-primary border-primary/30", icon: Loader2 },
};

/* Simulated OCR keywords for classification */
const classificationRules = [
  { type: "Official Transcript", keywords: ["transcript", "grades", "gpa", "credit hours"] },
  { type: "Registration Form", keywords: ["registration", "courses", "semester", "department"] },
  { type: "Clearance Form", keywords: ["clearance", "finance", "library", "department"] },
  { type: "Tuition Receipt", keywords: ["payment", "tuition", "receipt", "amount", "rwf"] },
  { type: "Internship Report", keywords: ["internship", "company", "supervisor", "logbook"] },
];

const DocumentVerificationPage = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentVerification | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DocumentVerification | null>(null);

  const handleSimulate = useCallback(() => {
    setSimulating(true);
    // Simulate OCR + classification process
    setTimeout(() => {
      const mockResult: DocumentVerification = {
        id: "sim-1",
        documentId: "sim-doc",
        fileName: "uploaded_document.pdf",
        uploadedBy: "System Demo",
        uploadDate: new Date().toISOString().slice(0, 10),
        detectedType: "Registration Form",
        confidence: 87,
        status: "partial",
        keywordsFound: ["Registration", "Semester", "Courses", "Department"],
        requiredElements: [
          { label: "Semester", found: true },
          { label: "Course List", found: true },
          { label: "Registration Details", found: true },
          { label: "Student Signature", found: true },
          { label: "Department Approval", found: false },
        ],
        stampCount: 1,
        signatureDetected: true,
        ocrText: "SEMESTER REGISTRATION FORM ... Academic Year 2025-2026 ... Semester: 1 ... Department: IT ... Student: Demo User ... Courses: CS301, IT201 ...",
      };
      setSimulationResult(mockResult);
      setSimulating(false);
    }, 2500);
  }, []);

  const currentDoc = selectedDoc ?? simulationResult;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Document Verification System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Automated document classification, OCR analysis, stamp/signature detection.
            </p>
          </div>
          <Button className="gap-2" onClick={handleSimulate} disabled={simulating}>
            {simulating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><FileScan className="h-4 w-4" /> Simulate Upload</>
            )}
          </Button>
        </div>

        {/* Processing pipeline */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch divide-x divide-border">
              {[
                { step: 1, label: "Upload", desc: "PDF/Image file", icon: Upload, color: "bg-primary/10 text-primary" },
                { step: 2, label: "OCR Extract", desc: "Text recognition", icon: FileText, color: "bg-violet-500/10 text-violet-600" },
                { step: 3, label: "Classify", desc: "Keyword analysis", icon: FileScan, color: "bg-amber-500/10 text-amber-600" },
                { step: 4, label: "Validate", desc: "Required elements", icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600" },
              ].map((s) => (
                <div key={s.step} className="flex-1 flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Step {s.step}</p>
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Verification results list */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Recent Verifications</CardTitle>
              <CardDescription>{documentVerifications.length} documents processed</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {[...documentVerifications, ...(simulationResult ? [simulationResult] : [])].map((v) => {
                  const st = statusConfig[v.status];
                  const StIcon = st.icon;
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedDoc(v); setSimulationResult(null); }}
                      className={`w-full text-left rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-accent/40 ${
                        currentDoc?.id === v.id ? "border-primary/50 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{v.fileName}</p>
                        <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                          <StIcon className="mr-1 h-3 w-3" /> {st.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px]">{v.detectedType ?? "Unknown"}</Badge>
                        <span className="text-[10px] text-muted-foreground">{v.confidence}% confidence</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detail panel */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Verification Detail</CardTitle>
            </CardHeader>
            <CardContent>
              {!currentDoc ? (
                <div className="py-16 text-center text-muted-foreground">
                  <FileScan className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a document or click "Simulate Upload"</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Classification */}
                  <div className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Document Type</span>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {currentDoc.detectedType ?? "Unknown"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-bold">{currentDoc.confidence}%</span>
                      </div>
                      <Progress
                        value={currentDoc.confidence}
                        className={`h-2 ${currentDoc.confidence < 60 ? "[&>div]:bg-red-500" : currentDoc.confidence < 80 ? "[&>div]:bg-amber-500" : ""}`}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentDoc.keywordsFound.map((kw) => (
                        <Badge key={kw} variant="secondary" className="text-[10px]">{kw}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Required elements */}
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <span className="text-sm font-semibold text-foreground">Required Elements</span>
                    {currentDoc.requiredElements.map((el) => (
                      <div key={el.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{el.label}</span>
                        {el.found ? (
                          <span className="text-emerald-600 text-xs font-semibold">✓ Found</span>
                        ) : (
                          <span className="text-red-600 text-xs font-semibold">✗ Missing</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Stamp & Signature */}
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
                      <Stamp className="h-6 w-6 mx-auto text-primary" />
                      <p className="text-lg font-heading font-bold text-foreground">{currentDoc.stampCount}</p>
                      <p className="text-[10px] font-medium uppercase text-muted-foreground">Stamps</p>
                    </div>
                    <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
                      {currentDoc.signatureDetected ? (
                        <CheckCircle className="h-6 w-6 mx-auto text-emerald-600" />
                      ) : (
                        <XCircle className="h-6 w-6 mx-auto text-red-500" />
                      )}
                      <p className="text-sm font-semibold text-foreground">
                        {currentDoc.signatureDetected ? "Detected" : "Not Found"}
                      </p>
                      <p className="text-[10px] font-medium uppercase text-muted-foreground">Signature</p>
                    </div>
                  </div>

                  {/* OCR Text */}
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <span className="text-sm font-semibold text-foreground">OCR Text Preview</span>
                    <p className="bg-muted/50 p-3 rounded-md text-xs font-mono leading-relaxed text-muted-foreground">
                      {currentDoc.ocrText}
                    </p>
                  </div>

                  {/* Classification rules reference */}
                  <div className="rounded-lg border border-dashed border-border p-4 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Classification Rules</span>
                    <div className="space-y-1">
                      {classificationRules.map((rule) => (
                        <div key={rule.type} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[9px] w-[130px] justify-center">{rule.type}</Badge>
                          <span className="font-mono text-[10px]">{rule.keywords.join(", ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentVerificationPage;
