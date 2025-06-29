
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import { Phone, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import PaymentSummary from "@/components/PaymentSummary";

export default function YapePaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [approvalCode, setApprovalCode] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: "", approvalCode: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { phoneNumber: "", approvalCode: "" };
    let isValid = true;

    // Validar número de celular (exactamente 9 dígitos)
    if (phoneNumber.length !== 9 || !/^\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "El número de celular es incorrecto";
      isValid = false;
    }

    // Validar código de aprobación (exactamente 6 dígitos)
    if (approvalCode.length !== 6 || !/^\d{6}$/.test(approvalCode)) {
      newErrors.approvalCode = "Código de aprobación incorrecto.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = () => {
    // Validar formulario antes de proceder
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    toast("📲 Pago con Yape iniciado, estamos procesando tu pago con Yape...");
    
    // Simulate processing delay
    setTimeout(() => {
      navigate("/pagar/exito");
    }, 5000);
  };

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
                    // Limpiar error si el usuario está escribiendo
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
                    // Limpiar error si el usuario está escribiendo
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
              amount={65.00}
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
