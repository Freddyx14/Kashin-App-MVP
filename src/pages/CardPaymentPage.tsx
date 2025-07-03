
import { useState, useEffect } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { toast } from "sonner";
import PaymentSummary from "@/components/PaymentSummary";

interface ValidationErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export default function CardPaymentPage() {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  const validateCardNumber = (number: string): string | undefined => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.length !== 16) {
      return "El número de tarjeta es incorrecto";
    }
    return undefined;
  };

  const validateExpiry = (expiryDate: string): string | undefined => {
    if (!expiryDate || expiryDate.length !== 5) {
      return "La fecha de expiración es requerida";
    }

    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) {
      return "La tarjeta ha expirado. Ingresa una fecha de vencimiento válida.";
    }

    if (expYear < currentYear || (expYear === currentYear && expMonth <= currentMonth)) {
      return "La tarjeta ha expirado. Ingresa una fecha de vencimiento válida.";
    }

    return undefined;
  };

  const validateCVV = (cvvValue: string): string | undefined => {
    if (cvvValue.length !== 3) {
      return "El CVV es incorrecto.";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const cardNumberError = validateCardNumber(cardNumber);
    if (cardNumberError) newErrors.cardNumber = cardNumberError;

    const expiryError = validateExpiry(expiry);
    if (expiryError) newErrors.expiry = expiryError;

    const cvvError = validateCVV(cvv);
    if (cvvError) newErrors.cvv = cvvError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    // Validate form
    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setIsProcessing(true);
    toast("💳 Pago iniciado, tu pago está siendo procesado...");
    
    // Simulate processing delay
    setTimeout(() => {
      navigate("/pagar/exito");
    }, 5000);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setCardNumber(value);
      // Clear error when user starts typing
      if (errors.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: undefined }));
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length > 2) {
        setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiry(value);
      }
      // Clear error when user starts typing
      if (errors.expiry) {
        setErrors(prev => ({ ...prev, expiry: undefined }));
      }
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
      // Clear error when user starts typing
      if (errors.cvv) {
        setErrors(prev => ({ ...prev, cvv: undefined }));
      }
    }
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Pago con tarjeta" />

        
        <iframe width="560" height="315" src="https://www.youtube.com/embed/CUP2o-8sXrQ?si=tgpQBLwJQtolFxZJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white mb-6">
            <div className="flex justify-between items-center mb-8">
              <CreditCard size={32} />
              <div className="text-sm">S/ 65.00</div>
            </div>
            <div className="mb-4">
              <div className="text-xs opacity-70">Número de Tarjeta</div>
              <div className="font-mono">
                {cardNumber ? 
                  cardNumber.match(/.{1,4}/g)?.join(" ") || "•••• •••• •••• ••••" 
                  : "•••• •••• •••• ••••"}
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-xs opacity-70">Titular</div>
                <div>{cardName || "Tu Nombre"}</div>
              </div>
              <div>
                <div className="text-xs opacity-70">Expira</div>
                <div>{expiry || "MM/AA"}</div>
              </div>
            </div>
          </div>
          
          <form className="space-y-4">
            <div>
              <Label htmlFor="cardName">Nombre del titular</Label>
              <Input
                id="cardName"
                placeholder="Nombre como aparece en la tarjeta"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Número de tarjeta</Label>
              <div className="relative mt-1">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={errors.cardNumber ? "border-red-500" : ""}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="expiry">Fecha de expiración</Label>
                <div className="relative mt-1">
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className={errors.expiry ? "border-red-500" : ""}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                )}
              </div>
              
              <div className="w-1/2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative mt-1">
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={handleCVVChange}
                    className={errors.cvv ? "border-red-500" : ""}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2 mb-6">
              <Lock size={16} />
              Tu información está cifrada y protegida
            </p>
          </div>
          
          <PaymentSummary
            concept="Pago de cuota"
            amount={65.00}
            isGratis={true}
          />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-app-blue hover:bg-app-blue/90"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Procesando..." : "Pagar ahora"}
        </Button>
      </div>
      
      <HelpButton />
    </div>
  );
}
