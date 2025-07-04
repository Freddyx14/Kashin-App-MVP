
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check, Download, Share2 } from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LoanData {
  id: string;
  monto_prestamo: number;
  fecha_solicitud: string;
  metodo_pago: string;
  detalle_pago: string;
  estado: string;
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'yape':
        return '📱';
      case 'transferencia bancaria':
        return '🏦';
      default:
        return '💰';
    }
  };

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
          {/* Estado de la transacción */}
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Transacción Exitosa
            </h2>
            <p className="text-gray-600">
              Tu préstamo se procesó correctamente
            </p>
          </div>

          {/* Detalles de la transacción */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    S/{loanData.monto_prestamo.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Préstamo Desembolsado</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha</span>
                    <span className="font-medium">{formatDate(loanData.fecha_solicitud)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hora</span>
                    <span className="font-medium">{formatTime(loanData.fecha_solicitud)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Método de pago</span>
                    <div className="flex items-center gap-2">
                      <span>{getPaymentMethodIcon(loanData.metodo_pago)}</span>
                      <span className="font-medium">{loanData.metodo_pago}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {loanData.metodo_pago === 'Yape' ? 'Teléfono' : 'Cuenta bancaria'}
                    </span>
                    <span className="font-medium">{loanData.detalle_pago}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID de transacción</span>
                    <span className="font-medium text-sm">{loanData.id.toUpperCase().slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">ℹ</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Comprobante válido
                  </p>
                  <p className="text-sm text-blue-700">
                    Este comprobante es válido y puede ser usado como constancia de tu transacción.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
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
                    text: `Comprobante de préstamo por S/${loanData.monto_prestamo.toFixed(2)}`,
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
        </div>
      </div>
    </div>
  );
}
