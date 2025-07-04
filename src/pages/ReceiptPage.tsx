
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ReceiptHeader from "@/components/ReceiptHeader";
import ReceiptDetails from "@/components/ReceiptDetails";
import ReceiptInfo from "@/components/ReceiptInfo";
import ReceiptActions from "@/components/ReceiptActions";

interface LoanData {
  id: string;
  monto_prestado: number;
  fecha_solicitud: string;
  metodo_pago: string;
  detalle_pago: string;
  interes: number;
  total_a_devolver: number;
  cuotas_totales: number;
  monto_por_cuota: number;
}

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanData = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('prestamos')
          .select('*')
          .eq('id', id)
          .eq('id_usuario', user.id)
          .single();

        if (error) {
          console.error('Error fetching loan:', error);
          toast.error("Error al cargar los datos del préstamo");
        } else if (data) {
          setLoanData(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error("Error inesperado al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [user, id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-md bg-white min-h-screen">
        <div className="px-4">
          <BackButton title="Comprobante de Pago" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!loanData) {
    return (
      <div className="container mx-auto max-w-md bg-white min-h-screen">
        <div className="px-4">
          <BackButton title="Comprobante de Pago" />
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
        <BackButton title="Comprobante de Pago" />
        
        <div className="mt-6 space-y-6">
          <ReceiptHeader amount={loanData.monto_prestado} />
          <ReceiptDetails loanData={loanData} />
          <ReceiptInfo />
          <ReceiptActions loanAmount={loanData.monto_prestado} />
        </div>
      </div>
    </div>
  );
}
