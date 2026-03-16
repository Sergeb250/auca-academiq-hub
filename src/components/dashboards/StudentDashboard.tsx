import { useAuth } from "@/contexts/AuthContext";
import { FileText, Clock, CheckCircle, CalendarDays, Upload, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "My Submissions", value: 4, icon: FileText, color: "text-primary" },
  { label: "Pending Review", value: 1, icon: Clock, color: "text-warning" },
  { label: "Published", value: 2, icon: CheckCircle, color: "text-success" },
  { label: "Active Reservations", value: 1, icon: CalendarDays, color: "text-secondary" },
];

const recentSubmissions = [
  { title: "Smart Parking System using IoT Sensors", type: "Final Year Project", status: "Published", date: "2025-01-15" },
  { title: "Analysis of Mobile Banking Adoption in Rwanda", type: "Research Study", status: "Pending", date: "2025-02-20" },
  { title: "AI-Powered Crop Disease Detection App", type: "Final Year Project", status: "Draft", date: "2025-03-10" },
  { title: "Blockchain for Land Registry", type: "Final Year Project", status: "Rejected", date: "2024-11-05" },
];

const statusColors: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-primary rounded-xl p-6">
        <h1 className="text-xl font-heading font-bold text-primary-foreground">
          Hello, {user?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-primary-foreground/70 text-sm mt-1">
          {user?.department} · {user?.year}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5 card-shadow">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => navigate("/submit/project")} className="gap-2">
          <Upload className="w-4 h-4" /> Submit New Project
        </Button>
        <Button variant="outline" onClick={() => navigate("/browse")} className="gap-2">
          <Search className="w-4 h-4" /> Browse Repository
        </Button>
        <Button variant="outline" onClick={() => navigate("/my-reservations")} className="gap-2">
          <CalendarDays className="w-4 h-4" /> My Reservations
        </Button>
      </div>

      {/* Recent Submissions */}
      <div className="bg-card rounded-xl border border-border card-shadow">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">My Recent Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{s.title}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{s.type}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={`text-xs ${statusColors[s.status]}`}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
