
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
import { supabase } from "@/integrations/supabase/client";

export default function CardPaymentPage() {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    // Validate form
    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    // Basic card number validation (should be 16 digits)
    if (cardNumber.length !== 16) {
      toast.error("El número de tarjeta debe tener 16 dígitos");
      return;
    }

    // Basic expiry validation (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Formato de fecha inválido (MM/AA)");
      return;
    }

    // Basic CVV validation (3 or 4 digits)
    if (cvv.length < 3 || cvv.length > 4) {
      toast.error("CVV debe tener 3 o 4 dígitos");
      return;
    }

    setIsProcessing(true);
    toast("💳 Creando preferencia de pago...");
    
    try {
      console.log('Creating payment preference...');
      
      const { data, error } = await supabase.functions.invoke('create-payment-preference', {
        body: {
          amount: 65.00,
          title: "Pago de cuota"
        }
      });

      if (error) {
        console.error('Error creating payment preference:', error);
        throw error;
      }

      console.log('Payment preference created:', data);

      if (data && data.init_point) {
        toast.success("Redirigiendo a MercadoPago...");
        // Redirect to MercadoPago checkout
        window.location.href = data.init_point;
      } else {
        throw new Error('No se recibió el enlace de pago');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Error al procesar el pago. Intenta nuevamente.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Pago con tarjeta" />
        
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
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="cardName">Nombre del titular</Label>
              <Input
                id="cardName"
                placeholder="Nombre como aparece en la tarjeta"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1"
                disabled={isProcessing}
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Número de tarjeta</Label>
              <div className="relative mt-1">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 16) {
                      setCardNumber(value);
                    }
                  }}
                  disabled={isProcessing}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="expiry">Fecha de expiración</Label>
                <div className="relative mt-1">
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        if (value.length > 2) {
                          setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
                        } else {
                          setExpiry(value);
                        }
                      }
                    }}
                    disabled={isProcessing}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              
              <div className="w-1/2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative mt-1">
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setCvv(value);
                      }
                    }}
                    disabled={isProcessing}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2 mb-6">
              <Lock size={16} />
              Tu información está cifrada y protegida por MercadoPago
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
          {isProcessing ? "Procesando..." : "Pagar con MercadoPago"}
        </Button>
      </div>
      
      <HelpButton />
    </div>
  );
}
