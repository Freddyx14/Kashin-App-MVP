
import { Sparkles } from "lucide-react";

interface BalanceCardProps {
  availableBalance: number;
  creditLine: number;
  points: number;
  maxPoints: number;
}

export default function BalanceCard({ availableBalance, creditLine, points, maxPoints }: BalanceCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-sm">S/{availableBalance.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Disponible</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">S/{creditLine.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Línea</p>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-app-blue text-sm">Tienes {points} puntos</p>
          <p className="text-gray-500 text-sm">{maxPoints}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-app-blue h-2 rounded-full" 
            style={{ width: `${Math.min(100, (points/maxPoints) * 100)}%` }}
          />
        </div>
      </div>
      
      <div className="bg-app-light-blue rounded-lg mt-4 p-3 flex items-center">
        <Sparkles size={16} className="text-app-blue mr-2" />
        <p className="text-app-blue text-sm flex-1">Aumenta tu línea pagando puntual</p>
      </div>
    </div>
  );
}
