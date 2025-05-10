
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import HelpButton from "@/components/HelpButton";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CustomerFeedback() {
  const navigate = useNavigate();
  const [experience, setExperience] = useState<string | null>(null);
  const [futureLoan, setFutureLoan] = useState<string | null>(null);
  
  const handleSubmit = () => {
    if (!experience) {
      toast.error("Por favor, indícanos cómo fue tu experiencia");
      return;
    }
    
    if (!futureLoan) {
      toast.error("Por favor, selecciona una opción sobre préstamos futuros");
      return;
    }
    
    // Here you would typically send this data to your backend
    toast.success("¡Gracias por tus comentarios!");
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Feedback" />
        
        <div className="mt-8">
          <h1 className="text-xl font-bold mb-6">¿Cómo fue tu experiencia en Kashin?</h1>
          
          <div className="mb-8">
            <ToggleGroup 
              type="single" 
              value={experience} 
              onValueChange={setExperience}
              className="justify-start gap-4"
            >
              <ToggleGroupItem 
                value="positive" 
                className={`border p-6 rounded-lg ${experience === 'positive' ? 'bg-app-blue/10 border-app-blue' : 'border-gray-200'}`}
              >
                <ThumbsUp size={36} className={experience === 'positive' ? 'text-app-blue' : 'text-gray-400'} />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="negative" 
                className={`border p-6 rounded-lg ${experience === 'negative' ? 'bg-app-blue/10 border-app-blue' : 'border-gray-200'}`}
              >
                <ThumbsDown size={36} className={experience === 'negative' ? 'text-app-blue' : 'text-gray-400'} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">¿Te gustaría sacar otro préstamo?</h2>
            
            <RadioGroup value={futureLoan} onValueChange={setFutureLoan} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today">Sí, hoy saco otro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="next_week" id="next_week" />
                <Label htmlFor="next_week">Sí, lo sacaré la semana que viene</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_now" id="not_now" />
                <Label htmlFor="not_now">Sí, pero ahora no lo necesito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="just_once" id="just_once" />
                <Label htmlFor="just_once">Solo lo necesité por esta vez</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            className="w-full bg-app-blue hover:bg-app-blue/90"
            onClick={handleSubmit}
          >
            Enviar comentarios
          </Button>
        </div>
      </div>
      
      <HelpButton />
    </div>
  );
}
