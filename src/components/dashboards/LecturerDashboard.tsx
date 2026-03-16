import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, CheckCircle, Users, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Submitted Publications", value: 12, icon: BookOpen, color: "text-primary" },
  { label: "Under Review", value: 2, icon: Clock, color: "text-warning" },
  { label: "Published", value: 9, icon: CheckCircle, color: "text-success" },
  { label: "Supervised Students", value: 8, icon: Users, color: "text-secondary" },
];

const pendingReviews = [
  { title: "E-Commerce Platform for Local Artisans", student: "Marie Claire N.", department: "IT", date: "2025-03-12" },
  { title: "Water Quality Monitoring System", student: "Patrick K.", department: "Engineering", date: "2025-03-14" },
];

export function LecturerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-primary rounded-xl p-6">
        <h1 className="text-xl font-heading font-bold text-primary-foreground">Hello, {user?.name.split(" ")[0]} 👋</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">{user?.department}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5 card-shadow">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => navigate("/submit/publication")} className="gap-2"><Upload className="w-4 h-4" /> Submit Publication</Button>
        <Button variant="outline" onClick={() => navigate("/browse")} className="gap-2"><Search className="w-4 h-4" /> Browse Repository</Button>
      </div>

      <div className="bg-card rounded-xl border border-border card-shadow">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">Pending Student Reviews</h2>
        </div>
        <div className="divide-y divide-border">
          {pendingReviews.map((r, i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-1">by {r.student} · {r.department} · {r.date}</p>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
