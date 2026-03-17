import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { AuthorProfileCard } from "@/components/AuthorProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, CalendarDays, Github, Star, GitFork, FileText, ExternalLink, Clock, CheckCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeColors: Record<string, string> = {
  "Student Project": "bg-primary/10 text-primary border-primary/20",
  Publication: "bg-success/10 text-success border-success/20",
  Thesis: "bg-ai/10 text-ai border-ai/20",
};

const availColors: Record<string, string> = {
  Available: "bg-success/10 text-success",
  "AUCA Only": "bg-primary/10 text-primary",
  "Reserve to Access": "bg-secondary/10 text-secondary",
  "Fully Reserved": "bg-warning/10 text-warning",
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [reserving, setReserving] = useState(false);

  const project = mockProjects.find((p) => p.id === id);
  if (!project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Project not found.</p>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: "info", label: "Project Info" },
    ...(project.hasGithub ? [{ id: "github", label: "GitHub Repository" }] : []),
    { id: "memoir", label: project.type === "Publication" ? "Full Document" : "Memoir / Full Document" },
  ];

  const handleReserve = () => {
    setReserving(true);
    setTimeout(() => {
      setReserving(false);
      toast({ title: "Reservation Confirmed!", description: `Reserved '${project.title}' for Mon Mar 17, 8:00 AM – 10:00 AM` });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* Header */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={typeColors[project.type]}>{project.type}</Badge>
            <Badge variant="outline" className={availColors[project.availability]}>{project.availability}</Badge>
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{project.title}</h1>
          <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-muted-foreground">
            <span>{project.department}</span>
            <span>{project.year}</span>
            <span>{project.level}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {project.authors.map((a) => (
              <div key={a.initials} className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{a.initials}</div>
                <span className="text-sm text-foreground">{a.name}</span>
                <Badge variant="secondary" className="text-[10px]">{a.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <h3 className="font-heading font-semibold text-foreground mb-3">Abstract</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.abstract}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-6 card-shadow">
                <h3 className="font-heading font-semibold text-foreground mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((k) => (
                    <Badge key={k} variant="outline" className="bg-primary/5 text-primary border-primary/20">{k}</Badge>
                  ))}
                </div>
              </div>
              {project.technologies.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6 card-shadow">
                  <h3 className="font-heading font-semibold text-foreground mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <h3 className="font-heading font-semibold text-foreground mb-4">Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {project.supervisor && (
                  <div><span className="text-muted-foreground">Supervisor</span><p className="font-medium text-foreground mt-1">{project.supervisor}</p></div>
                )}
                {project.doi && (
                  <div><span className="text-muted-foreground">DOI</span><p className="font-medium text-foreground mt-1">{project.doi}</p></div>
                )}
                {project.journal && (
                  <div className="col-span-2"><span className="text-muted-foreground">Journal</span><p className="font-medium text-foreground mt-1">{project.journal}</p></div>
                )}
                <div><span className="text-muted-foreground">Submitted</span><p className="font-medium text-foreground mt-1">{project.submittedDate}</p></div>
                <div><span className="text-muted-foreground">Published</span><p className="font-medium text-foreground mt-1">{project.publishedDate || "—"}</p></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Eye, label: "Views", value: project.views },
                { icon: CalendarDays, label: "Reservations", value: project.reservationsMade },
                { icon: FileText, label: "Times Accessed", value: project.timesAccessed },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-xl border border-border p-4 card-shadow text-center">
                  <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xl font-heading font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "github" && project.github && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                    <Github className="w-5 h-5" /> {project.github.repoName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.github.description}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" /> View on GitHub
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {project.github.stars}</span>
                <span className="flex items-center gap-1"><GitFork className="w-4 h-4" /> {project.github.forks}</span>
                <Badge variant="secondary">{project.github.visibility}</Badge>
                {project.github.languages.map((l) => (
                  <Badge key={l} variant="outline">{l}</Badge>
                ))}
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Final Commit:</span> {project.github.finalCommit}</p>
                <p className="text-muted-foreground mt-1"><span className="font-medium text-foreground">Tag:</span> {project.github.finalTag}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <h3 className="font-heading font-semibold text-foreground mb-3">README</h3>
              <div className="prose prose-sm max-w-none bg-muted rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-body">{project.github.readme}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "memoir" && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow">
            {project.type === "Publication" ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Full Document</h3>
                <p className="text-sm text-muted-foreground mb-4">{project.memoirPages} pages · {project.visibility === "auca-only" ? "AUCA Members Only" : "Restricted Access"}</p>
                <Button className="gap-2"><Eye className="w-4 h-4" /> View Document</Button>
              </div>
            ) : (
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">Memoir Access</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-2">
                    {Array.from({ length: project.slots?.total || 3 }).map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        i < (project.slots?.reserved || 0) ? "bg-warning/20 border-warning text-warning" : "bg-success/20 border-success text-success"
                      }`}>
                        {i < (project.slots?.reserved || 0) ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {(project.slots?.total || 3) - (project.slots?.reserved || 0)} of {project.slots?.total || 3} slots available
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Available Mon–Fri, 8:00 AM – 5:00 PM
                </p>

                {project.availability === "Fully Reserved" ? (
                  <div>
                    <p className="text-sm text-warning mb-3">All slots are currently reserved.</p>
                    <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Added to Waitlist", description: "You'll be notified when a slot opens." })}>
                      Join Waitlist
                    </Button>
                  </div>
                ) : (
                  <Button className="gap-2" onClick={handleReserve} disabled={reserving}>
                    <CalendarDays className="w-4 h-4" />
                    {reserving ? "Reserving..." : "Request Reservation"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectDetailPage;
