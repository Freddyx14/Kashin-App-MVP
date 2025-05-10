
interface PaymentSummaryProps {
  concept: string;
  amount: number;
  fees?: number;
  isGratis?: boolean;
}

export default function PaymentSummary({ concept, amount, fees = 0, isGratis = true }: PaymentSummaryProps) {
  const total = amount + (isGratis ? 0 : fees);
  
  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex justify-between mb-2">
        <p className="text-gray-500">Concepto</p>
        <p className="font-medium">{concept}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-gray-500">Cuota</p>
        <p>S/{amount.toFixed(2)}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-gray-500">Comisión bancaria</p>
        {isGratis ? (
          <span className="bg-app-turquoise text-white rounded-full px-3 py-0.5 text-sm">
            Gratis
          </span>
        ) : (
          <p>S/{fees.toFixed(2)}</p>
        )}
      </div>
      <div className="flex justify-between font-bold mt-4">
        <p>Total {isGratis ? "abonado" : "a pagar"}</p>
        <p>S/{total.toFixed(2)}</p>
      </div>
    </div>
  );
}
