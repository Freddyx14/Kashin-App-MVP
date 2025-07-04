
import { useEffect, useState } from "react";
import UserHeader from "@/components/UserHeader";
import PromoCard from "@/components/PromoCard";
import LoanStatusCard from "@/components/LoanStatusCard";
import TransactionItem from "@/components/TransactionItem";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import PaymentAlert from "@/components/PaymentAlert";
import LoanCalculator from "@/components/LoanCalculator";
import { Users, Banknote, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
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

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email?.split('@')[0] || 'Usuario';
  };

  const handleLoanCreated = () => {
    fetchUserLoans(); // Recargar la lista de préstamos
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    return date.toLocaleDateString('es-ES', options)
      .replace(/^\w/, (c) => c.toUpperCase());
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
        <div className="flex items-center justify-between p-4">
          <UserHeader userName={getUserDisplayName()} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={16} />
          </Button>
        </div>
        
        <div className="px-4 pb-6">
          {/* Calculadora de Préstamos */}
          <LoanCalculator onLoanCreated={handleLoanCreated} />
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <PromoCard 
              icon={<Users size={24} />}
              title="¡Gana S/20 por cada amigo que invites!"
              onClick={() => navigate("/invitar")}
            />
            <PromoCard 
              icon={<Banknote size={24} />}
              title="¡Te devolvemos tus intereses y comisiones!"
              onClick={() => navigate("/recompensas")}
            />
          </div>
          
          {/* Estado del préstamo con información real */}
          <LoanStatusCard />
          
          {/* Últimas transacciones - Solo mostrar si hay préstamos */}
          {loans.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                Últimas transacciones
              </h2>
              
              {loans.map((loan) => (
                <TransactionItem
                  key={loan.id}
                  id={loan.id}
                  type="Préstamo Desembolsado"
                  description="Préstamo solicitado"
                  date={formatDate(loan.fecha_solicitud)}
                  amount={loan.monto_prestado}
                />
              ))}
            </div>
          )}
        </div>
        
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
