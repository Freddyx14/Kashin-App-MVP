
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LoanCalculatorProps {
  onLoanCreated: () => void;
}

export default function LoanCalculator({ onLoanCreated }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState([200]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleLoanRequest = async () => {
    if (!user) {
      toast.error("Debes estar autenticado para solicitar un préstamo");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('prestamos')
        .insert({
          id_usuario: user.id,
          monto_prestamo: loanAmount[0]
        });

      if (error) {
        console.error('Error creating loan:', error);
        toast.error("Error al solicitar el préstamo");
      } else {
        toast.success(`Préstamo de S/ ${loanAmount[0]} solicitado exitosamente`);
        onLoanCreated(); // Actualizar la lista de transacciones
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Error inesperado al solicitar el préstamo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} className="text-app-blue" />
        <h2 className="text-lg font-semibold text-gray-900">Calculadora de Préstamos</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-center text-2xl font-bold text-app-blue mb-2">
            Monto seleccionado: S/ {loanAmount[0]}
          </p>
          <Slider
            value={loanAmount}
            onValueChange={setLoanAmount}
            max={800}
            min={50}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>S/ 50</span>
            <span>S/ 800</span>
          </div>
        </div>
        
        <Button 
          onClick={handleLoanRequest}
          disabled={isLoading}
          className="w-full bg-app-blue hover:bg-app-blue/90 py-3 text-base font-medium"
        >
          {isLoading ? "Procesando..." : "Pedir préstamo"}
        </Button>
      </div>
    </div>
  );
}
