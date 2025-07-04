
import { Check, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TransactionItemProps {
  type: string;
  description: string;
  date: string;
  amount: number;
  id: string;
  transactionType?: 'loan' | 'payment';
}

export default function TransactionItem({ 
  type, 
  description, 
  date, 
  amount, 
  id,
  transactionType = 'loan'
}: TransactionItemProps) {
  const navigate = useNavigate();
  
  const handleViewReceipt = () => {
    if (transactionType === 'loan') {
      navigate(`/comprobante/${id}`);
    }
    // Para pagos, podríamos agregar una página de comprobante específica en el futuro
  };

  const getIcon = () => {
    if (transactionType === 'payment') {
      return <CreditCard size={16} className="text-blue-500" />;
    }
    return <Check size={16} className="text-green-500" />;
  };

  const getBackgroundColor = () => {
    if (transactionType === 'payment') {
      return 'bg-blue-100';
    }
    return 'bg-green-100';
  };
  
  return (
    <div className="border-b py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${getBackgroundColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
        <div>
          <p className="font-medium">{type}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <p className="font-semibold">
          {transactionType === 'payment' ? '-' : '+'}S/{amount.toFixed(2)}
        </p>
        {transactionType === 'loan' && (
          <button 
            onClick={handleViewReceipt}
            className="text-app-blue text-sm underline"
          >
            Ver constancia
          </button>
        )}
      </div>
    </div>
  );
}
