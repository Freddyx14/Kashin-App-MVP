
import { Users, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PromoCard from "@/components/PromoCard";
import LoanCalculator from "@/components/LoanCalculator";
import LoanStatusCard from "@/components/LoanStatusCard";

interface DashboardContentProps {
  onLoanCreated: () => void;
}

export default function DashboardContent({ onLoanCreated }: DashboardContentProps) {
  const navigate = useNavigate();

  return (
    <div className="px-4 pb-6">
      {/* Calculadora de Préstamos */}
      <LoanCalculator onLoanCreated={onLoanCreated} />
      
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
    </div>
  );
}
