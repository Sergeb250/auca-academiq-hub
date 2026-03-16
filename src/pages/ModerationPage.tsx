import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects, mockModerationLog } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, X, Eye, RefreshCw, Copy, Archive, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeColors: Record<string, string> = {
  "Student Project": "bg-primary/10 text-primary border-primary/20",
  Publication: "bg-success/10 text-success border-success/20",
  Thesis: "bg-ai/10 text-ai border-ai/20",
};

const statusColors: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Hidden: "bg-muted text-muted-foreground border-border",
  Archived: "bg-muted text-muted-foreground border-border",
};

const ModerationPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{ type: string; itemId: string } | null>(null);
  const [reason, setReason] = useState("");
  const [templateReason, setTemplateReason] = useState("");

  const tabs = ["All", "Pending", "Published", "Hidden", "Archived", "Flagged Duplicates"];

  const items = mockProjects.map((p) => ({
    ...p,
    reviewer: p.status === "Published" ? "Alice Uwimana" : null,
  }));

  const filtered = activeTab === "All" ? items : items.filter((i) => i.status === activeTab);
  const pendingCount = items.filter((i) => i.status === "Pending").length;

  const handleAction = (action: string, title: string) => {
    setActionModal(null);
    setReason("");
    toast({ title: `${action} Successful`, description: `'${title}' has been ${action.toLowerCase()}.` });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Moderation Queue</h1>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {t}
              {t === "Pending" && pendingCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 text-xs">{pendingCount}</Badge>
              )}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((item) => (
              <div key={item.id}>
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${typeColors[item.type]}`}>{item.type}</Badge>
                      <Badge variant="outline" className={`text-xs ${statusColors[item.status]}`}>{item.status}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.authors.map((a) => a.name).join(", ")} · {item.department} · {item.submittedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === "Pending" && (
                      <>
                        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handleAction("Approved", item.title)}>
                          <CheckCircle className="w-3 h-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/30" onClick={() => setActionModal({ type: "reject", itemId: item.id })}>
                          <X className="w-3 h-3" /> Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => setActionModal({ type: "hide", itemId: item.id })}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => setActionModal({ type: "reupload", itemId: item.id })}>
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => handleAction("Marked as Duplicate", item.title)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => handleAction("Archived", item.title)}>
                      <Archive className="w-3 h-3" />
                    </Button>
                    <button onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)} className="text-muted-foreground">
                      {expandedItem === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {expandedItem === item.id && (
                  <div className="px-5 pb-4 bg-muted/30">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase">Moderation History</h4>
                    {mockModerationLog.filter((l) => l.itemId === item.id).length > 0 ? (
                      <div className="space-y-2">
                        {mockModerationLog.filter((l) => l.itemId === item.id).map((log) => (
                          <div key={log.id} className="flex items-start gap-3 text-xs">
                            <span className="text-muted-foreground whitespace-nowrap">{new Date(log.createdAt).toLocaleDateString()}</span>
                            <Badge variant="outline" className="text-[10px]">{log.action}</Badge>
                            <span className="text-muted-foreground">{log.moderator}: {log.reason}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No moderation history yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Modal */}
        {actionModal && (
          <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md card-shadow">
              <h3 className="font-heading font-semibold text-foreground capitalize mb-4">
                {actionModal.type === "reject" ? "Reject Submission" : actionModal.type === "reupload" ? "Request Re-upload" : "Hide Publication"}
              </h3>
              {actionModal.type === "reject" && (
                <div className="space-y-3 mb-4">
                  <Select value={templateReason} onValueChange={(v) => { setTemplateReason(v); setReason(v); }}>
                    <SelectTrigger><SelectValue placeholder="Select a reason template" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Incomplete metadata">Incomplete metadata</SelectItem>
                      <SelectItem value="Poor document quality">Poor document quality</SelectItem>
                      <SelectItem value="Duplicate topic">Duplicate topic</SelectItem>
                      <SelectItem value="Policy violation">Policy violation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter detailed reason..." rows={3} className="mb-4" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setActionModal(null); setReason(""); }}>Cancel</Button>
                <Button onClick={() => handleAction(actionModal.type === "reject" ? "Rejected" : actionModal.type === "reupload" ? "Re-upload Requested" : "Hidden", items.find((i) => i.id === actionModal.itemId)?.title || "")} disabled={!reason} className={actionModal.type === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ModerationPage;
