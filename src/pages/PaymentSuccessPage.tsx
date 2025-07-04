
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import HelpButton from "@/components/HelpButton";
import { CheckCircle } from "lucide-react";

interface PaymentSuccessData {
  paymentData: {
    loanData: any;
    paymentType: "single" | "full";
    paymentInfo: {
      date: string;
      installment: string;
      amount: number;
    };
    daysLeft: number;
  };
  referencia: string;
  metodo: string;
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);
  
  useEffect(() => {
    if (location.state) {
      setSuccessData(location.state as PaymentSuccessData);
    }
  }, [location.state]);

  const handleContinue = () => {
    navigate("/customer-feedback");
  };

  const formatCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return now.toLocaleDateString('es-ES', options);
  };

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!successData) {
    return (
      <div className="container mx-auto max-w-md bg-white min-h-screen">
        <div className="px-4">
          <BackButton title="Pago exitoso" />
          <div className="text-center mt-8">
            <p className="text-gray-600">No se encontraron datos del pago</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-app-blue hover:bg-app-blue/90"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Tu pago ha sido procesado correctamente. El monto de S/ {successData.paymentData.paymentInfo.amount.toFixed(2)} ha sido aplicado a tu cuenta.
          </p>
          
          <div className="w-full max-w-xs">
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium">{formatCurrentDate()}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Hora:</span>
                <span className="font-medium">{formatCurrentTime()}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Monto:</span>
                <span className="font-medium">S/ {successData.paymentData.paymentInfo.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Método:</span>
                <span className="font-medium">{successData.metodo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Referencia:</span>
                <span className="font-medium">{successData.referencia}</span>
              </div>
            </div>
            
            <Button
              className="w-full bg-app-blue hover:bg-app-blue/90"
              onClick={handleContinue}
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
