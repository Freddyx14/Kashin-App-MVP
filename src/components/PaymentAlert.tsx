
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

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
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle size={24} />
              ¡Atención!
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-orange-50 p-4 rounded-lg mb-4">
            <p className="text-center text-gray-800 mb-3">
              Tu próxima cuota vence el <strong>{nextPayment.dueDate}</strong>
            </p>
            <p className="text-center text-gray-800 mb-3">
              Debes pagar <strong className="text-app-blue">S/ {nextPayment.amount.toFixed(2)}</strong>
            </p>
            <p className="text-center text-orange-600 font-semibold">
              Te quedan <strong>{nextPayment.daysLeft} días</strong> para realizar el pago
            </p>
          </div>
          
          <Button 
            className="w-full bg-app-blue hover:bg-app-blue/90"
            onClick={onClose}
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
