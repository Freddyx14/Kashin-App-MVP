
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PaymentMethodModal from "./PaymentMethodModal";

interface LoanCalculatorProps {
  onLoanCreated: () => void;
}

export default function LoanCalculator({ onLoanCreated }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState([200]);
  const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuth();

  // Calcular valores del préstamo
  const interestRate = 0.3; // 30%
  const interest = Math.round(loanAmount[0] * interestRate);
  const totalToReturn = loanAmount[0] + interest;

  // Determinar opciones de cuotas disponibles según el monto
  const getAvailableInstallments = (amount: number) => {
    if (amount >= 50 && amount <= 100) return [1];
    if (amount >= 150 && amount <= 400) return [1, 2];
    if (amount >= 450 && amount <= 800) return [1, 2, 3];
    return [1];
  };

  const availableInstallments = getAvailableInstallments(loanAmount[0]);
  const installmentAmount = selectedInstallments ? Math.round(totalToReturn / selectedInstallments) : 0;

  const handleLoanRequest = () => {
    if (!user) {
      toast.error("Debes estar autenticado para solicitar un préstamo");
      return;
    }
    
    if (selectedInstallments === null) {
      toast.error("Selecciona el número de cuotas a pagar");
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentMethod: string, paymentDetail: string) => {
    if (!user || selectedInstallments === null) return;

    setIsLoading(true);
    
    try {
      // Calcular fecha del primer pago (30 días después)
      const firstPaymentDate = new Date();
      firstPaymentDate.setDate(firstPaymentDate.getDate() + 30);

      const { error } = await supabase
        .from('prestamos')
        .insert({
          id_usuario: user.id,
          monto_prestado: loanAmount[0],
          interes: interest,
          total_a_devolver: totalToReturn,
          cuotas_totales: selectedInstallments,
          monto_por_cuota: installmentAmount,
          fecha_primer_pago: firstPaymentDate.toISOString().split('T')[0],
          dias_para_pago: 30,
          metodo_pago: paymentMethod,
          detalle_pago: paymentDetail,
          estado: 'Procesando'
        });

      if (error) {
        console.error('Error creating loan:', error);
        toast.error("Error al solicitar el préstamo");
      } else {
        toast.success(`Préstamo de S/ ${loanAmount[0]} solicitado exitosamente`);
        setSelectedInstallments(null); // Reset selection
        onLoanCreated();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Error inesperado al solicitar el préstamo");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset installments when amount changes to invalid range
  const handleAmountChange = (value: number[]) => {
    setLoanAmount(value);
    const availableOptions = getAvailableInstallments(value[0]);
    if (selectedInstallments && !availableOptions.includes(selectedInstallments)) {
      setSelectedInstallments(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} className="text-app-blue" />
          <h2 className="text-lg font-semibold text-gray-900">Calculadora de Préstamos</h2>
        </div>
        
        <div className="space-y-6">
          {/* Slider de monto */}
          <div>
            <p className="text-center text-2xl font-bold text-app-blue mb-2">
              Monto seleccionado: S/ {loanAmount[0]}
            </p>
            <Slider
              value={loanAmount}
              onValueChange={handleAmountChange}
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

          {/* Información del préstamo */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Información del préstamo:</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Monto prestado:</span>
              <span className="font-medium">S/ {loanAmount[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Intereses (30%):</span>
              <span className="font-medium">S/ {interest}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold text-gray-800">Total a devolver:</span>
              <span className="font-bold text-app-blue">S/ {totalToReturn}</span>
            </div>
          </div>

          {/* Selección de cuotas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Selecciona el número de cuotas para pagar:</h3>
            <RadioGroup 
              value={selectedInstallments?.toString() || ""} 
              onValueChange={(value) => setSelectedInstallments(parseInt(value))}
            >
              {availableInstallments.map((installments) => {
                const amountPerInstallment = Math.round(totalToReturn / installments);
                return (
                  <div key={installments} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={installments.toString()} id={`installments-${installments}`} />
                    <Label htmlFor={`installments-${installments}`} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>{installments} cuota{installments > 1 ? 's' : ''}</span>
                        <span className="font-medium text-app-blue">
                          S/ {amountPerInstallment} {installments > 1 ? 'c/u' : ''}
                        </span>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
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

      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        loanAmount={loanAmount[0]}
      />
    </>
  );
}
