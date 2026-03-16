import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Search, Eye, Github, Sparkles, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockProjects = [
  {
    id: "1", title: "Smart Parking System using IoT Sensors", type: "Student Project",
    authors: [{ name: "Jean Pierre H.", initials: "JH" }],
    department: "Information Technology", year: "2024",
    abstract: "A comprehensive IoT-based smart parking management system that uses ultrasonic sensors and a mobile application to help drivers find available parking spaces in real-time.",
    technologies: ["React Native", "Arduino", "Firebase", "Node.js"],
    views: 234, hasGithub: true, availability: "Available",
  },
  {
    id: "2", title: "Impact of Mobile Banking on Financial Inclusion in Rwanda",
    type: "Publication", authors: [{ name: "Dr. Sarah Mugisha", initials: "SM" }],
    department: "Economics", year: "2024",
    abstract: "This research paper examines the transformative impact of mobile banking services on financial inclusion in rural Rwanda, analyzing adoption patterns and socioeconomic outcomes.",
    technologies: [], keywords: ["Mobile Banking", "Financial Inclusion", "Rwanda"],
    views: 189, hasGithub: false, availability: "AUCA Only",
  },
  {
    id: "3", title: "Machine Learning for Early Crop Disease Detection",
    type: "Thesis", authors: [{ name: "Grace Uwimana", initials: "GU" }],
    department: "Computer Science", year: "2025",
    abstract: "A deep learning approach using convolutional neural networks to detect crop diseases from leaf images, trained on a dataset of Rwandan agricultural crops.",
    technologies: ["Python", "TensorFlow", "Flask", "React"],
    views: 312, hasGithub: true, availability: "Reserve to Access",
  },
  {
    id: "4", title: "Blockchain-Based Land Registry for Rwanda",
    type: "Student Project", authors: [{ name: "Eric Habimana", initials: "EH" }],
    department: "Information Technology", year: "2024",
    abstract: "A decentralized land registration system using Ethereum smart contracts to ensure transparent, tamper-proof land ownership records.",
    technologies: ["Solidity", "React", "Ethereum", "IPFS"],
    views: 156, hasGithub: true, availability: "Available",
  },
  {
    id: "5", title: "Kinyarwanda Sentiment Analysis using NLP",
    type: "Publication", authors: [{ name: "Prof. Agnes N.", initials: "AN" }, { name: "David M.", initials: "DM" }],
    department: "Computer Science", year: "2025",
    abstract: "A novel natural language processing framework for sentiment analysis in Kinyarwanda text, leveraging transfer learning from multilingual transformer models.",
    technologies: [], keywords: ["NLP", "Kinyarwanda", "Sentiment Analysis"],
    views: 278, hasGithub: false, availability: "AUCA Only",
  },
  {
    id: "6", title: "Solar-Powered Water Purification IoT System",
    type: "Student Project", authors: [{ name: "Patrick Kamanzi", initials: "PK" }],
    department: "Engineering", year: "2025",
    abstract: "An IoT-enabled water purification system powered by solar energy, with real-time water quality monitoring and mobile alerts for rural communities.",
    technologies: ["Arduino", "React", "MQTT", "PostgreSQL"],
    views: 98, hasGithub: true, availability: "Fully Reserved",
  },
];

const typeColors: Record<string, string> = {
  "Student Project": "bg-primary/10 text-primary border-primary/20",
  "Publication": "bg-success/10 text-success border-success/20",
  "Thesis": "bg-ai/10 text-ai border-ai/20",
};

const availColors: Record<string, string> = {
  "Available": "bg-success/10 text-success",
  "AUCA Only": "bg-primary/10 text-primary",
  "Reserve to Access": "bg-secondary/10 text-secondary",
  "Fully Reserved": "bg-warning/10 text-warning",
};

const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Student Projects", "Lecturer Publications", "Theses"];

  const filtered = mockProjects.filter((p) => {
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
        {/* Search Header */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, publications, authors, keywords..."
              className="pl-12 h-12 text-base"
            />
          </div>
          <div className="flex items-center justify-center gap-1 mt-3">
            <Sparkles className="w-3 h-3 text-ai" />
            <span className="text-xs text-muted-foreground">Powered by AcademIQ AI</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">{filtered.length} results</p>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-xl border border-border card-shadow hover:card-shadow-hover transition-shadow group cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`text-xs ${typeColors[project.type]}`}>
                    {project.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{project.year}</span>
                </div>

                <h3 className="font-heading font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 mt-3">
                  {project.authors.map((a) => (
                    <div key={a.initials} className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                        {a.initials}
                      </div>
                      <span className="text-xs text-muted-foreground">{a.name}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{project.abstract}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(project.technologies?.length ? project.technologies : project.keywords || []).slice(0, 4).map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views}</span>
                  {project.hasGithub && <Github className="w-3.5 h-3.5" />}
                </div>
                <Badge variant="secondary" className={`text-[10px] ${availColors[project.availability]}`}>
                  {project.availability}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default BrowsePage;
