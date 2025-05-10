
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Background pattern - light icons */}
      <div className="absolute inset-0 bg-[url('/public/lovable-uploads/9e579174-945c-4b82-a0ec-2e0f6a7147da.png')] bg-repeat opacity-10 z-0" />
      
      <div className="flex-1 flex flex-col justify-center px-8 z-10">
        <div className="max-w-sm mx-auto w-full mt-20">
          <div className="mb-20">
            <p className="text-4xl text-gray-700 font-medium leading-tight">
              Para <span className="inline-flex items-center">
                <span className="text-[#00E0C6] mr-2">O</span>
                <span className="text-app-blue">kashin</span>
              </span>,
            </p>
            <p className="text-4xl text-gray-700 font-medium leading-tight mt-2">
              Cada cliente es una historia de éxito en proceso.
            </p>
            
            <p className="text-4xl text-app-blue font-bold mt-6">
              Sé el próximo
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-10 z-10">
        <div className="max-w-sm mx-auto w-full space-y-4">
          <Button 
            onClick={() => navigate("/registro")}
            className="w-full py-6 text-lg bg-app-blue hover:bg-blue-600"
          >
            Solicitar mi primer préstamo
          </Button>
          
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full py-6 text-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
          >
            Ya tengo una cuenta
          </Button>
          
          <p className="text-center text-gray-500 text-sm pt-4">
            Registrados en la SBS, Super Intendencia de<br />Banca y Seguros y AFP
          </p>
        </div>
      </div>
    </div>
  );
}
