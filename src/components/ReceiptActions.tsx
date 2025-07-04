
import { Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ReceiptActionsProps {
  loanAmount: number;
}

export default function ReceiptActions({ loanAmount }: ReceiptActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 pb-6">
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2"
        onClick={() => window.print()}
      >
        <Download size={16} />
        Descargar comprobante
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Comprobante de Pago',
              text: `Comprobante de préstamo por S/${loanAmount.toFixed(2)}`,
            });
          }
        }}
      >
        <Share2 size={16} />
        Compartir comprobante
      </Button>
      
      <Button 
        className="w-full bg-app-blue hover:bg-app-blue/90"
        onClick={() => navigate('/dashboard')}
      >
        Volver al inicio
      </Button>
    </div>
  );
}
