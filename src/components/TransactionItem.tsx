
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TransactionItemProps {
  type: string;
  description: string;
  date: string;
  amount: number;
  id: string;
}

export default function TransactionItem({ 
  type, 
  description, 
  date, 
  amount, 
  id 
}: TransactionItemProps) {
  const navigate = useNavigate();
  
  const handleViewReceipt = () => {
    navigate(`/comprobante/${id}`);
  };
  
  return (
    <div className="border-b py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Check size={16} className="text-green-500" />
        </div>
        <div>
          <p className="font-medium">{type}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <p className="font-semibold">S/{amount.toFixed(2)}</p>
        <button 
          onClick={handleViewReceipt}
          className="text-app-blue text-sm underline"
        >
          Ver constancia
        </button>
      </div>
    </div>
  );
}
