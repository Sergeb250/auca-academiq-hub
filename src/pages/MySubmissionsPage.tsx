import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, Upload } from "lucide-react";

const statusColors: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const MySubmissionsPage = () => {
  const navigate = useNavigate();
  const submissions = mockProjects.filter(
    (p) => p.type !== "Publication" && ["u1"].some(() => true)
  ).slice(0, 5);

  const [filter, setFilter] = useState("All");
  const filters = ["All", "Published", "Pending", "Draft", "Rejected"];

  const filtered = filter === "All" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">My Submissions</h1>
          <Button onClick={() => navigate("/submit/project")} className="gap-2">
            <Upload className="w-4 h-4" /> Submit New Project
          </Button>
        </div>

        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Views</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.department}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{s.type}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={`text-xs ${statusColors[s.status]}`}>{s.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{s.submittedDate}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {s.views}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${s.id}`)}>
                      <FileText className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default MySubmissionsPage;
