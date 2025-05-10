
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import HelpButton from "@/components/HelpButton";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4 flex flex-col items-center">
        <div className="w-full">
          <BackButton title="Pago exitoso" />
        </div>
        
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="bg-app-turquoise/10 p-6 rounded-full mb-6">
            <CheckCircle size={80} className="text-app-turquoise" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">¡Pago realizado exitosamente!</h1>
          <p className="text-gray-600 mb-8 max-w-xs">
            Tu pago ha sido procesado correctamente. El monto de S/65.00 ha sido aplicado a tu cuenta.
          </p>
          
          <div className="w-full max-w-xs">
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium">25 mayo, 2025</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Hora:</span>
                <span className="font-medium">10:45 AM</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Monto:</span>
                <span className="font-medium">S/ 65.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Referencia:</span>
                <span className="font-medium">PAG-25052025-1045</span>
              </div>
            </div>
            
            <Button
              className="w-full bg-app-blue hover:bg-app-blue/90"
              onClick={handleContinue}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
