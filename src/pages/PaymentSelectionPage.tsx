
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import PaymentOption from "@/components/PaymentOption";
import { CreditCard, Phone, Landmark, Store } from "lucide-react";

export default function PaymentSelectionPage() {
  const [paymentType, setPaymentType] = useState<"single" | "full">("single");
  const navigate = useNavigate();
  
  const loanData = {
    date: "Domingo, 25 de mayo",
    installment: "1 de 1",
    amount: 65.00
  };
  
  const handlePaymentMethodSelect = (method: string) => {
    switch(method) {
      case "card":
        navigate("/pagar/tarjeta");
        break;
      case "yape":
        navigate("/pagar/yape");
        break;
      case "bank":
        navigate("/pagar/transferencia");
        break;
      case "agent":
        navigate("/pagar/agentes");
        break;
      default:
        break;
    }
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
            <PaymentOption 
              icon={<CreditCard size={24} className="text-app-blue" />}
              title="Tarjeta de débito"
              description="Validación instantánea"
              fee={{ text: "Comisión: Gratis", color: "turquoise" }}
              onClick={() => handlePaymentMethodSelect("card")}
            />
            
            <PaymentOption 
              icon={<Phone size={24} className="text-app-blue" />}
              title="Yape"
              description="Validación instantánea"
              fee={{ text: "Comisión: Gratis", color: "turquoise" }}
              onClick={() => handlePaymentMethodSelect("yape")}
            />
            
            <PaymentOption 
              icon={<Landmark size={24} className="text-app-blue" />}
              title="Transferencia bancaria"
              description="Validación instantánea"
              fee={{ text: "Comisión: Gratis", color: "turquoise" }}
              onClick={() => handlePaymentMethodSelect("bank")}
            />
            
            <PaymentOption 
              icon={<Store size={24} className="text-app-blue" />}
              title="Pago por agentes"
              description="Validación instantánea"
              fee={{ text: "Comisión: Hasta S/9", color: "orange" }}
              onClick={() => handlePaymentMethodSelect("agent")}
            />
          </div>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
