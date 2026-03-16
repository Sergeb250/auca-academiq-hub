import { Users, FileText, HardDrive, Activity, BarChart3, Shield } from "lucide-react";

const stats = [
  { label: "Total Users", value: 1247, icon: Users, color: "text-primary" },
  { label: "Total Projects", value: 386, icon: FileText, color: "text-secondary" },
  { label: "Publications", value: 142, icon: BarChart3, color: "text-success" },
  { label: "Storage Used", value: "12.4 GB", icon: HardDrive, color: "text-warning" },
  { label: "Active Sessions", value: 34, icon: Activity, color: "text-accent" },
  { label: "Reservation System", value: "Active", icon: Shield, color: "text-success" },
];

const auditLog = [
  { action: "User login", user: "Jean Pierre H.", time: "2 min ago" },
  { action: "Project approved", user: "Alice U. (Moderator)", time: "15 min ago" },
  { action: "New submission", user: "David M.", time: "32 min ago" },
  { action: "Reservation created", user: "Grace U.", time: "1 hour ago" },
  { action: "Publication published", user: "Dr. Sarah M.", time: "2 hours ago" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-heading font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 card-shadow">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 card-shadow h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Submissions per Month</p>
            <p className="text-xs mt-1">Connect backend for live data</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 card-shadow h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Department Activity</p>
            <p className="text-xs mt-1">Connect backend for live data</p>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-card rounded-xl border border-border card-shadow">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">Recent Audit Log</h2>
        </div>
        <div className="divide-y divide-border">
          {auditLog.map((e, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">{e.action}</p>
                <p className="text-xs text-muted-foreground">{e.user}</p>
              </div>
              <span className="text-xs text-muted-foreground">{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
