
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HelpButton() {
  const handleHelp = () => {
    toast.info("Un agente se pondrá en contacto contigo pronto.");
  };

  return (
    <Button 
      onClick={handleHelp} 
      className="fixed bottom-5 right-5 bg-app-blue text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
      variant="default"
      size="icon"
    >
      <MessageSquare className="h-6 w-6" />
      <span className="ml-2 text-sm hidden">Ayuda</span>
    </Button>
  );
}
