
import { useEffect, useState } from "react";
import UserHeader from "@/components/UserHeader";
import BalanceCard from "@/components/BalanceCard";
import PromoCard from "@/components/PromoCard";
import LoanStatusCard from "@/components/LoanStatusCard";
import TransactionItem from "@/components/TransactionItem";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import PaymentAlert from "@/components/PaymentAlert";
import { Users, Banknote, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

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
        // Mostrar el pop-up de alerta después de cargar
        setShowPaymentAlert(true);
      }
    };

    fetchUserProfile();
  }, [user]);

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

  // Datos de ejemplo para el resto de la funcionalidad
  const userData = {
    availableBalance: 50.00,
    creditLine: 100.00,
    points: 0,
    maxPoints: 750,
    loan: {
      isUpToDate: true,
      daysLeft: 30,
      paymentDate: "Domingo 25 de Mayo",
      installment: "1 de 1",
      amount: 65.00
    },
    transactions: [
      {
        id: "tx1",
        type: "Préstamo Desembolsado",
        description: "Préstamo inicial",
        date: "Viernes 25 De Abril",
        amount: 50.00
      }
    ]
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
          <BalanceCard 
            availableBalance={userData.availableBalance}
            creditLine={userData.creditLine}
            points={userData.points}
            maxPoints={userData.maxPoints}
          />
          
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
          
          <LoanStatusCard 
            isUpToDate={userData.loan.isUpToDate}
            daysLeft={userData.loan.daysLeft}
            paymentDate={userData.loan.paymentDate}
            installment={userData.loan.installment}
            amount={userData.loan.amount}
          />
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
              Últimas transacciones
            </h2>
            
            {userData.transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                id={tx.id}
                type={tx.type}
                description={tx.description}
                date={tx.date}
                amount={tx.amount}
              />
            ))}
          </div>
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
