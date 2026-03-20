import { useRoles } from "@/hooks/use-roles";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const DashboardPage: React.FC = () => {
  const { isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOrganizer) {
      navigate("/dashboard/events");
    } else if (isStaff) {
      navigate("/dashboard/validate-qr");
    } else {
      navigate("/dashboard/tickets");
    }
  }, [isOrganizer, isStaff, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
