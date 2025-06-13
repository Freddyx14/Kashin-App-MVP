
import { useEffect, useState } from "react";
import UserHeader from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateInvitationCode } from "@/utils/userUtils";

interface UserProfile {
  first_name: string;
  last_name: string;
}

export default function InvitePage() {
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

  const getInvitationCode = () => {
    if (userProfile?.first_name) {
      return generateInvitationCode(userProfile.first_name);
    }
    return "USER0000";
  };

  const handleShareCode = async () => {
    const invitationCode = getInvitationCode();
    
    try {
      await navigator.clipboard.writeText(invitationCode);
      toast({
        title: "¡Código copiado!",
        description: "El código de invitación se ha copiado al portapapeles",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "No se pudo copiar el código",
        variant: "destructive",
      });
    }
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
        
        <div className="px-4 py-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Invita a tus amigos</h1>
          
          <div className="bg-app-blue text-white rounded-lg p-6 mb-8 w-full text-center">
            <h2 className="text-xl font-semibold mb-2">¡Gana S/20 por cada amigo!</h2>
            <p>Comparte tu código de invitación y gana cuando tus amigos obtengan su préstamo</p>
            
            <div className="bg-white text-app-blue rounded-lg p-3 mt-4 font-bold text-xl">
              {getInvitationCode()}
            </div>
          </div>
          
          <Button 
            className="w-full bg-app-blue hover:bg-app-blue/90 mb-4"
            onClick={handleShareCode}
          >
            Compartir código
          </Button>
        </div>
        
        <HelpButton />
        <BottomNav />
      </div>
    </div>
  );
}
