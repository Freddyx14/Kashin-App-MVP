
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import PaymentSummary from "@/components/PaymentSummary";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AgentPaymentPage() {
  const [dni, setDni] = useState("");
  const [showCode, setShowCode] = useState(false);
  const navigate = useNavigate();
  
  // Generate a random payment code
  const paymentCode = `PAGO-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dni.length !== 8) {
      toast.error("El DNI debe contener 8 dígitos");
      return;
    }
    
    setShowCode(true);
  };
  
  const handleContinue = () => {
    navigate("/pagar/exito");
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Pago por agentes" />
        
        <div className="mt-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-xl font-bold">Pago por agentes autorizados</h1>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-4 flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>Este método incluye una comisión adicional</span>
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
                  <li>Realiza el pago indicado: S/ 65.00 + comisión</li>
                  <li>Guarda tu comprobante de pago</li>
                </ol>
              </div>
              
              <Button 
                className="w-full bg-app-blue hover:bg-app-blue/90"
                onClick={handleContinue}
              >
                Continuar
              </Button>
            </div>
          )}
          
          <div className="mt-8">
            <PaymentSummary
              concept="Pago de cuota"
              amount={65.00}
              isGratis={false}
              fees={9.00}
            />
          </div>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
