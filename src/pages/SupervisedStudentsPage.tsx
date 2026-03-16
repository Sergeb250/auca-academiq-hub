import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

const students = [
  { name: "Jean Pierre Habimana", id: "AUCA-2023-0147", project: "Smart Parking System using IoT Sensors", status: "Published", dept: "IT" },
  { name: "Eric Habimana", id: "AUCA-2023-0201", project: "Blockchain-Based Land Registry for Rwanda", status: "Published", dept: "IT" },
  { name: "Marie Claire Niyonsaba", id: "AUCA-2023-0198", project: "E-Commerce Platform for Local Artisans", status: "Pending", dept: "IT" },
  { name: "Grace Uwimana", id: "AUCA-2022-0089", project: "ML for Early Crop Disease Detection", status: "Published", dept: "CS" },
  { name: "David Mugabo", id: "AUCA-2024-0055", project: "Kinyarwanda Text Summarizer", status: "Draft", dept: "CS" },
  { name: "Patrick Kamanzi", id: "AUCA-2023-0312", project: "Water Quality Monitoring using ML", status: "Pending", dept: "Eng" },
  { name: "Claudine Ishimwe", id: "AUCA-2024-0112", project: null, status: "Not Started", dept: "BA" },
  { name: "Olivier Nshimiyimana", id: "AUCA-2024-0078", project: "Hospital Queue Management System", status: "Draft", dept: "IT" },
];

const statusIcon: Record<string, React.ReactNode> = {
  Published: <CheckCircle className="w-4 h-4 text-success" />,
  Pending: <Clock className="w-4 h-4 text-warning" />,
  Draft: <FileText className="w-4 h-4 text-muted-foreground" />,
  "Not Started": <AlertCircle className="w-4 h-4 text-destructive" />,
};

const statusColors: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
  "Not Started": "bg-destructive/10 text-destructive border-destructive/20",
};

const SupervisedStudentsPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Supervised Students</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Published", "Pending", "Draft", "Not Started"].map((s) => (
            <div key={s} className="bg-card rounded-xl border border-border p-4 card-shadow text-center">
              <p className="text-2xl font-heading font-bold text-foreground">
                {students.filter((st) => st.status === s).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Student</th>
                <th className="text-left px-5 py-3 font-medium">Campus ID</th>
                <th className="text-left px-5 py-3 font-medium">Project</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.dept}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground font-mono">{s.id}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{s.project || "—"}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={`text-xs ${statusColors[s.status]}`}>
                      <span className="mr-1">{statusIcon[s.status]}</span> {s.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {s.status === "Pending" && <Button size="sm" variant="outline">Review</Button>}
                    {s.project && s.status === "Published" && (
                      <Button size="sm" variant="ghost" onClick={() => navigate("/browse")}>
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
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

export default SupervisedStudentsPage;
