
import { useState, useEffect } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import PaymentSummary from "@/components/PaymentSummary";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
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

export default function AgentPaymentPage() {
  const [dni, setDni] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state) {
      setPaymentData(location.state as PaymentData);
    }
  }, [location.state]);
  
  const paymentCode = `PAGO-${Math.floor(100000 + Math.random() * 900000)}`;
  const comision = 9.00;
  const totalAmount = paymentData ? paymentData.paymentInfo.amount + comision : 0;

  const generatePaymentReference = () => {
    const timestamp = new Date().getTime();
    return `AGENT-${timestamp}`;
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
          metodo_pago: 'Pago por agentes',
          detalle_pago: dni,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dni.length !== 8) {
      toast.error("El DNI debe contener 8 dígitos");
      return;
    }
    
    setShowCode(true);
  };

  const handlePayment = async () => {
    if (!paymentData) {
      toast.error("No se encontraron datos del pago");
      return;
    }

    setIsProcessing(true);
    toast("🏪 Pago por agentes iniciado, procesando...");
    
    setTimeout(async () => {
      const referencia = await registerPayment();
      
      if (referencia) {
        navigate("/pagar/exito", { 
          state: { 
            paymentData: {
              ...paymentData,
              paymentInfo: {
                ...paymentData.paymentInfo,
                amount: totalAmount
              }
            },
            referencia,
            metodo: 'Pago por agentes'
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
          <BackButton title="Pago por agentes" />
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
        <BackButton title="Pago por agentes" />
        
        <div className="mt-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-xl font-bold">Pago por agentes autorizados</h1>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-4 flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>Este método incluye una comisión adicional si estás en provincia</span>
            </div>
          </div>
          
          {!showCode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="dni">Documento de identidad (DNI)</Label>
                <Input
                  id="dni"
                  placeholder="12345678"
                  value={dni}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) {
                      setDni(value);
                    }
                  }}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Ingresa el DNI para generar tu código de pago</p>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-app-blue hover:bg-app-blue/90"
              >
                Completar
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-2">Usa este código en el agente autorizado</p>
              <p className="text-3xl font-bold font-mono mb-6">{paymentCode}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h3 className="font-semibold mb-2">Instrucciones</h3>
                <ol className="list-decimal text-left pl-4 text-gray-600">
                  <li>Dirígete a cualquier agente autorizado</li>
                  <li>Menciona que realizarás un pago a "Kashin SAC"</li>
                  <li>Brinda el código de operación mostrado arriba</li>
                  <li>Realiza el pago indicado: S/ {totalAmount.toFixed(2)}</li>
                  <li>Guarda tu comprobante de pago</li>
                </ol>
              </div>

              <Button 
                className="w-full bg-app-blue hover:bg-app-blue/90 mb-4"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Confirmar pago"}
              </Button>
            </div>
          )}
          
          <div className="mt-8">
            <PaymentSummary
              concept="Pago de cuota"
              amount={paymentData.paymentInfo.amount}
              isGratis={false}
              fees={comision}
            />
          </div>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
