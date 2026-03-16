import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockAuditLog } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, BarChart3, FileText, Eye, Users, Shield, Github, CalendarDays } from "lucide-react";

const reportTabs = [
  { id: "activity", label: "Project Activity", icon: FileText },
  { id: "viewing", label: "Viewing Sessions", icon: Eye },
  { id: "access", label: "User Access", icon: Users },
  { id: "moderation", label: "Moderation Actions", icon: Shield },
  { id: "github", label: "GitHub Integration", icon: Github },
  { id: "reservations", label: "Reservation Analytics", icon: CalendarDays },
  { id: "audit", label: "Audit Log", icon: BarChart3 },
];

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState("audit");
  const [searchQ, setSearchQ] = useState("");

  const filteredLogs = mockAuditLog.filter((l) => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return l.action.toLowerCase().includes(q) || l.userName.toLowerCase().includes(q) || l.details.toLowerCase().includes(q);
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">Reports & Audit Logs</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> PDF</Button>
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Excel</Button>
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> CSV</Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {reportTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex gap-3 items-center">
          <Input type="date" defaultValue="2025-03-01" className="w-40" />
          <span className="text-muted-foreground text-sm">to</span>
          <Input type="date" defaultValue="2025-03-16" className="w-40" />
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search logs..." className="pl-9" />
          </div>
        </div>

        {activeTab !== "audit" ? (
          <div className="bg-card rounded-xl border border-border p-12 card-shadow text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-foreground">{reportTabs.find((t) => t.id === activeTab)?.label}</h3>
            <p className="text-sm text-muted-foreground mt-2">Charts and analytics will be available when backend is connected.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-heading font-semibold text-foreground">System Audit Log</h2>
              <p className="text-xs text-muted-foreground mt-1">Immutable, append-only record of all system events</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Timestamp</th>
                  <th className="text-left px-5 py-3 font-medium">User</th>
                  <th className="text-left px-5 py-3 font-medium">Action</th>
                  <th className="text-left px-5 py-3 font-medium">Entity</th>
                  <th className="text-left px-5 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{log.userName}</td>
                    <td className="px-5 py-3"><Badge variant="outline" className="text-xs">{log.action}</Badge></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground capitalize">{log.entityType}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminReportsPage;
