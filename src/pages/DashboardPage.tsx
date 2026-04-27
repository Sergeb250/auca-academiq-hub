import { useAuth } from "@/contexts/AuthContext";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { LecturerDashboard } from "@/components/dashboards/LecturerDashboard";
import { HodDashboard } from "@/components/dashboards/HodDashboard";
import { ModeratorDashboard } from "@/components/dashboards/ModeratorDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { AppLayout } from "@/components/AppLayout";

const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const dashboards = {
    student: StudentDashboard,
    lecturer: LecturerDashboard,
    hod: HodDashboard,
    moderator: ModeratorDashboard,
    admin: AdminDashboard,
  };

  const Dashboard = dashboards[user.role];

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default DashboardPage;
