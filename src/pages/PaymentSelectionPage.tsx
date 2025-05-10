
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";

export default function PaymentSelectionPage() {
  const [paymentType, setPaymentType] = useState<"single" | "full">("single");
  const navigate = useNavigate();
  
  const loanData = {
    date: "Domingo, 25 de mayo",
    installment: "1 de 1",
    amount: 65.00
  };
  
  const handleContinue = () => {
    navigate('/pagar/metodo');
  };
  
  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen">
      <div className="px-4">
        <BackButton title="Selecciona qué vas a pagar:" />
        
        <div className="mt-6 flex gap-4">
          <button
            className={`flex-1 py-3 rounded-full text-center ${
              paymentType === "single" 
                ? "bg-app-turquoise text-white" 
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setPaymentType("single")}
          >
            Una cuota
          </button>
          <button
            className={`flex-1 py-3 rounded-full text-center ${
              paymentType === "full" 
                ? "bg-app-turquoise text-white" 
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setPaymentType("full")}
          >
            Todo el préstamo
          </button>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700">{loanData.date}</p>
              <p className="text-gray-700">Cuota {loanData.installment}</p>
            </div>
            <div className="text-3xl font-semibold">
              S/{loanData.amount.toFixed(2)}
            </div>
          </div>
          
          <h2 className="mt-12 mb-4 text-xl font-medium">¿Cómo lo vas a pagar?</h2>
          
          <div className="mt-4 space-y-4">
            <div className="border border-app-blue rounded-lg p-4 relative">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-app-blue bg-white"></div>
              <div className="ml-8">
                <div className="flex items-center gap-4">
                  <div className="bg-app-light-blue p-2 rounded-lg">
                    <img 
                      src="/lovable-uploads/09022a71-a6f5-4796-81e4-ccd098389899.png" 
                      alt="App banco" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium">App o web de banco</p>
                    <p className="text-gray-500 text-sm">Acreditación en 30 minutos</p>
                  </div>
                </div>
                <div className="absolute -right-1 top-0 bg-app-turquoise text-white text-xs px-3 py-1 rounded-lg">
                  Comisión: Gratis
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 relative">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-gray-300 bg-white"></div>
              <div className="ml-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <img 
                      src="/lovable-uploads/0cf98db7-0df5-4d58-9e93-6a75fdcc50ad.png" 
                      alt="Agente" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Agente o ventanilla</p>
                    <p className="text-gray-500 text-sm">Validado en 24 horas</p>
                  </div>
                </div>
                <div className="absolute -right-1 top-0 bg-orange-400 text-white text-xs px-3 py-1 rounded-lg">
                  Comisión: Hasta S/9
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-app-blue hover:bg-app-blue/90"
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
      
      <HelpButton />
    </div>
  );
}
