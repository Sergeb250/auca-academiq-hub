import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, Github, X, FileText, Lightbulb, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { AuthorProfileCard } from "@/components/AuthorProfileCard";
import { CoAuthorSearch } from "@/components/CoAuthorSearch";
import type { AuthorProfile } from "@/data/mockData";

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
  const [coAuthors, setCoAuthors] = useState<AuthorProfile[]>([]);

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
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-extrabold text-foreground uppercase tracking-[0.2em] italic relative inline-block">
           <span className="absolute bottom-1 left-[-5px] right-[-5px] h-[40%] bg-yellow-200/60 -z-10 rounded-sm -rotate-1"></span>
           Submit New Project
        </h1>

        {/* Stepper */}
        <Card className="flex items-center gap-4 p-4 shadow-[2px_2px_0_hsl(var(--primary)/0.12)] border-white/50 bg-white/30">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3 flex-1">
              <div className={`w-9 h-9 border-2 flex items-center justify-center text-[13px] font-extrabold font-mono transition-all ${
                step > s.num ? "bg-[#059669] text-white border-[#059669]" : step === s.num ? "border-primary bg-primary text-white" : "border-primary/20 bg-transparent text-muted-foreground"
              }`} style={{ borderRadius: '12px 4px 12px 4px' }}>
                {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-mono font-extrabold ${step === s.num ? "text-foreground" : "text-primary/60"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-[2px] ${step > s.num ? "bg-[#059669]" : "bg-primary/10"}`} />}
            </div>
          ))}
        </Card>

        {/* Step 1 */}
        {step === 1 && (
          <Card className="p-8 relative overflow-hidden space-y-8">
            {/* Author Profile - auto-populated from logged-in account */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-xs font-semibold text-primary">
                <User className="w-4 h-4" aria-hidden />
                Linked to your account
              </Label>
              {user && (
                <Card className="p-4 bg-white/40 shadow-sm border-border">
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
                </Card>
              )}
              <p className="text-xs text-muted-foreground">This section is visible only to you until you submit.</p>
            </div>

            {/* Co-Author Search */}
            <CoAuthorSearch
              coAuthors={coAuthors}
              onAdd={(author) => setCoAuthors((prev) => [...prev, author])}
              onRemove={(campusId) => setCoAuthors((prev) => prev.filter((a) => a.campusId !== campusId))}
              currentUserCampusId={user?.campusId}
            />
            <div className="space-y-4">
              <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Project Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ENTER_TITLE_HERE..." className="h-12 bg-white/40 border-2 border-border focus-visible:border-primary font-mono rounded-lg shadow-sm" />
            </div>
            <div className="space-y-4">
              <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Abstract *</Label>
              <Textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="WRITE_ABSTRACT_LEAD..." rows={6} className="bg-white/40 border-2 border-border focus-visible:border-primary font-mono rounded-lg shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Department *</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-white/40 border-2 border-border font-mono shadow-sm"><SelectValue placeholder="SELECT_DEPT..." /></SelectTrigger>
                  <SelectContent className="font-mono">
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
              <div className="space-y-4">
                <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white/40 border-2 border-border font-mono shadow-sm"><SelectValue placeholder="SELECT_CAT..." /></SelectTrigger>
                  <SelectContent className="font-mono">
                    <SelectItem value="software">Software System</SelectItem>
                    <SelectItem value="research">Research Study</SelectItem>
                    <SelectItem value="data">Data Analysis</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Technology Stack</Label>
              <div className="flex gap-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="ADD_TECH..." className="bg-white/40 border-2 border-border font-mono h-11 shadow-sm" />
                <Button type="button" variant="outline" onClick={addTech} className="border-2 border-border font-mono uppercase tracking-widest text-[11px] font-extrabold px-6 hover:bg-primary/10 hover:border-border">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {technologies.map((t) => (
                  <Badge key={t} className="bg-[#f5f3ff] text-[#7c3aed] border-2 border-[#7c3aed]/20 font-mono px-3 py-1 rounded-md">
                    {t} <X className="w-3 h-3 cursor-pointer ml-2" onClick={() => setTechnologies(technologies.filter((x) => x !== t))} />
                  </Badge>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-white/40 border-border flex items-start gap-3 text-sm shadow-sm">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
              <span className="text-muted-foreground leading-snug">
                Before you continue, browse the repository for existing work on your topic so your submission stays original and well grounded.
              </span>
            </Card>
 
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!title || !abstract} className="bg-primary hover:bg-primary/90 text-white font-mono font-extrabold uppercase tracking-widest px-8 py-6 rounded-lg text-[13px] border-2 border-white shadow-[4px_4px_0_hsl(var(--primary)/0.2)]">
                Next: Memoir Upload
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="p-8 relative overflow-hidden space-y-8">
            {!uploaded ? (
              <div
                className="border-4 border-dashed border-white/60 rounded-xl p-16 text-center cursor-pointer hover:bg-white/20 transition-all group"
                onClick={simulateUpload}
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-[14px] font-extrabold text-foreground uppercase tracking-widest font-mono">UPLOAD_MEMOIR_PDF</p>
                <p className="text-[10px] text-primary mt-2 font-mono">MAX_FILE_SIZE: 50MB // SYSTEM_VERIFIED_ONLY</p>
              </div>
            ) : null}
 
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[11px] font-extrabold text-foreground">
                  <span>{fileName}</span>
                  <span>{uploadProgress}%_COMPLETE</span>
                </div>
                <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden border-2 border-white/60">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
 
            {uploaded && (
              <div className="border-2 border-border bg-white/40 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#059669] rounded-xl flex items-center justify-center border-2 border-white shadow-sm">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-foreground font-mono">{fileName}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider opacity-70">78 PAGES // SHA-256_VERIFIED</p>
                    <p className="text-[10px] text-[#059669] mt-1 font-mono font-extrabold">✓ MALWARE_SCAN_SUCCESS_ARCHIVE_READY</p>
                  </div>
                </div>
              </div>
            )}
 
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="border-2 border-white font-mono uppercase tracking-widest text-[11px] font-extrabold px-8 py-5">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!uploaded} className="bg-primary hover:bg-primary/90 text-white font-mono font-extrabold uppercase tracking-widest px-8 py-5 rounded-lg text-[11px] border-2 border-white shadow-[4px_4px_0_hsl(var(--primary)/0.2)]">Next: GitHub Repository</Button>
            </div>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card className="p-8 relative overflow-hidden space-y-8">
            {!githubConnected ? (
              <div className="text-center py-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground shadow-lg">
                  <Github className="w-9 h-9 text-white" />
                </div>
                <p className="text-[13px] font-mono font-extrabold text-muted-foreground uppercase tracking-[0.2em] mb-6">// CONNECT_REPOSITORY_INDEX</p>
                <Button onClick={() => setGithubConnected(true)} className="bg-white hover:bg-white/90 text-foreground font-mono font-extrabold uppercase tracking-widest px-8 py-6 rounded-lg text-[12px] border-2 border-foreground shadow-[4px_4px_0_hsl(var(--primary)/0.2)]">
                  <Github className="w-4 h-4 mr-2" /> Link_Remote_Repo
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-[#ecfdf5] border-2 border-[#10b981]/40 rounded-xl flex items-center gap-3 text-[12px] font-mono font-extrabold text-[#059669]">
                  <CheckCircle className="w-5 h-5" />
                  <span>SESSION_AUTH: GITHUB_CONNECTED_AS [jpierre-auca]</span>
                </div>
 
                <div className="space-y-4">
                  <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Select Repository</Label>
                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger className="bg-white/40 border-2 border-border font-mono h-12 shadow-sm"><SelectValue placeholder="SELECT_REMOTE_INDEX..." /></SelectTrigger>
                    <SelectContent className="font-mono">
                      <SelectItem value="smart-parking-iot">smart-parking-iot (public)</SelectItem>
                      <SelectItem value="crop-disease-ml">crop-disease-ml (public)</SelectItem>
                      <SelectItem value="my-project">my-final-year-project (private)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
 
                {selectedRepo && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-[11px] font-extrabold uppercase tracking-widest font-mono text-foreground">Final Commit / Tag</Label>
                      <Select defaultValue="latest">
                        <SelectTrigger className="bg-white/40 border-2 border-border font-mono h-12 shadow-sm"><SelectValue /></SelectTrigger>
                        <SelectContent className="font-mono">
                          <SelectItem value="latest">a3f8b2c — "Final submission version" (2 days ago)</SelectItem>
                          <SelectItem value="prev1">b1c2d3e — "Fix auth bug" (5 days ago)</SelectItem>
                          <SelectItem value="prev2">c4d5e6f — "Add unit tests" (1 week ago)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
 
                    <div className="flex items-center gap-3">
                      <div className="flex items-center h-5">
                        <input type="checkbox" id="final" checked={markedFinal} onChange={(e) => setMarkedFinal(e.target.checked)} className="w-5 h-5 rounded border-2 border-primary/25 text-primary focus:ring-primary" />
                      </div>
                      <Label htmlFor="final" className="text-[12px] font-extrabold font-mono text-foreground uppercase tracking-wider cursor-pointer">Mark as Final Archive Version</Label>
                    </div>
                  </>
                )}
              </div>
            )}
 
            <p className="text-[10px] text-primary font-mono italic">{">>"} AUTO_SAVE_COMPLETED: 2min_ago</p>
 
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="border-2 border-white font-mono uppercase tracking-widest text-[11px] font-extrabold px-8 py-5">Back</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="bg-primary hover:bg-primary/90 text-white font-mono font-extrabold uppercase tracking-widest px-10 py-6 rounded-lg text-[13px] border-2 border-white shadow-[4px_4px_0_hsl(var(--primary)/0.2)]">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Submit for Review"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SubmitProjectPage;
