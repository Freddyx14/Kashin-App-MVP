
import { useParams, useNavigate } from "react-router-dom";
import { Check, Download, Share2 } from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Datos de ejemplo - en una implementación real vendrían de una base de datos
  const getTransactionData = (transactionId: string) => {
    // Simulando datos de transacción basados en el ID
    const transactions = {
      tx1: {
        id: "tx1",
        type: "Préstamo Desembolsado",
        date: "2024-04-25",
        time: "14:30",
        amount: 50.00,
        paymentMethod: "Transferencia Bancaria",
        status: "Completado"
      }
    };
    
    return transactions[transactionId as keyof typeof transactions] || {
      id: transactionId,
      type: "Transacción",
      date: "2024-04-25",
      time: "14:30",
      amount: 50.00,
      paymentMethod: "Yape",
      status: "Completado"
    };
  };

  const transaction = getTransactionData(id || "");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'yape':
        return '📱';
      case 'tarjeta de débito':
        return '💳';
      case 'transferencia bancaria':
        return '🏦';
      case 'pago en agentes':
        return '🏪';
      default:
        return '💰';
    }
  };

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
              Tu {transaction.type.toLowerCase()} se procesó correctamente
            </p>
          </div>

          {/* Detalles de la transacción */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    S/{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-600">{transaction.type}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha</span>
                    <span className="font-medium">{formatDate(transaction.date)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hora</span>
                    <span className="font-medium">{transaction.time}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Método de pago</span>
                    <div className="flex items-center gap-2">
                      <span>{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                      <span className="font-medium">{transaction.paymentMethod}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID de transacción</span>
                    <span className="font-medium text-sm">{transaction.id.toUpperCase()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estado</span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <Check size={16} />
                      {transaction.status}
                    </span>
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
                    text: `Comprobante de ${transaction.type} por S/${transaction.amount.toFixed(2)}`,
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
