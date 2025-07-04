
import TransactionItem from "@/components/TransactionItem";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Loan {
  id: string;
  monto_prestado: number;
  fecha_solicitud: string;
}

interface Payment {
  id: string;
  monto_pagado: number;
  fecha_pago: string;
  metodo_pago: string;
}

interface TransactionsListProps {
  loans: Loan[];
}

export default function TransactionsList({ loans }: TransactionsListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('pagos_cuotas')
          .select('*')
          .eq('id_usuario', user.id)
          .order('fecha_pago', { ascending: false });

        if (error) {
          console.error('Error fetching payments:', error);
        } else if (data) {
          setPayments(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching payments:', error);
      }
    };

    fetchPayments();
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

  // Combinar préstamos y pagos en una sola lista ordenada por fecha
  const allTransactions = [
    ...loans.map(loan => ({
      id: loan.id,
      type: 'loan' as const,
      date: new Date(loan.fecha_solicitud),
      amount: loan.monto_prestado,
      description: 'Préstamo Desembolsado'
    })),
    ...payments.map(payment => ({
      id: payment.id,
      type: 'payment' as const,
      date: new Date(payment.fecha_pago),
      amount: payment.monto_pagado,
      description: 'Cuota Pagada'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (allTransactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 px-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
        Últimas transacciones
      </h2>
      
      {allTransactions.map((transaction) => (
        <TransactionItem
          key={`${transaction.type}-${transaction.id}`}
          id={transaction.id}
          type={transaction.description}
          description={transaction.type === 'loan' ? 'Préstamo solicitado' : 'Pago de cuota'}
          date={formatDate(transaction.date.toISOString())}
          amount={transaction.amount}
          transactionType={transaction.type}
        />
      ))}
    </div>
  );
}
