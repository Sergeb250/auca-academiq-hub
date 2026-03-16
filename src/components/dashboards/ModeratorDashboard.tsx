import { Shield, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Reviewed Today", value: 7, icon: CheckCircle, color: "text-success" },
  { label: "Pending", value: 5, icon: Clock, color: "text-warning" },
  { label: "Approval Rate", value: "82%", icon: BarChart3, color: "text-primary" },
  { label: "Avg Review Time", value: "1.2d", icon: Shield, color: "text-secondary" },
];

const queue = [
  { title: "Mobile Health Tracking Application", author: "David M.", dept: "IT", type: "Student Project", date: "2025-03-15" },
  { title: "Impact of Microfinance on Rural Communities", author: "Dr. Jean B.", dept: "Economics", type: "Publication", date: "2025-03-14" },
  { title: "Solar Energy Management Dashboard", author: "Grace U.", dept: "Engineering", type: "Student Project", date: "2025-03-13" },
  { title: "Machine Learning in Agricultural Yield Prediction", author: "Prof. Agnes N.", dept: "CS", type: "Publication", date: "2025-03-12" },
  { title: "Kinyarwanda NLP Text Classifier", author: "Eric H.", dept: "IT", type: "Student Project", date: "2025-03-11" },
];

const typeBadge: Record<string, string> = {
  "Student Project": "bg-primary/10 text-primary border-primary/20",
  "Publication": "bg-success/10 text-success border-success/20",
};

export function ModeratorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-heading font-bold text-foreground">Moderation Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5 card-shadow">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border card-shadow">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-semibold text-foreground">Pending Approval Queue</h2>
          <Badge variant="destructive">{queue.length}</Badge>
        </div>
        <div className="divide-y divide-border">
          {queue.map((item, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.author} · {item.dept} · {item.date}</p>
              </div>
              <Badge variant="outline" className={`text-xs ${typeBadge[item.type]}`}>{item.type}</Badge>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs">Approve</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
