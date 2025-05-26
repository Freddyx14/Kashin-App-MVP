
import { ReactNode } from "react";

interface PromoCardProps {
  icon: ReactNode;
  title: string;
  className?: string;
  onClick?: () => void;
}

export default function PromoCard({ icon, title, className = "", onClick }: PromoCardProps) {
  return (
    <button 
      className={`bg-app-blue rounded-lg p-4 text-white text-center w-full hover:bg-app-blue/90 transition-colors ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {icon}
        <p className="mt-2 font-medium text-sm">{title}</p>
      </div>
    </button>
  );
}
