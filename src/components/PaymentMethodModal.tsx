
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string, paymentDetail: string) => void;
  loanAmount: number;
}

export default function PaymentMethodModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loanAmount 
}: PaymentMethodModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = "Debe seleccionar un método de pago";
    }

    if (!paymentDetail.trim()) {
      newErrors.paymentDetail = "Este campo es obligatorio";
    } else if (paymentMethod === "Yape") {
      // Validar que sean 9 dígitos para Yape
      if (!/^\d{9}$/.test(paymentDetail.trim())) {
        newErrors.paymentDetail = "El número de teléfono debe tener 9 dígitos";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(paymentMethod, paymentDetail.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setPaymentMethod("");
    setPaymentDetail("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            ¿Cómo quieres recibir el dinero?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-app-blue">
              Monto: S/ {loanAmount}
            </p>
          </div>

          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yape" id="yape" />
                <Label htmlFor="yape" className="flex items-center gap-2">
                  📱 Yape
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Transferencia bancaria" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center gap-2">
                  🏦 Transferencia bancaria
                </Label>
              </div>
            </RadioGroup>
            
            {errors.paymentMethod && (
              <p className="text-sm text-red-500">{errors.paymentMethod}</p>
            )}
          </div>

          {paymentMethod && (
            <div className="space-y-2">
              <Label htmlFor="paymentDetail">
                {paymentMethod === "Yape" 
                  ? "Número de teléfono asociado a Yape" 
                  : "Número de cuenta bancaria"}
              </Label>
              <Input
                id="paymentDetail"
                type={paymentMethod === "Yape" ? "tel" : "text"}
                placeholder={paymentMethod === "Yape" 
                  ? "Ej: 987654321" 
                  : "Ingresa tu número de cuenta"}
                value={paymentDetail}
                onChange={(e) => setPaymentDetail(e.target.value)}
                maxLength={paymentMethod === "Yape" ? 9 : undefined}
              />
              {errors.paymentDetail && (
                <p className="text-sm text-red-500">{errors.paymentDetail}</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!paymentMethod || !paymentDetail.trim()}
              className="flex-1 bg-app-blue hover:bg-app-blue/90"
            >
              Confirmar datos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
