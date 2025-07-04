
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import PaymentOption from "@/components/PaymentOption";
import { CreditCard, Phone, Landmark, Store } from "lucide-react";

interface LoanData {
  id: string;
  monto_prestado: number;
  interes: number;
  total_a_devolver: number;
  cuotas_totales: number;
  monto_por_cuota: number;
  fecha_primer_pago: string;
  dias_para_pago: number;
  estado: string;
  created_at: string;
  cuotas_pagadas?: number;
  monto_pagado?: number;
}

export default function PaymentSelectionPage() {
  const [paymentType, setPaymentType] = useState<"single" | "full">("single");
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    if (location.state?.loanData) {
      setLoanData(location.state.loanData);
      setDaysLeft(location.state.daysLeft || 0);
    }
  }, [location.state]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    return date.toLocaleDateString('es-ES', options)
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const calculateLastPaymentDate = () => {
    if (!loanData) return "";
    
    const firstPaymentDate = new Date(loanData.fecha_primer_pago);
    const lastPaymentDate = new Date(firstPaymentDate);
    lastPaymentDate.setMonth(lastPaymentDate.getMonth() + (loanData.cuotas_totales - 1));
    
    return formatDate(lastPaymentDate.toISOString());
  };

  const getPaymentInfo = () => {
    if (!loanData) return { date: "", installment: "", amount: 0 };

    const cuotasPagadas = loanData.cuotas_pagadas || 0;
    const cuotasRestantes = loanData.cuotas_totales - cuotasPagadas;
    const montoRestante = loanData.total_a_devolver - (loanData.monto_pagado || 0);

    if (paymentType === "single") {
      return {
        date: formatDate(loanData.fecha_primer_pago),
        installment: `${cuotasPagadas + 1} de ${loanData.cuotas_totales}`,
        amount: loanData.monto_por_cuota
      };
    } else {
      return {
        date: calculateLastPaymentDate(),
        installment: "Todas las cuotas restantes",
        amount: montoRestante
      };
    }
  };

  const paymentInfo = getPaymentInfo();
  
  const handlePaymentMethodSelect = (method: string) => {
    const paymentData = {
      loanData,
      paymentType,
      paymentInfo,
      daysLeft
    };

    switch(method) {
      case "card":
        navigate("/pagar/tarjeta", { state: paymentData });
        break;
      case "yape":
        navigate("/pagar/yape", { state: paymentData });
        break;
      case "bank":
        navigate("/pagar/transferencia", { state: paymentData });
        break;
      case "agent":
        navigate("/pagar/agentes", { state: paymentData });
        break;
      default:
        break;
    }
  };

  if (!loanData) {
    return (
      <div className="container mx-auto max-w-md bg-white min-h-screen">
        <div className="px-4">
          <BackButton title="Selecciona qué vas a pagar:" />
          <div className="text-center mt-8">
            <p className="text-gray-600">No se encontraron datos del préstamo</p>
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
              <p className="text-gray-700">{paymentInfo.date}</p>
              <p className="text-gray-700">Cuota {paymentInfo.installment}</p>
            </div>
            <div className="text-3xl font-semibold">
              S/{paymentInfo.amount.toFixed(2)}
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
