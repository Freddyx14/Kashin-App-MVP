
import BackButton from "@/components/ui/BackButton";
import PaymentSummary from "@/components/PaymentSummary";
import HelpButton from "@/components/HelpButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  
  const paymentData = {
    concept: "Pago de cuota",
    amount: 65.00,
    operationCode: "00815659",
    paymentMethod: "Web/app",
    bank: "BCP"
  };
  
  const handleConfirm = () => {
    navigate('/');
  };
  
  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Confirmar Pago" />
        
        <div className="mt-8 flex flex-col items-center px-4">
          <div className="bg-app-light-blue rounded-full p-8 mb-6">
            <img 
              src="/lovable-uploads/09022a71-a6f5-4796-81e4-ccd098389899.png" 
              alt="Pago exitoso" 
              className="w-24 h-24"
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">¡Ya casi terminamos!</h1>
          <p className="text-center text-gray-600 mb-8">
            Por favor confirma los datos de tu pago a continuación:
          </p>
          
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <p className="text-gray-500">Concepto</p>
              <p>{paymentData.concept}</p>
            </div>
            
            <div className="flex justify-between mb-2">
              <p className="text-gray-500">Cuota</p>
              <p>S/{paymentData.amount.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between mb-2">
              <p className="text-gray-500">Medio de pago</p>
              <p>{paymentData.paymentMethod}</p>
            </div>
            
            <div className="flex justify-between mb-2">
              <p className="text-gray-500">Banco</p>
              <p>{paymentData.bank}</p>
            </div>
            
            <div className="flex justify-between mb-2">
              <p className="text-gray-500">Código de operación</p>
              <p>{paymentData.operationCode}</p>
            </div>
            
            <PaymentSummary 
              concept={paymentData.concept}
              amount={paymentData.amount}
              isGratis={true}
            />
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-app-blue hover:bg-app-blue/90"
          onClick={handleConfirm}
        >
          Confirmar Pago
        </Button>
      </div>
      
      <HelpButton />
    </div>
  );
}
