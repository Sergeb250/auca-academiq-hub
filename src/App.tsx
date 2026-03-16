import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import BrowsePage from "@/pages/BrowsePage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import MySubmissionsPage from "@/pages/MySubmissionsPage";
import MyPublicationsPage from "@/pages/MyPublicationsPage";
import MyReservationsPage from "@/pages/MyReservationsPage";
import SubmitProjectPage from "@/pages/SubmitProjectPage";
import SubmitPublicationPage from "@/pages/SubmitPublicationPage";
import SupervisedStudentsPage from "@/pages/SupervisedStudentsPage";
import ModerationPage from "@/pages/ModerationPage";
import NotificationsPage from "@/pages/NotificationsPage";
import HelpPage from "@/pages/HelpPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminReservationsPage from "@/pages/admin/AdminReservationsPage";
import AdminSchedulePage from "@/pages/admin/AdminSchedulePage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
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
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
      <Route path="/publications/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
      <Route path="/my-submissions" element={<ProtectedRoute><MySubmissionsPage /></ProtectedRoute>} />
      <Route path="/my-publications" element={<ProtectedRoute><MyPublicationsPage /></ProtectedRoute>} />
      <Route path="/my-reservations" element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />
      <Route path="/submit/project" element={<ProtectedRoute><SubmitProjectPage /></ProtectedRoute>} />
      <Route path="/submit/publication" element={<ProtectedRoute><SubmitPublicationPage /></ProtectedRoute>} />
      <Route path="/supervised" element={<ProtectedRoute><SupervisedStudentsPage /></ProtectedRoute>} />
      <Route path="/moderation" element={<ProtectedRoute><ModerationPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/reservations" element={<ProtectedRoute><AdminReservationsPage /></ProtectedRoute>} />
      <Route path="/admin/schedule" element={<ProtectedRoute><AdminSchedulePage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><AdminReportsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
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
