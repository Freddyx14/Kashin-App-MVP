
import { Home, Users, PieChart, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 flex justify-around">
      <Link to="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-app-blue' : 'text-gray-500'}`}>
        <Home size={24} />
        <span className="text-xs mt-1">Préstamos</span>
      </Link>
      
      <Link to="/invitar" className={`flex flex-col items-center ${isActive('/invitar') ? 'text-app-blue' : 'text-gray-500'}`}>
        <Users size={24} />
        <span className="text-xs mt-1">Invita</span>
      </Link>
      
      <Link to="/recompensas" className={`flex flex-col items-center ${isActive('/recompensas') ? 'text-app-blue' : 'text-gray-500'}`}>
        <PieChart size={24} />
        <span className="text-xs mt-1">Recompensas</span>
      </Link>
      
      <Link to="/mas" className={`flex flex-col items-center ${isActive('/mas') ? 'text-app-blue' : 'text-gray-500'}`}>
        <Menu size={24} />
        <span className="text-xs mt-1">Más</span>
      </Link>
    </div>
  );
}
