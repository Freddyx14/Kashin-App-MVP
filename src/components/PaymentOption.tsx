
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PaymentOptionProps {
  icon: ReactNode;
  title: string;
  description: string;
  fee: {
    text: string;
    color: "turquoise" | "orange";
  };
  onClick: () => void;
}

export default function PaymentOption({ 
  icon, 
  title, 
  description, 
  fee,
  onClick 
}: PaymentOptionProps) {
  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 relative mb-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-gray-300 bg-white"></div>
      <div className="ml-8">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-2 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
        <div className={`absolute -right-1 top-0 ${fee.color === "turquoise" ? "bg-app-turquoise" : "bg-orange-400"} text-white text-xs px-3 py-1 rounded-lg`}>
          {fee.text}
        </div>
      </div>
    </div>
  );
}
