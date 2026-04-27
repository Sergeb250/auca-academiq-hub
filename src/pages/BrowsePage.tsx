import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { Search, Eye, Github, Library, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const typeColors: Record<string, string> = {
  "Student Project": "bg-[#f0f9ff] text-[#0284c7] border-[#0ea5e9]/40",
  Publication: "bg-[#ecfdf5] text-[#059669] border-[#10b981]/40",
  Thesis: "bg-[#f5f3ff] text-[#7c3aed] border-[#7c3aed]/40",
};

const availColors: Record<string, string> = {
  Available: "bg-[#ecfdf5] text-[#059669]",
  "AUCA Only": "bg-[#f0f9ff] text-[#0284c7]",
  "Reserve to Access": "bg-[#fefce8] text-[#ca8a04]",
  "Fully Reserved": "bg-[#fef2f2] text-[#e11d48]",
};

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Student Projects", "Lecturer Publications", "Theses"];

  const filtered = mockProjects.filter((p) => {
    if (p.status !== "Published") return false;
    if (activeTab === "Student Projects" && p.type !== "Student Project") return false;
    if (activeTab === "Lecturer Publications" && p.type !== "Publication") return false;
    if (activeTab === "Theses" && p.type !== "Thesis") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-xl border-2 border-border bg-card/70 p-8 shadow-[4px_4px_0_hsl(var(--primary)/0.12)] backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 bg-card/30" />
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, abstract, or department…"
              className="h-14 rounded-xl border-2 border-border bg-background/80 pl-12 text-sm shadow-sm focus-visible:ring-primary"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Library className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span className="font-medium text-foreground/80">Official AUCA repository — published work only</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`rounded-md px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all ${activeTab === tab ? "border-2 border-primary bg-primary text-primary-foreground shadow-[2px_2px_0] shadow-foreground/25" : "border-2 border-border bg-transparent text-muted-foreground shadow-sm hover:border-primary/40"}`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="h-9 w-40 border-border shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 gap-2 border-border shadow-sm">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        <p className="px-1 text-xs font-medium text-muted-foreground">
          Showing <span className="font-semibold text-primary">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "result" : "results"}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Card 
              key={project.id} 
              onClick={() => navigate(`/projects/${project.id}`)} 
              className="group cursor-pointer border-border/80 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`rounded-md border px-3 py-1 text-[9px] font-semibold uppercase tracking-widest ${typeColors[project.type] || "border-border bg-transparent text-primary"}`}
                  >
                    {project.type}
                  </span>
                  <span className="ml-auto text-[10px] font-medium text-muted-foreground">{project.year}</span>
                </div>
                <h3 className="mb-4 line-clamp-2 bg-primary/5 px-1 text-[15px] font-semibold italic leading-snug text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>

                <div className="flex items-center gap-3 mt-3">
                  {project.authors.map((a) => (
                    <div key={a.initials} className="flex items-center gap-2">
                       <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-border text-[10px] font-semibold text-foreground">
                         {a.initials}
                       </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 line-clamp-3 text-[12px] font-medium leading-relaxed text-muted-foreground">{project.abstract}</p>
              </div>
              <div className="flex items-center justify-between border-t-2 border-dashed border-border px-6 py-4">
                <div className="flex items-center gap-4 text-[10px] font-semibold text-primary">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {project.views}
                  </span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-primary">
                  {project.availability}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default BrowsePage;
