
import { useEffect, useState } from "react";
import UserHeader from "@/components/UserHeader";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import { ChevronRight, User, Shield, FileText, CreditCard, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

interface UserProfile {
  first_name: string;
  last_name: string;
}

const MenuItem = ({ icon, title, onClick }: MenuItemProps) => (
  <button 
    className="flex items-center justify-between w-full p-4 border-b"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      {icon}
      <span>{title}</span>
    </div>
    <ChevronRight size={20} className="text-gray-400" />
  </button>
);

export default function MorePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email?.split('@')[0] || 'Usuario';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-app-gray min-h-screen">
      <div className="container mx-auto max-w-md bg-white">
        <UserHeader userName={getUserDisplayName()} />
        
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Más opciones</h1>
          
          <div className="bg-white rounded-lg shadow-sm">
            <MenuItem 
              icon={<User size={20} className="text-app-blue" />}
              title="Mi perfil"
              onClick={() => {}}
            />
            <MenuItem 
              icon={<Shield size={20} className="text-app-blue" />}
              title="Seguridad"
              onClick={() => {}}
            />
            <MenuItem 
              icon={<FileText size={20} className="text-app-blue" />}
              title="Términos y condiciones"
              onClick={() => {}}
            />
            <MenuItem 
              icon={<CreditCard size={20} className="text-app-blue" />}
              title="Mis tarjetas"
              onClick={() => {}}
            />
            <MenuItem 
              icon={<Phone size={20} className="text-app-blue" />}
              title="Contáctanos"
              onClick={() => {}}
            />
            <MenuItem 
              icon={<LogOut size={20} className="text-app-blue" />}
              title="Cerrar sesión"
              onClick={() => {}}
            />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">Versión 1.0.0</p>
            <p className="text-gray-500 text-sm">© 2025 Kashin. Todos los derechos reservados.</p>
          </div>
        </div>
        
        <HelpButton />
        <BottomNav />
      </div>
    </div>
  );
}
