import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, Upload } from "lucide-react";

const MyPublicationsPage = () => {
  const navigate = useNavigate();
  const pubs = mockProjects.filter((p) => p.type === "Publication");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">My Publications</h1>
          <Button onClick={() => navigate("/submit/publication")} className="gap-2">
            <Upload className="w-4 h-4" /> Submit Publication
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Journal</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Views</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pubs.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.department} · {p.year}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">Research Paper</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{p.journal || "—"}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {p.views}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${p.id}`)}>
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

export default MyPublicationsPage;
