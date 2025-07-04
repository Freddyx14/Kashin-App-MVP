
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardContent from "@/components/DashboardContent";
import TransactionsList from "@/components/TransactionsList";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import PaymentAlert from "@/components/PaymentAlert";

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  dni: string;
  birth_date: string;
}

interface Loan {
  id: string;
  monto_prestado: number;
  fecha_solicitud: string;
}

export default function Dashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const fetchUserLoans = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select('*')
        .eq('id_usuario', user.id)
        .order('fecha_solicitud', { ascending: false });

      if (error) {
        console.error('Error fetching loans:', error);
      } else if (data) {
        setLoans(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching loans:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
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
        
        // Solo mostrar el pop-up si viene de un login exitoso
        if (location.state?.fromLogin) {
          setShowPaymentAlert(true);
          // Limpiar el estado para que no se muestre de nuevo
          window.history.replaceState({}, document.title);
        }
      }
    };

    fetchUserProfile();
    fetchUserLoans();
  }, [user, location]);

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email?.split('@')[0] || 'Usuario';
  };

  const handleLoanCreated = () => {
    fetchUserLoans(); // Recargar la lista de préstamos
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
        <DashboardHeader userDisplayName={getUserDisplayName()} />
        
        <DashboardContent onLoanCreated={handleLoanCreated} />
        
        <TransactionsList loans={loans} />
        
        <HelpButton />
        <BottomNav />
      </div>

      {/* Pop-up de alerta de pago */}
      <PaymentAlert 
        isOpen={showPaymentAlert} 
        onClose={() => setShowPaymentAlert(false)} 
      />
    </div>
  );
}
