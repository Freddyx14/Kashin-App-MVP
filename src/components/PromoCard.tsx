
import { ReactNode } from "react";

interface PromoCardProps {
  icon: ReactNode;
  title: string;
  className?: string;
}

export default function PromoCard({ icon, title, className = "" }: PromoCardProps) {
  return (
    <div className={`bg-app-blue rounded-lg p-4 text-white text-center ${className}`}>
      <div className="flex flex-col items-center justify-center h-full">
        {icon}
        <p className="mt-2 font-medium text-sm">{title}</p>
      </div>
    </div>
  );
}
