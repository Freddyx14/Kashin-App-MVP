
import UserHeader from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";

export default function RewardsPage() {
  return (
    <div className="pb-20 bg-app-gray min-h-screen">
      <div className="container mx-auto max-w-md bg-white">
        <UserHeader userName="Mahayli Adelia" />
        
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Recompensas</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Tus puntos</h2>
            
            <div className="flex justify-between items-center mb-2">
              <p>Puntos acumulados</p>
              <p className="font-bold">0</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-app-blue h-2 rounded-full w-0" />
            </div>
            
            <p className="text-center text-gray-600">
              Obtén puntos pagando tus cuotas a tiempo
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Beneficios</h2>
            
            <div className="bg-app-light-blue p-4 rounded-lg mb-4">
              <p className="font-medium">Obtén descuentos en tus próximos préstamos</p>
              <p className="text-gray-600 text-sm">Acumula 500 puntos</p>
            </div>
            
            <div className="bg-app-light-blue p-4 rounded-lg mb-4">
              <p className="font-medium">Aumenta tu línea de crédito</p>
              <p className="text-gray-600 text-sm">Acumula 1000 puntos</p>
            </div>
            
            <div className="bg-app-light-blue p-4 rounded-lg">
              <p className="font-medium">Obtén devolución de intereses</p>
              <p className="text-gray-600 text-sm">Acumula 1500 puntos</p>
            </div>
          </div>
        </div>
        
        <HelpButton />
        <BottomNav />
      </div>
    </div>
  );
}
