import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockReservations } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Eye, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  active: "bg-success/10 text-success border-success/20",
  completed: "bg-muted text-muted-foreground border-border",
  waitlisted: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const MyReservationsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const tabs = [
    { id: "upcoming", label: "Upcoming", count: 2 },
    { id: "active", label: "Active Now", count: 1 },
    { id: "completed", label: "Past", count: 2 },
    { id: "waitlisted", label: "Waitlisted", count: 0 },
  ];

  const filtered = mockReservations.filter((r) => {
    if (activeTab === "completed") return r.status === "completed";
    return r.status === activeTab;
  });

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">My Reservations</h1>

        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.id ? "bg-primary-foreground/20" : "bg-muted"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 card-shadow text-center">
            <CalendarDays className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No {activeTab} reservations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-5 card-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{r.projectTitle}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {formatDate(r.slotStart)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(r.slotStart)} – {formatTime(r.slotEnd)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs capitalize ${statusColors[r.status]}`}>
                    {r.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  {r.status === "active" && (
                    <Button size="sm" className="gap-2 bg-success hover:bg-success/90">
                      <Eye className="w-4 h-4" /> Open Memoir Viewer
                    </Button>
                  )}
                  {r.status === "upcoming" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-destructive border-destructive/30"
                      onClick={() => toast({ title: "Reservation Cancelled", description: `Cancelled reservation for '${r.projectTitle}'` })}
                    >
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  )}
                  {r.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => toast({ title: "Renewal Requested", description: "Your request has been sent for approval." })}
                    >
                      <RefreshCw className="w-4 h-4" /> Request Renewal
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyReservationsPage;
