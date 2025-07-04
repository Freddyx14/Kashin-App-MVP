
import TransactionItem from "@/components/TransactionItem";

interface Loan {
  id: string;
  monto_prestado: number;
  fecha_solicitud: string;
}

interface TransactionsListProps {
  loans: Loan[];
}

export default function TransactionsList({ loans }: TransactionsListProps) {
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

  if (loans.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 px-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
        Últimas transacciones
      </h2>
      
      {loans.map((loan) => (
        <TransactionItem
          key={loan.id}
          id={loan.id}
          type="Préstamo Desembolsado"
          description="Préstamo solicitado"
          date={formatDate(loan.fecha_solicitud)}
          amount={loan.monto_prestado}
        />
      ))}
    </div>
  );
}
