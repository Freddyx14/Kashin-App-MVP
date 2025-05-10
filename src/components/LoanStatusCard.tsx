
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LoanStatusCardProps {
  isUpToDate: boolean;
  daysLeft: number;
  paymentDate: string;
  installment: string;
  amount: number;
}

export default function LoanStatusCard({ 
  isUpToDate, 
  daysLeft, 
  paymentDate, 
  installment, 
  amount 
}: LoanStatusCardProps) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-center mb-2">
        {isUpToDate ? "¡Estás al día!" : "Pago pendiente"}
      </h2>
      <p className="text-center text-gray-500 mb-4">
        Tu próxima cuota vence en {daysLeft} días:
      </p>
      
      <div className="flex items-center justify-between border-t pt-4">
        <button className="text-gray-400">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-gray-600">{paymentDate}</p>
          <p className="text-gray-600">Cuota {installment}</p>
        </div>
        <div className="text-2xl font-semibold text-gray-700">
          S/ {amount.toFixed(2)}
        </div>
        <button className="text-gray-400">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <Button 
        className="w-full mt-4 bg-app-blue hover:bg-app-blue/90 text-white"
        onClick={() => navigate('/pagar')}
      >
        Pagar
      </Button>
    </div>
  );
}
