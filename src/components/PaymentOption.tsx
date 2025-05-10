
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  fee: string;
  selected: boolean;
  onClick: () => void;
}

export default function PaymentOption({ 
  icon, 
  title, 
  description, 
  fee, 
  selected, 
  onClick 
}: PaymentOptionProps) {
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 mb-4 flex items-center gap-4 cursor-pointer",
        selected && "border-app-turquoise"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-6 h-6 rounded-full border flex items-center justify-center",
        selected ? "border-app-turquoise bg-app-turquoise" : "border-gray-300"
      )}>
        {selected && <CheckCircle size={24} className="text-white" />}
      </div>
      
      <div className="flex items-center flex-1 gap-3">
        <div className="bg-app-light-blue p-2 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="bg-app-turquoise text-white rounded-full text-xs px-3 py-1">
        {fee}
      </div>
    </div>
  );
}
