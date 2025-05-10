
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import PaymentSummary from "@/components/PaymentSummary";
import HelpButton from "@/components/HelpButton";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function PaymentConfirmationPage() {
  const navigate = useNavigate();
  const [operationCode, setOperationCode] = useState("00815659");
  const [amount, setAmount] = useState("65.00");
  const [isOperationValid, setIsOperationValid] = useState(true);
  const [isAmountValid, setIsAmountValid] = useState(true);
  
  const paymentData = {
    concept: "Pago de cuota",
    amount: 65.00,
    bank: "BCP",
    operationCode: "00815659"
  };

  const handleConfirm = () => {
    navigate('/pagar/exito');
  };
  
  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Detalle de pago" />
        
        <div className="my-8 border p-6 rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/7279bca4-127a-4e3d-ac45-df8b43dbe0b5.png" 
                alt="BCP" 
                className="w-10 h-10"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-app-blue/10 rounded-full flex items-center justify-center">
                <Check size={16} className="text-app-blue" />
              </div>
              <h2 className="text-xl font-semibold">¡Transferencia exitosa!</h2>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-3xl font-bold mb-2">S/ {paymentData.amount.toFixed(2)}</p>
              <p className="text-gray-500">Viernes, 25 Abril 2025 - 09:44 a.m.</p>
            </div>
            
            <div className="w-full border-t pt-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Enviado a</p>
                <div className="text-right">
                  <p className="font-medium">Kashin</p>
                  <p className="text-gray-500 text-sm">**** 8032</p>
                  <p className="text-sm">Moneda Soles</p>
                </div>
              </div>
              
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Desde</p>
                <div className="text-right">
                  <p className="font-medium">Cuenta Digital Soles</p>
                  <p className="text-gray-500 text-sm">****3044</p>
                </div>
              </div>
              
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Número de operación</p>
                <p>{paymentData.operationCode}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="mb-4">
              <p className="mb-2">Código de operación</p>
              <div className="flex gap-2 items-center">
                <Input 
                  value={operationCode}
                  onChange={(e) => setOperationCode(e.target.value)}
                  className="flex-1"
                />
                <div className="h-10 w-20 bg-app-turquoise rounded-full flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Monto</p>
              <div className="flex gap-2 items-center">
                <Input 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                  prefix="S/"
                />
                <div className="h-10 w-20 bg-app-turquoise rounded-full flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-app-blue hover:bg-app-blue/90"
          onClick={handleConfirm}
        >
          Confirmar Datos
        </Button>
      </div>
      
      <HelpButton />
    </div>
  );
}
