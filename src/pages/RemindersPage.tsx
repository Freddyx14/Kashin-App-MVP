
import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function RemindersPage() {
  const [selectedFrequency, setSelectedFrequency] = useState<number>(7);

  // Datos simulados de la próxima cuota
  const nextPayment = {
    dueDate: "25 de Mayo, 2025",
    amount: 65.00,
    daysLeft: 15
  };

  const frequencyOptions = [
    { value: 1, label: "Cada día" },
    { value: 3, label: "Cada 3 días" },
    { value: 7, label: "Cada semana" },
    { value: 15, label: "Cada 15 días" },
    { value: 30, label: "Cada mes" }
  ];

  const handleSaveReminder = () => {
    toast.success(`Recordatorio configurado cada ${selectedFrequency} días`);
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen">
      <div className="px-4">
        <BackButton title="Recordatorios" />
        
        <div className="mt-6 space-y-6">
          {/* Resumen de próxima cuota */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-app-blue" size={20} />
                Próxima cuota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fecha de vencimiento:</span>
                <span className="font-semibold">{nextPayment.dueDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monto a pagar:</span>
                <span className="font-semibold text-app-blue">S/ {nextPayment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Días restantes:</span>
                <span className="font-semibold text-orange-600">{nextPayment.daysLeft} días</span>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de frecuencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-app-blue" size={20} />
                Frecuencia de recordatorios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {frequencyOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={selectedFrequency === option.value}
                      onChange={() => setSelectedFrequency(option.value)}
                      className="text-app-blue focus:ring-app-blue"
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <DollarSign className="text-app-blue mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-app-blue mb-1">¿Cómo funcionan los recordatorios?</h3>
                <p className="text-sm text-gray-600">
                  Recibirás notificaciones según la frecuencia que elijas para recordarte sobre tu próxima cuota. 
                  Puedes cambiar esta configuración en cualquier momento.
                </p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-app-blue hover:bg-app-blue/90"
            onClick={handleSaveReminder}
          >
            Guardar configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
