
import UserHeader from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";

export default function InvitePage() {
  return (
    <div className="pb-20 bg-app-gray min-h-screen">
      <div className="container mx-auto max-w-md bg-white">
        <UserHeader userName="Mahayli Adelia" />
        
        <div className="px-4 py-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Invita a tus amigos</h1>
          
          <div className="bg-app-blue text-white rounded-lg p-6 mb-8 w-full text-center">
            <h2 className="text-xl font-semibold mb-2">¡Gana S/20 por cada amigo!</h2>
            <p>Comparte tu código de invitación y gana cuando tus amigos obtengan su préstamo</p>
            
            <div className="bg-white text-app-blue rounded-lg p-3 mt-4 font-bold text-xl">
              MAHAYLI20
            </div>
          </div>
          
          <Button className="w-full bg-app-blue hover:bg-app-blue/90 mb-4">
            Compartir código
          </Button>
        </div>
        
        <HelpButton />
        <BottomNav />
      </div>
    </div>
  );
}
