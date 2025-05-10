
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import HelpButton from "@/components/HelpButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import PaymentSummary from "@/components/PaymentSummary";

interface BankOption {
  id: string;
  name: string;
  logoUrl: string;
  accountNumber: string;
  accountName: string;
}

export default function BankTransferPage() {
  const navigate = useNavigate();
  
  const banks: BankOption[] = [
    {
      id: "bcp",
      name: "Banco de Crédito del Perú",
      logoUrl: "/lovable-uploads/7279bca4-127a-4e3d-ac45-df8b43dbe0b5.png",
      accountNumber: "191-9077858032-0",
      accountName: "Kashin SAC"
    },
    {
      id: "interbank",
      name: "Interbank",
      logoUrl: "/lovable-uploads/09022a71-a6f5-4796-81e4-ccd098389899.png",
      accountNumber: "200-3052047889",
      accountName: "Kashin SAC"
    },
    {
      id: "bbva",
      name: "BBVA",
      logoUrl: "/lovable-uploads/0cf98db7-0df5-4d58-9e93-6a75fdcc50ad.png",
      accountNumber: "0011-0125-0200437892",
      accountName: "Kashin SAC"
    }
  ];

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };
  
  const handleGenerateCode = (bankId: string) => {
    navigate(`/pagar/codigo/${bankId}`);
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Transferencia bancaria" />
        
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-6">Selecciona una entidad bancaria</h2>
          
          <div className="space-y-4">
            {banks.map(bank => (
              <div key={bank.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={bank.logoUrl} 
                      alt={bank.name} 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h3 className="font-medium">{bank.name}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cuenta:</span>
                    <div className="flex items-center gap-2">
                      <span>{bank.accountNumber}</span>
                      <button 
                        onClick={() => copyToClipboard(
                          bank.accountNumber, 
                          `Número de cuenta ${bank.name} copiado`
                        )}
                      >
                        <Copy size={16} className="text-app-blue" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre:</span>
                    <div className="flex items-center gap-2">
                      <span>{bank.accountName}</span>
                      <button 
                        onClick={() => copyToClipboard(
                          bank.accountName, 
                          "Nombre copiado"
                        )}
                      >
                        <Copy size={16} className="text-app-blue" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => handleGenerateCode(bank.id)}
                >
                  Generar código de pago
                </Button>
              </div>
            ))}
          </div>
          
          <PaymentSummary
            concept="Pago de cuota"
            amount={65.00}
            isGratis={true}
          />
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
