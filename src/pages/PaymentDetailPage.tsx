
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import BankOption from "@/components/BankOption";
import PaymentSummary from "@/components/PaymentSummary";
import UploadReceiptButton from "@/components/UploadReceiptButton";
import HelpButton from "@/components/HelpButton";
import { Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PaymentDetailPage() {
  const [selectedBank, setSelectedBank] = useState<"BCP" | "Interbank">("BCP");
  const navigate = useNavigate();
  
  const bankAccountData = {
    accountNumber: "1919077858032",
    accountName: "KASHIN",
    amount: 65.00
  };
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };
  
  const handleContinue = () => {
    navigate('/pagar/confirmacion');
  };
  
  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Detalle de pago" />
        
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-4">Selecciona el medio de pago</h2>
          
          <div className="flex gap-4 mb-6">
            <BankOption 
              name="BCP" 
              selected={selectedBank === "BCP"}
              onClick={() => setSelectedBank("BCP")}
            />
            <BankOption 
              name="Interbank" 
              selected={selectedBank === "Interbank"}
              onClick={() => setSelectedBank("Interbank")}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500">Nro cuenta:</p>
              <div className="flex items-center gap-2">
                <p className="text-app-blue font-medium">{bankAccountData.accountNumber}</p>
                <button 
                  onClick={() => copyToClipboard(
                    bankAccountData.accountNumber, 
                    "Número de cuenta copiado"
                  )}
                >
                  <Copy size={16} className="text-app-blue" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-500">Nombre:</p>
              <div className="flex items-center gap-2">
                <p className="text-app-blue font-medium">{bankAccountData.accountName}</p>
                <button 
                  onClick={() => copyToClipboard(
                    bankAccountData.accountName, 
                    "Nombre copiado"
                  )}
                >
                  <Copy size={16} className="text-app-blue" />
                </button>
              </div>
            </div>
          </div>
          
          <PaymentSummary 
            concept="Pago de cuota"
            amount={bankAccountData.amount}
            isGratis={true}
          />
          
          <div className="mt-12">
            <p className="text-gray-600 text-center mb-6">
              Para continuar toma una captura de pantalla de 
              tu comprobante de pago y adjúntalo
            </p>
            
            <UploadReceiptButton />
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
