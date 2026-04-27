import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload, FileText, GraduationCap, CreditCard, Briefcase, CheckCircle,
  FileUp, Info, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

type DocCategory = "academic" | "financial" | "internship" | "clearance";

const docTypes: Record<DocCategory, { label: string; icon: React.ElementType; types: { value: string; label: string; required: string[] }[] }> = {
  academic: {
    label: "Academic Records",
    icon: GraduationCap,
    types: [
      { value: "transcript", label: "Official Transcript", required: ["Student name", "Course list", "Grades", "GPA", "Official stamp"] },
      { value: "registration_form", label: "Semester Registration Form", required: ["Semester", "Course list", "Registration details"] },
      { value: "attendance_form", label: "Attendance Form per Exam", required: ["Course code", "Date", "Student list"] },
    ],
  },
  financial: {
    label: "Financial Documents",
    icon: CreditCard,
    types: [
      { value: "tuition_receipt", label: "Tuition Payment Receipt", required: ["Amount", "Date", "Student ID", "Payment reference"] },
      { value: "financial_clearance", label: "Financial Clearance Form", required: ["Finance section", "Approval stamps", "Signature"] },
    ],
  },
  internship: {
    label: "Internship Records",
    icon: Briefcase,
    types: [
      { value: "internship_letter", label: "Internship Acceptance Letter", required: ["Company name", "Position", "Start date", "Supervisor"] },
      { value: "internship_logbook", label: "Internship Logbook", required: ["Daily entries", "Supervisor sign-off", "Date range"] },
      { value: "internship_report", label: "Final Internship Report", required: ["Abstract", "Company info", "Tasks", "Evaluation"] },
    ],
  },
  clearance: {
    label: "Clearance Documents",
    icon: CheckCircle,
    types: [
      { value: "clearance_form", label: "Graduation Clearance Form", required: ["Finance section", "Library section", "Department section", "Min 3 stamps/signatures"] },
    ],
  },
};

const semesters = ["2025-S1", "2024-S2", "2024-S1", "2023-S2", "2023-S1"];

const SubmitDocumentPage = () => {
  const [category, setCategory] = useState<DocCategory | "">("");
  const [docType, setDocType] = useState("");
  const [semester, setSemester] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const selectedType = category
    ? docTypes[category as DocCategory]?.types.find((t) => t.value === docType)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !docType || !semester || !file) {
      toast.error("Please fill in all required fields and select a file.");
      return;
    }
    toast.success("Document submitted successfully!", {
      description: `Your ${selectedType?.label} has been uploaded and queued for verification.`,
    });
    // Reset
    setCategory("");
    setDocType("");
    setSemester("");
    setTitle("");
    setNotes("");
    setFile(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Upload Academic Document</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit your academic records for verification and archiving.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category selection */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-heading">Document Category</CardTitle>
              <CardDescription>Choose the type of document you're uploading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.entries(docTypes) as [DocCategory, typeof docTypes[DocCategory]][]).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setCategory(key); setDocType(""); }}
                    className={`rounded-lg border-2 p-3 text-left transition-all hover:border-primary/40 ${
                      category === key ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <config.icon className={`h-6 w-6 mb-2 ${category === key ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="text-sm font-semibold text-foreground">{config.label}</p>
                    <p className="text-[10px] text-muted-foreground">{config.types.length} types</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document type + semester */}
          {category && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider">Document Type *</Label>
                    <Select value={docType} onValueChange={setDocType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {docTypes[category as DocCategory].types.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider">Semester *</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester..." />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider">Title</Label>
                  <Input
                    placeholder="e.g. Official Transcript — 2024–2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider">Additional Notes</Label>
                  <Textarea
                    placeholder="Any additional context..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Required elements info */}
          {selectedType && (
            <Card className="border-border shadow-sm border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Required elements for {selectedType.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      The system will automatically verify your document contains these elements:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedType.required.map((r) => (
                        <Badge key={r} variant="outline" className="text-[10px]">{r}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File upload */}
          {category && docType && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Upload File</CardTitle>
                <CardDescription>Supported formats: PDF, JPG, PNG (max 20MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/30">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  {file ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-3">
                        Drag & drop your file here, or click to browse
                      </p>
                      <label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <Button type="button" variant="outline" className="gap-2" asChild>
                          <span>
                            <FileUp className="h-4 w-4" /> Choose File
                          </span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>

                {/* Verification note */}
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    After upload, your document will be automatically analyzed using OCR to verify its type, check for required stamps/signatures, and validate required elements. You'll be notified of the verification result.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          {category && docType && (
            <div className="flex justify-end">
              <Button type="submit" className="gap-2 px-8" disabled={!file}>
                <Upload className="h-4 w-4" /> Submit Document
              </Button>
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  );
};

export default SubmitDocumentPage;
