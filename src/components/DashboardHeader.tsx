
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserHeader from "@/components/UserHeader";

interface DashboardHeaderProps {
  userDisplayName: string;
}

export default function DashboardHeader({ userDisplayName }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente");
      navigate("/welcome");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <UserHeader userName={userDisplayName} />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut size={16} />
      </Button>
    </div>
  );
}
