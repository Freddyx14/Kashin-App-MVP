
import { Card, CardContent } from "@/components/ui/card";

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

interface ReceiptDetailsProps {
  loanData: LoanData;
}

export default function ReceiptDetails({ loanData }: ReceiptDetailsProps) {
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center border-b pb-4">
            <p className="text-3xl font-bold text-gray-900">
              S/{loanData.monto_prestado.toFixed(2)}
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

            {/* Información adicional del préstamo */}
            {loanData.interes && (
              <>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Intereses</span>
                    <span className="font-medium">S/ {loanData.interes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total a devolver</span>
                    <span className="font-medium">S/ {loanData.total_a_devolver.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Número de cuotas</span>
                    <span className="font-medium">{loanData.cuotas_totales}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monto por cuota</span>
                    <span className="font-medium">S/ {loanData.monto_por_cuota.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
