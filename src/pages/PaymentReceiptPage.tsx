
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CheckCircle, Download, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HelpButton from "@/components/HelpButton";

interface PaymentData {
  id: string;
  monto_pagado: number;
  fecha_pago: string;
  metodo_pago: string;
  detalle_pago: string;
  referencia_pago: string;
  tipo_pago: string;
  prestamos: {
    monto_prestado: number;
    cuotas_totales: number;
    monto_por_cuota: number;
  };
}

export default function PaymentReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('pagos_cuotas')
          .select(`
            *,
            prestamos (
              monto_prestado,
              cuotas_totales,
              monto_por_cuota
            )
          `)
          .eq('id', id)
          .eq('id_usuario', user.id)
          .single();

        if (error) {
          console.error('Error fetching payment:', error);
          toast.error("Error al cargar los datos del pago");
        } else if (data) {
          setPaymentData(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error("Error inesperado al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
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
      case 'tarjeta de débito':
      case 'tarjeta de crédito':
        return '💳';
      case 'agentes':
        return '🏪';
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

  if (!paymentData) {
    return (
      <div className="container mx-auto max-w-md bg-white min-h-screen">
        <div className="px-4">
          <BackButton title="Comprobante de Pago" />
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
        <BackButton title="Comprobante de Pago" />
        
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Pago Procesado Exitosamente
            </h2>
            <p className="text-gray-600">
              {paymentData.tipo_pago === 'pago_completo' 
                ? 'Tu préstamo ha sido pagado completamente'
                : 'Tu cuota se procesó correctamente'
              }
            </p>
          </div>

          {/* Details */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    S/{paymentData.monto_pagado.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    {paymentData.tipo_pago === 'pago_completo' ? 'Préstamo Pagado Completamente' : 'Cuota Pagada'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha</span>
                    <span className="font-medium">{formatDate(paymentData.fecha_pago)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hora</span>
                    <span className="font-medium">{formatTime(paymentData.fecha_pago)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Método de pago</span>
                    <div className="flex items-center gap-2">
                      <span>{getPaymentMethodIcon(paymentData.metodo_pago)}</span>
                      <span className="font-medium">{paymentData.metodo_pago}</span>
                    </div>
                  </div>
                  
                  {paymentData.detalle_pago && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {paymentData.metodo_pago === 'Yape' ? 'Teléfono' : 'Detalle'}
                      </span>
                      <span className="font-medium">{paymentData.detalle_pago}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Referencia</span>
                    <span className="font-medium">{paymentData.referencia_pago}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID de transacción</span>
                    <span className="font-medium text-sm">{paymentData.id.toUpperCase().slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
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
                    Este comprobante es válido y puede ser usado como constancia de tu pago.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
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
                    text: `Comprobante de pago por S/${paymentData.monto_pagado.toFixed(2)}`,
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
      
      <HelpButton />
    </div>
  );
}
