
import { useEffect, useState } from "react";
import UserHeader from "@/components/UserHeader";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  first_name: string;
  last_name: string;
}

export default function RewardsPage() {
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
          <h1 className="text-2xl font-bold mb-6">Recompensas</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Tus puntos</h2>
            
            <div className="flex justify-between items-center mb-2">
              <p>Puntos acumulados</p>
              <p className="font-bold">0</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-app-blue h-2 rounded-full w-0" />
            </div>
            
            <p className="text-center text-gray-600">
              Obtén puntos pagando tus cuotas a tiempo
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Beneficios</h2>
            
            <div className="bg-app-light-blue p-4 rounded-lg mb-4">
              <p className="font-medium">Obtén descuentos en tus próximos préstamos</p>
              <p className="text-gray-600 text-sm">Acumula 500 puntos</p>
            </div>
            
            <div className="bg-app-light-blue p-4 rounded-lg mb-4">
              <p className="font-medium">Aumenta tu línea de crédito</p>
              <p className="text-gray-600 text-sm">Acumula 1000 puntos</p>
            </div>
            
            <div className="bg-app-light-blue p-4 rounded-lg">
              <p className="font-medium">Obtén devolución de intereses</p>
              <p className="text-gray-600 text-sm">Acumula 1500 puntos</p>
            </div>
          </div>
        </div>
        
        <HelpButton />
        <BottomNav />
      </div>
    </div>
  );
}
