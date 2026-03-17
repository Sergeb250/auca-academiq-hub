import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, Github, X, FileText, Sparkles, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthorProfileCard } from "@/components/AuthorProfileCard";

const SubmitProjectPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("2025");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");

  // Step 2
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  // Step 3
  const [githubConnected, setGithubConnected] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [markedFinal, setMarkedFinal] = useState(false);

  const addKeyword = () => { if (keywordInput.trim() && keywords.length < 10) { setKeywords([...keywords, keywordInput.trim()]); setKeywordInput(""); } };
  const addTech = () => { if (techInput.trim() && technologies.length < 10) { setTechnologies([...technologies, techInput.trim()]); setTechInput(""); } };

  const simulateUpload = () => {
    setFileName("Final_Year_Project_Report.pdf");
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); setUploaded(true); return 100; }
        return prev + 20;
      });
    }, 300);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Project Submitted!", description: "Your project has been submitted for review. You'll be notified once it's approved." });
      navigate("/my-submissions");
    }, 1500);
  };

  const steps = [
    { num: 1, label: "Project Metadata" },
    { num: 2, label: "Memoir Upload" },
    { num: 3, label: "GitHub Repository" },
  ];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Submit New Project</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step > s.num ? "bg-success text-success-foreground" : step === s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-sm ${step === s.num ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step > s.num ? "bg-success" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
            {/* Author Profile - auto-populated from logged-in account */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Author (Linked Account)</Label>
              {user && (
                <AuthorProfileCard
                  author={{
                    name: user.name,
                    initials: user.avatarInitials,
                    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
                    email: user.email,
                    department: user.department,
                    campusId: user.campusId,
                    year: user.year,
                  }}
                />
              )}
              <p className="text-xs text-muted-foreground">This profile will be displayed on your project's public page.</p>
            </div>
            <div className="space-y-2">
              <Label>Project Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your project title" />
            </div>
            <div className="space-y-2">
              <Label>Abstract *</Label>
              <Textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Write a detailed abstract..." rows={5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="eng">Engineering</SelectItem>
                    <SelectItem value="bus">Business Administration</SelectItem>
                    <SelectItem value="eco">Economics</SelectItem>
                    <SelectItem value="edu">Education</SelectItem>
                    <SelectItem value="theo">Theology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software System</SelectItem>
                    <SelectItem value="research">Research Study</SelectItem>
                    <SelectItem value="data">Data Analysis</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())} placeholder="Add keyword and press Enter" />
                <Button type="button" variant="outline" onClick={addKeyword}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {keywords.map((k) => (
                  <Badge key={k} variant="outline" className="gap-1 bg-primary/5 text-primary">
                    {k} <X className="w-3 h-3 cursor-pointer" onClick={() => setKeywords(keywords.filter((x) => x !== k))} />
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Technology Stack</Label>
              <div className="flex gap-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="Add technology and press Enter" />
                <Button type="button" variant="outline" onClick={addTech}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {technologies.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t} <X className="w-3 h-3 cursor-pointer" onClick={() => setTechnologies(technologies.filter((x) => x !== t))} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 bg-ai/5 border border-ai/20 rounded-lg flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="text-muted-foreground">AcademIQ found <strong className="text-foreground">2 similar projects</strong> — review before submitting to avoid duplication.</span>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!title || !abstract}>Next: Memoir Upload</Button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
            {!uploaded ? (
              <div
                className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={simulateUpload}
              >
                <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Click to upload your memoir (PDF)</p>
                <p className="text-xs text-muted-foreground mt-1">PDF only, max 50MB</p>
              </div>
            ) : null}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{fileName}</span>
                  <span className="text-primary font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploaded && (
              <div className="border border-success/30 bg-success/5 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground mt-1">78 pages · 4.2 MB · SHA-256: a1b2c3d4e5f6...</p>
                    <p className="text-xs text-success mt-1">✓ Malware scan passed</p>
                  </div>
                </div>
                <div className="mt-4 w-32 h-40 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!uploaded}>Next: GitHub Repository</Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
            {!githubConnected ? (
              <div className="text-center py-8">
                <Github className="w-10 h-10 text-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Connect your GitHub account to link your repository</p>
                <Button onClick={() => setGithubConnected(true)} className="gap-2">
                  <Github className="w-4 h-4" /> Connect GitHub
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-success/5 border border-success/20 rounded-lg flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-foreground">GitHub connected as <strong>jpierre-auca</strong></span>
                </div>

                <div className="space-y-2">
                  <Label>Select Repository</Label>
                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger><SelectValue placeholder="Choose a repository" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart-parking-iot">smart-parking-iot (public)</SelectItem>
                      <SelectItem value="crop-disease-ml">crop-disease-ml (public)</SelectItem>
                      <SelectItem value="my-project">my-final-year-project (private)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRepo && (
                  <>
                    <div className="space-y-2">
                      <Label>Final Commit / Tag</Label>
                      <Select defaultValue="latest">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">a3f8b2c — "Final submission version" (2 days ago)</SelectItem>
                          <SelectItem value="prev1">b1c2d3e — "Fix auth bug" (5 days ago)</SelectItem>
                          <SelectItem value="prev2">c4d5e6f — "Add unit tests" (1 week ago)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="final" checked={markedFinal} onChange={(e) => setMarkedFinal(e.target.checked)} className="rounded" />
                      <Label htmlFor="final" className="text-sm font-normal">Mark as Final Version</Label>
                    </div>
                  </>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground italic">Draft saved 2 minutes ago</p>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit for Review"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SubmitProjectPage;
