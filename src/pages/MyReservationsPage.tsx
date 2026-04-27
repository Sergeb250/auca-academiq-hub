import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockReservations } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Eye, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const statusColors: Record<string, string> = {
  upcoming: "bg-[#f0f9ff] text-[#0284c7] border-[#0ea5e9]/40",
  active: "bg-[#ecfdf5] text-[#059669] border-[#10b981]/40",
  completed: "bg-[#f8fafc] text-[#64748b] border-[#94a3b8]/40",
  waitlisted: "bg-[#fefce8] text-[#ca8a04] border-[#fbbf24]/40",
  cancelled: "bg-[#fef2f2] text-[#e11d48] border-[#f43f5e]/40",
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

  const emptyMessage: Record<string, string> = {
    upcoming: "You have no upcoming reservations.",
    active: "Nothing is checked out right now.",
    completed: "No completed reservations yet.",
    waitlisted: "You are not on a waitlist.",
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="relative inline-block text-2xl font-semibold uppercase italic tracking-[0.2em] text-foreground">
           <span className="absolute bottom-1 left-[-5px] right-[-5px] h-[35%] bg-yellow-200/60 -z-10 rounded-sm -rotate-1"></span>
           My Reservations
        </h1>

        <div className="flex gap-3 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-md text-[11px] font-extrabold transition-all uppercase tracking-widest font-mono flex items-center gap-2 ${
                activeTab === t.id
                  ? "border-2 border-primary bg-primary text-primary-foreground shadow-[2px_2px_0] shadow-foreground/20"
                  : "border-2 border-border bg-card/60 text-muted-foreground shadow-sm hover:border-primary/40"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${activeTab === t.id ? "bg-white/20" : "bg-primary/10 text-primary"}`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-20 text-center shadow-none">
            <CalendarDays className="mx-auto mb-4 h-10 w-10 text-primary/30" />
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">{emptyMessage[activeTab] ?? "No reservations in this list."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <Card key={r.id} className="group relative overflow-hidden border-border/80 p-8 transition-all hover:border-primary/40">
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-3">
                    <h3 className="text-[15px] font-semibold italic leading-tight text-foreground transition-colors group-hover:text-primary">{r.projectTitle}</h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                      <span className="flex w-max items-center gap-2 rounded-lg border border-border bg-primary/5 px-3 py-1.5 shadow-sm">
                        <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                        <span className="font-medium">{formatDate(r.slotStart)}</span>
                      </span>
                      <span className="flex w-max items-center gap-2 rounded-lg border border-border bg-primary/5 px-3 py-1.5 shadow-sm">
                        <Clock className="h-4 w-4 text-primary" aria-hidden />
                        <span className="font-medium">
                          {formatTime(r.slotStart)} – {formatTime(r.slotEnd)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className={`rounded-md border px-3 py-1 text-xs font-semibold capitalize ${statusColors[r.status] || "border-primary/25 text-primary"}`}>
                    {r.status}
                  </span>
                </div>
                <div className="flex gap-3 mt-8">
                  {r.status === "active" && (
                    <Button size="sm" className="h-11 rounded-lg border border-border px-6 font-semibold shadow-sm">
                      <Eye className="w-4 h-4 mr-2" aria-hidden />
                      Open viewer
                    </Button>
                  )}
                  {r.status === "upcoming" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border border-red-600/40 hover:bg-red-50 font-semibold rounded-lg px-6 h-11 shadow-sm"
                      onClick={() => toast({ title: "Reservation Cancelled", description: `Cancelled reservation for '${r.projectTitle}'` })}
                    >
                      <X className="w-4 h-4 mr-2" aria-hidden />
                      Cancel reservation
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyReservationsPage;
