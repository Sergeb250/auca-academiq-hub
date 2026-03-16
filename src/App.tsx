import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import BrowsePage from "@/pages/BrowsePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
      {/* Placeholder routes for sidebar links */}
      <Route path="/my-submissions" element={<ProtectedRoute><PlaceholderPage title="My Submissions" /></ProtectedRoute>} />
      <Route path="/my-publications" element={<ProtectedRoute><PlaceholderPage title="My Publications" /></ProtectedRoute>} />
      <Route path="/my-reservations" element={<ProtectedRoute><PlaceholderPage title="My Reservations" /></ProtectedRoute>} />
      <Route path="/submit/project" element={<ProtectedRoute><PlaceholderPage title="Submit Project" /></ProtectedRoute>} />
      <Route path="/submit/publication" element={<ProtectedRoute><PlaceholderPage title="Submit Publication" /></ProtectedRoute>} />
      <Route path="/supervised" element={<ProtectedRoute><PlaceholderPage title="Supervised Students" /></ProtectedRoute>} />
      <Route path="/moderation" element={<ProtectedRoute><PlaceholderPage title="Moderation Queue" /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><PlaceholderPage title="Notifications" /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><PlaceholderPage title="User Management" /></ProtectedRoute>} />
      <Route path="/admin/reservations" element={<ProtectedRoute><PlaceholderPage title="Reservation Settings" /></ProtectedRoute>} />
      <Route path="/admin/schedule" element={<ProtectedRoute><PlaceholderPage title="Access Schedule" /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><PlaceholderPage title="Reports & Audit Logs" /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><PlaceholderPage title="Platform Settings" /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><PlaceholderPage title="Help" /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  const { AppLayout } = require("@/components/AppLayout");
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-xl font-heading font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-2">This page will be built in a future iteration.</p>
        </div>
      </div>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
