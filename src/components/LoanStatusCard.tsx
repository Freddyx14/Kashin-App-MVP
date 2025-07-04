
import { useState, useEffect } from "react";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Loan {
  id: string;
  monto_prestado: number;
  interes: number;
  total_a_devolver: number;
  cuotas_totales: number;
  monto_por_cuota: number;
  fecha_primer_pago: string;
  dias_para_pago: number;
  estado: string;
  created_at: string;
  cuotas_pagadas?: number;
  monto_pagado?: number;
}

export default function LoanStatusCard() {
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveLoan = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('prestamos')
          .select('*')
          .eq('id_usuario', user.id)
          .in('estado', ['Procesando', 'Aprobado', 'Activo'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching active loan:', error);
          return;
        }

        if (data) {
          setActiveLoan(data);
          
          const today = new Date();
          const firstPaymentDate = new Date(data.fecha_primer_pago);
          const diffTime = firstPaymentDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(Math.max(0, diffDays));
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchActiveLoan();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    return date.toLocaleDateString('es-ES', options)
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const getStatusIcon = () => {
    if (!activeLoan) return <CheckCircle size={20} className="text-green-500" />;
    
    if (daysLeft > 7) return <CheckCircle size={20} className="text-green-500" />;
    if (daysLeft > 0) return <Clock size={20} className="text-yellow-500" />;
    return <AlertCircle size={20} className="text-red-500" />;
  };

  const getStatusColor = () => {
    if (!activeLoan) return "text-green-600";
    
    if (daysLeft > 7) return "text-green-600";
    if (daysLeft > 0) return "text-yellow-600";
    return "text-red-600";
  };

  const handlePayment = () => {
    if (activeLoan) {
      navigate('/pagar', { 
        state: { 
          loanData: activeLoan,
          daysLeft: daysLeft 
        } 
      });
    }
  };

  // Verificar si el préstamo está completamente pagado
  const cuotasPagadas = activeLoan?.cuotas_pagadas || 0;
  const cuotasTotales = activeLoan?.cuotas_totales || 0;
  const isPaidOff = cuotasPagadas >= cuotasTotales;

  if (!activeLoan || isPaidOff) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} className="text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">Estado del Préstamo</h2>
        </div>
        
        <div className="text-center py-4">
          <div className="text-green-600 font-medium mb-2">
            ¡Estás al día con tus pagos!
          </div>
          <p className="text-gray-600 text-sm">
            No tienes préstamos activos pendientes de pago.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        {getStatusIcon()}
        <h2 className="text-lg font-semibold text-gray-900">Estado del Préstamo</h2>
      </div>
      
      <div className="space-y-4">
        <div className={`font-medium ${getStatusColor()}`}>
          {daysLeft > 0 
            ? `Faltan ${daysLeft} días para el vencimiento`
            : daysLeft === 0 
              ? "¡Vence hoy!"
              : "Préstamo vencido"
          }
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Fecha de pago:</span>
            <div className="font-medium">{formatDate(activeLoan.fecha_primer_pago)}</div>
          </div>
          <div>
            <span className="text-gray-600">Cuotas:</span>
            <div className="font-medium">{cuotasPagadas + 1} de {activeLoan.cuotas_totales}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-gray-600 text-sm">Monto a pagar:</span>
            <div className="text-xl font-bold text-gray-900">
              S/ {activeLoan.monto_por_cuota.toFixed(2)}
            </div>
          </div>
          <Button 
            className="bg-app-blue hover:bg-app-blue/90"
            onClick={handlePayment}
          >
            Pagar
          </Button>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-app-blue" />
            <span className="text-sm font-medium text-gray-800">Resumen del préstamo</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Monto prestado:</span>
              <span>S/ {activeLoan.monto_prestado}</span>
            </div>
            <div className="flex justify-between">
              <span>Intereses:</span>
              <span>S/ {activeLoan.interes}</span>
            </div>
            <div className="flex justify-between">
              <span>Cuotas pagadas:</span>
              <span>{cuotasPagadas} de {activeLoan.cuotas_totales}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total restante:</span>
              <span>S/ {(activeLoan.total_a_devolver - (activeLoan.monto_pagado || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
