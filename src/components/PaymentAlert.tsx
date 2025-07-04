
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface PaymentAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentAlert({ isOpen, onClose }: PaymentAlertProps) {
  // Datos simulados de la próxima cuota
  const nextPayment = {
    dueDate: "25 de Mayo, 2025",
    amount: 65.00,
    daysLeft: 15
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-app-blue text-xl font-semibold">
            <Clock size={24} className="text-app-blue" />
            ¡Recordatorio de Pago!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-app-light-blue p-6 rounded-xl mb-6 border border-blue-100">
            <p className="text-center text-gray-700 mb-4 text-base">
              Tu próxima cuota vence el
            </p>
            <p className="text-center text-gray-900 font-bold text-lg mb-4">
              {nextPayment.dueDate}
            </p>
            <p className="text-center text-gray-700 mb-4 text-base">
              Debes pagar
            </p>
            <p className="text-center text-app-blue font-bold text-2xl mb-4">
              S/ {nextPayment.amount.toFixed(2)}
            </p>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <p className="text-center text-app-blue font-semibold text-base">
                Te quedan <strong>{nextPayment.daysLeft} días</strong> para realizar el pago
              </p>
            </div>
          </div>
          
          <Button 
            className="w-full bg-app-blue hover:bg-app-blue/90 py-3 text-base font-medium"
            onClick={onClose}
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
