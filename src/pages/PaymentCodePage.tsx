
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import HelpButton from "@/components/HelpButton";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface BankDetail {
  name: string;
  logoUrl: string;
}

export default function PaymentCodePage() {
  const { bankId } = useParams<{ bankId: string }>();
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();
  
  // Generate a random payment code
  const paymentCode = `KSN-${Math.floor(1000 + Math.random() * 9000)}-${generateRandomString(4)}`;
  
  const bankDetails: Record<string, BankDetail> = {
    bcp: {
      name: "Banco de Crédito del Perú",
      logoUrl: "/lovable-uploads/695eaef7-1a39-4a32-b58f-cb1b52cf7acf.png"
    },
    interbank: {
      name: "Interbank",
      logoUrl: "/lovable-uploads/809428d0-98e2-4b8c-a025-5565f8325f41.png"
    },
    bbva: {
      name: "BBVA",
      logoUrl: "/lovable-uploads/2f584b01-0d8d-49dc-afff-f3492b4b8347.png"
    }
  };
  
  const bank = bankDetails[bankId || "bcp"];
  
  function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentCode);
    toast.success("Código copiado al portapapeles");
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Código de pago" />
        
        <div className="mt-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <img 
                src={bank.logoUrl} 
                alt={bank.name} 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h2 className="text-xl font-medium">{bank.name}</h2>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-2">Tu código de pago es</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-2xl font-bold font-mono">{paymentCode}</p>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Copy size={20} className="text-app-blue" />
              </button>
            </div>
            <p className="text-sm text-gray-600 px-8">
              Utiliza este código en tu banca móvil para realizar el pago a Kashin SAC
            </p>
          </div>
          
          <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowGuide(!showGuide)}
            >
              <h3 className="font-medium">Guía para pagar con el código</h3>
              {showGuide ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
            
            {showGuide && (
              <div className="p-4 pt-0 bg-gray-50">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Ir a tu banca móvil</li>
                  <li>Buscar "Pago a empresas" o "Pago a instituciones"</li>
                  <li>Buscar "Kashin SAC" en el buscador</li>
                  <li>Pegar el código de pago generado en el campo correspondiente</li>
                  <li>Confirmar el pago</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
