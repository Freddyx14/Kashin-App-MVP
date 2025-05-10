
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/ui/BackButton";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dni: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || 
        !formData.dni || !birthDate || !formData.email || 
        !formData.password || !formData.confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white pb-10">
      <div className="px-4">
        <BackButton />
      </div>
      
      <div className="flex-1 px-6">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-medium my-6">Registro</h1>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombres</Label>
              <Input 
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ingresa tus nombres"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos</Label>
              <Input 
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ingresa tus apellidos"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de celular</Label>
              <Input 
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Ej: 999 888 777"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dni">Número de DNI</Label>
              <Input 
                id="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ingresa tu número de DNI"
                maxLength={8}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha de nacimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? (
                      format(birthDate, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona tu fecha de nacimiento</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    disabled={(date) => 
                      date > new Date() || 
                      date < new Date(new Date().getFullYear() - 100, 0, 1)
                    }
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input 
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 bg-app-blue hover:bg-blue-600 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarme"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
