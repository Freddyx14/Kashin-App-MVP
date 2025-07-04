
import { Check } from "lucide-react";

interface ReceiptHeaderProps {
  amount: number;
}

export default function ReceiptHeader({ amount }: ReceiptHeaderProps) {
  return (
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
  );
}
