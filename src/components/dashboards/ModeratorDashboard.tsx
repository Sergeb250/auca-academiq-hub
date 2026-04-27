import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

/* ─── Mock data ─── */

const pendingByDept = [
  { dept: "IT", pending: 2 },
  { dept: "Economics", pending: 1 },
  { dept: "Engineering", pending: 1 },
  { dept: "CS", pending: 1 },
];

const reviewsThisWeek = [
  { day: "Mon", completed: 4, rejected: 0 },
  { day: "Tue", completed: 6, rejected: 1 },
  { day: "Wed", completed: 5, rejected: 0 },
  { day: "Thu", completed: 8, rejected: 1 },
  { day: "Fri", completed: 7, rejected: 0 },
  { day: "Sat", completed: 2, rejected: 0 },
  { day: "Sun", completed: 1, rejected: 0 },
];

const deptChartConfig = {
  pending: { label: "Pending items", color: "hsl(32 95% 44%)" },
} satisfies ChartConfig;

const trendChartConfig = {
  completed: { label: "Approved", color: "hsl(142 72% 36%)" },
  rejected: { label: "Rejected", color: "hsl(0 72% 51%)" },
} satisfies ChartConfig;

const queue = [
  { title: "Mobile Health Tracking Application", author: "David Mugabo", initials: "DM", dept: "IT", type: "Student Project", date: "Mar 15, 2025", pages: 48, fileSize: "3.2 MB" },
  { title: "Impact of Microfinance on Rural Communities", author: "Dr. Jean B. Niyonzima", initials: "JN", dept: "Economics", type: "Publication", date: "Mar 14, 2025", pages: 24, fileSize: "1.8 MB" },
  { title: "Solar Energy Management Dashboard", author: "Grace Uwimana", initials: "GU", dept: "Engineering", type: "Student Project", date: "Mar 13, 2025", pages: 62, fileSize: "5.1 MB" },
  { title: "Machine Learning in Agricultural Yield Prediction", author: "Prof. Agnes Ntamwiza", initials: "AN", dept: "CS", type: "Publication", date: "Mar 12, 2025", pages: 18, fileSize: "1.2 MB" },
  { title: "Kinyarwanda NLP Text Classifier", author: "Eric Habimana", initials: "EH", dept: "IT", type: "Student Project", date: "Mar 11, 2025", pages: 55, fileSize: "4.7 MB" },
];

const recentDecisions = [
  { title: "Blockchain-Based Land Registry for Rwanda", author: "Eric Habimana", decision: "Approved", date: "Mar 10, 2025", reason: "All requirements met; well-structured submission" },
  { title: "Smart Parking System using IoT Sensors", author: "Jean Pierre H.", decision: "Approved", date: "Mar 9, 2025", reason: "Complete documentation with proper citations" },
  { title: "Water Quality Monitoring using ML", author: "Patrick K.", decision: "Rejected", date: "Mar 8, 2025", reason: "Missing abstract; plagiarism check failed (32% similarity)" },
  { title: "E-Commerce Platform for Local Artisans", author: "Marie Claire N.", decision: "Resubmit", date: "Mar 7, 2025", reason: "Bibliography incomplete; missing 4 required sections" },
];

const verificationStats = {
  totalProcessed: 142,
  verified: 118,
  partial: 16,
  failed: 8,
  avgConfidence: 89,
};

const typeBadge: Record<string, string> = {
  "Student Project": "bg-primary/10 text-primary border-primary/20",
  "Publication": "bg-emerald-500/10 text-emerald-700 border-emerald-400/30",
};

const decisionStyle: Record<string, string> = {
  Approved: "bg-emerald-500/10 text-emerald-700 border-emerald-400/30",
  Rejected: "bg-red-500/10 text-red-700 border-red-400/30",
  Resubmit: "bg-amber-500/10 text-amber-700 border-amber-400/30",
};

export function ModeratorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalReviewedThisWeek = reviewsThisWeek.reduce((s, d) => s + d.completed, 0);
  const totalRejectedThisWeek = reviewsThisWeek.reduce((s, d) => s + d.rejected, 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary to-primary/85 text-base font-semibold text-primary-foreground shadow-md">
            {user?.avatarInitials ?? "AU"}
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">
              Moderation Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Library review queue and document quality control
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/document-verification")}>
            Doc Verification
          </Button>
          <Button size="sm" onClick={() => navigate("/moderation")}>
            Open Queue
          </Button>
        </div>
      </div>

      {/* ── Row 1: Summary counters ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "In Queue", value: queue.length, highlight: true },
          { label: "Reviewed This Week", value: totalReviewedThisWeek },
          { label: "Rejected This Week", value: totalRejectedThisWeek },
          { label: "Total Processed", value: verificationStats.totalProcessed },
          { label: "Avg Confidence", value: `${verificationStats.avgConfidence}%` },
        ].map((s) => (
          <Card key={s.label} className={`border-border shadow-sm text-center ${s.highlight ? "ring-1 ring-amber-300/50" : ""}`}>
            <CardContent className="p-4">
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Row 2: Pending queue + Charts ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pending approval queue */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading">Pending Approval Queue</CardTitle>
                <CardDescription>{queue.length} submissions awaiting review</CardDescription>
              </div>
              <Badge variant="destructive" className="text-[10px]">{queue.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.author} · {item.dept} · {item.pages} pages · {item.fileSize}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-[9px] shrink-0 ${typeBadge[item.type] ?? ""}`}>
                    {item.type}
                  </Badge>
                </div>
                <div className="flex justify-end gap-1.5 mt-2">
                  <Button size="sm" className="h-6 text-[10px] px-3">Approve</Button>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-3 text-destructive border-destructive/30">Reject</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Charts stack */}
        <div className="space-y-4">
          {/* Pending by department */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading">Pending by Department</CardTitle>
              <CardDescription>Open moderation items</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={deptChartConfig} className="h-[180px] w-full aspect-auto">
                <BarChart data={pendingByDept} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                  <XAxis dataKey="dept" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly review trend */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading">Review Decisions This Week</CardTitle>
              <CardDescription>Approved vs rejected per day</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={trendChartConfig} className="h-[180px] w-full aspect-auto">
                <LineChart data={reviewsThisWeek} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="rejected" stroke="var(--color-rejected)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Row 3: Recent decisions + Verification stats ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent decisions */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Recent Review Decisions</CardTitle>
            <CardDescription>Audit trail of moderation actions</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Submission</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Decision</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Reason</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDecisions.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">{d.title}</p>
                      <p className="text-[10px] text-muted-foreground">{d.author}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${decisionStyle[d.decision] ?? ""}`}>
                        {d.decision}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground max-w-[200px] truncate">
                      {d.reason}
                    </TableCell>
                    <TableCell className="text-right text-[10px] text-muted-foreground">{d.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Document verification stats */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">Document Verification</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/document-verification")}>
                Open
              </Button>
            </div>
            <CardDescription>Automated document quality results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-emerald-200/50 bg-emerald-50/50 p-3">
                <p className="text-lg font-heading font-bold text-emerald-700">{verificationStats.verified}</p>
                <p className="text-[10px] font-medium text-emerald-600">Fully Verified</p>
              </div>
              <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-3">
                <p className="text-lg font-heading font-bold text-amber-700">{verificationStats.partial}</p>
                <p className="text-[10px] font-medium text-amber-600">Partial Match</p>
              </div>
              <div className="rounded-lg border border-red-200/50 bg-red-50/50 p-3">
                <p className="text-lg font-heading font-bold text-red-700">{verificationStats.failed}</p>
                <p className="text-[10px] font-medium text-red-600">Failed</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-lg font-heading font-bold text-foreground">{verificationStats.avgConfidence}%</p>
                <p className="text-[10px] font-medium text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Verification success rate</span>
                <span className="font-bold text-foreground">
                  {Math.round((verificationStats.verified / verificationStats.totalProcessed) * 100)}%
                </span>
              </div>
              <Progress value={(verificationStats.verified / verificationStats.totalProcessed) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
