
import { useState, useEffect } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import { Phone, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import PaymentSummary from "@/components/PaymentSummary";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentData {
  loanData: any;
  paymentType: "single" | "full";
  paymentInfo: {
    date: string;
    installment: string;
    amount: number;
  };
  daysLeft: number;
}

export default function YapePaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [approvalCode, setApprovalCode] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: "", approvalCode: "" });
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state) {
      setPaymentData(location.state as PaymentData);
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = { phoneNumber: "", approvalCode: "" };
    let isValid = true;

    if (phoneNumber.length !== 9 || !/^\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "El número de celular es incorrecto";
      isValid = false;
    }

    if (approvalCode.length !== 6 || !/^\d{6}$/.test(approvalCode)) {
      newErrors.approvalCode = "Código de aprobación incorrecto.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const generatePaymentReference = () => {
    const timestamp = new Date().getTime();
    return `YAPE-${timestamp}`;
  };

  const registerPayment = async () => {
    if (!user || !paymentData) return null;

    const referencia = generatePaymentReference();
    const tipoPage = paymentData.paymentType === "single" ? "cuota_individual" : "pago_completo";

    try {
      const { error } = await supabase
        .from('pagos_cuotas')
        .insert({
          id_usuario: user.id,
          id_prestamo: paymentData.loanData.id,
          tipo_pago: tipoPage,
          monto_pagado: paymentData.paymentInfo.amount,
          metodo_pago: 'Yape',
          detalle_pago: phoneNumber,
          referencia_pago: referencia
        });

      if (error) {
        console.error('Error registering payment:', error);
        return null;
      }

      return referencia;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!paymentData) {
      toast.error("No se encontraron datos del pago");
      return;
    }

    setIsProcessing(true);
    toast("📲 Pago con Yape iniciado, estamos procesando tu pago con Yape...");
    
    setTimeout(async () => {
      const referencia = await registerPayment();
      
      if (referencia) {
        navigate("/pagar/exito", { 
          state: { 
            paymentData,
            referencia,
            metodo: 'Yape'
          } 
        });
      } else {
        toast.error("Error al procesar el pago");
        setIsProcessing(false);
      }
    }, 3000);
  };

  if (!paymentData) {
    return (
      <div className="container mx-auto max-w-md bg-white min-h-screen">
        <div className="px-4">
          <BackButton title="Pago con Yape" />
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
      <div className="px-4">
        <BackButton title="Pago con Yape" />
        
        <div className="mt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <Phone size={32} className="text-purple-600" />
            </div>
          </div>
          
          <form className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Número de celular asociado a Yape</Label>
              <Input
                id="phoneNumber"
                placeholder="999 999 999"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 9) {
                    setPhoneNumber(value);
                    if (errors.phoneNumber) {
                      setErrors(prev => ({ ...prev, phoneNumber: "" }));
                    }
                  }
                }}
                className={`mt-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                type="tel"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="approvalCode">Código de aprobación</Label>
              <Input
                id="approvalCode"
                placeholder="Ingresa el código de Yape"
                value={approvalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setApprovalCode(value);
                    if (errors.approvalCode) {
                      setErrors(prev => ({ ...prev, approvalCode: "" }));
                    }
                  }
                }}
                className={`mt-1 ${errors.approvalCode ? 'border-red-500' : ''}`}
                type="tel"
              />
              {errors.approvalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.approvalCode}</p>
              )}
            </div>
            
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer"
              onClick={() => setShowHelp(!showHelp)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} className="text-app-blue" />
                  <span className="font-medium">¿Dónde encuentro mi código de aprobación?</span>
                </div>
                {showHelp ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>
              
              {showHelp && (
                <div className="mt-4 text-gray-600 text-sm">
                  <p className="mb-2">Para encontrar tu código de aprobación:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Abre la app de Yape</li>
                    <li>Ve al menú principal</li>
                    <li>Selecciona "Aprobar pagos"</li>
                    <li>Copia el código mostrado</li>
                    <li>Este código de aprobación tiene 6 dígitos.</li>
                  </ol>
                </div>
              )}
            </div>
          </form>
          
          <div className="mt-6">
            <PaymentSummary
              concept="Pago de cuota"
              amount={paymentData.paymentInfo.amount}
              isGratis={true}
            />
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-app-blue hover:bg-app-blue/90"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Procesando..." : "Pagar con Yape"}
        </Button>
      </div>
      
      <HelpButton />
    </div>
  );
}
