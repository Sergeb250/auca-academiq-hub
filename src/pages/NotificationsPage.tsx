import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockNotifications } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, CalendarDays, Clock, RefreshCw, Mail, Shield, Bell, Check } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  approved: <CheckCircle className="w-5 h-5 text-success" />,
  rejected: <X className="w-5 h-5 text-destructive" />,
  reservation: <CalendarDays className="w-5 h-5 text-primary" />,
  reminder: <Clock className="w-5 h-5 text-warning" />,
  reupload: <RefreshCw className="w-5 h-5 text-secondary" />,
  review: <Mail className="w-5 h-5 text-primary" />,
  renewal: <Shield className="w-5 h-5 text-success" />,
  system: <Bell className="w-5 h-5 text-muted-foreground" />,
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-heading font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <Check className="w-4 h-4" /> Mark all as read
          </Button>
        </div>

        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-card rounded-xl border p-4 card-shadow cursor-pointer transition-colors ${
                n.read ? "border-border" : "border-primary/30 bg-primary/5"
              }`}
              onClick={() => markRead(n.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{typeIcons[n.type] || <Bell className="w-5 h-5" />}</div>
                <div className="flex-1">
                  <p className={`text-sm ${n.read ? "text-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
