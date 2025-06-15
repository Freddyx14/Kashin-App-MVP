
import { useState, useEffect } from "react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import HelpButton from "@/components/HelpButton";
import { CreditCard, Calendar, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import PaymentSummary from "@/components/PaymentSummary";

export default function CardPaymentPage() {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [dni, setDni] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Detect if running on localhost
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("localhost");
    setIsLocalhost(isLocal);

    if (!window.MercadoPago && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = () => {
        console.log("MercadoPago SDK loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load MercadoPago SDK");
      };
      document.head.appendChild(script);
    }
  }, []);

  const detectCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'master';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'visa'; // default fallback
  };

  const handlePayment = async () => {
    if (isLocalhost) {
      toast.error("⚠️ MercadoPago puede bloquear solicitudes desde localhost por CORS");
      return;
    }

    if (!cardName || !cardNumber || !expiry || !cvv || !dni) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (!window.MercadoPago) {
      toast.error("Error: SDK de MercadoPago no está cargado");
      return;
    }

    setIsProcessing(true);
    console.log("Iniciando proceso de pago...");

    try {
      // Initialize MercadoPago with public key
      const mp = new window.MercadoPago("TEST-177b782c-c205-4a22-a9cf-c012b6eebc53");
      
      // Prepare card data
      const expiration = expiry.split("/");
      const cardData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName: cardName,
        cardExpirationMonth: expiration[0],
        cardExpirationYear: "20" + expiration[1],
        securityCode: cvv,
        identificationType: "DNI",
        identificationNumber: dni,
      };

      console.log("Creando token con datos:", { ...cardData, securityCode: "***" });

      // Create card token
      const tokenResponse = await mp.card.createToken({
        card: cardData
      });

      console.log("Respuesta del token:", tokenResponse);

      if (!tokenResponse || tokenResponse.error) {
        const errorMessage = tokenResponse?.error?.message || "Error creando token de tarjeta";
        console.error("Error en token:", tokenResponse?.error);
        toast.error(`Error: ${errorMessage}`);
        return;
      }

      const token = tokenResponse.body?.id;
      if (!token) {
        toast.error("No se pudo generar el token de la tarjeta");
        return;
      }

      console.log("Token creado exitosamente:", token);

      // Detect payment method
      const paymentMethodId = detectCardType(cardNumber);
      console.log("Método de pago detectado:", paymentMethodId);

      // Create payment
      const paymentData = {
        token,
        transaction_amount: 65,
        payment_method_id: paymentMethodId,
        installments: 1,
        payer: {
          email: "test_user_123456@testuser.com",
          identification: {
            type: "DNI",
            number: dni,
          },
          first_name: cardName.split(' ')[0] || cardName,
          last_name: cardName.split(' ').slice(1).join(' ') || "Usuario"
        },
        description: "Pago de cuota - Prestamos Kashin"
      };

      console.log("Enviando pago con datos:", paymentData);

      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": "Bearer TEST-4917101840137683-061503-5ff0359d778336bd9985af07b2323238-519329860",
          "Content-Type": "application/json",
          "X-Idempotency-Key": `payment-${Date.now()}-${Math.random()}`
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      console.log("Respuesta del pago:", result);

      if (response.ok && result.status === "approved") {
        console.log("Pago aprobado exitosamente");
        toast.success("✅ ¡Pago aprobado exitosamente!");
        navigate("/pagar/exito");
      } else {
        const errorDetail = result.message || result.status_detail || "Error desconocido";
        console.error("Error en el pago:", result);
        toast.error(`❌ Error en el pago: ${errorDetail}`);
      }
    } catch (error) {
      console.error("Error procesando el pago:", error);
      toast.error("❌ Hubo un problema procesando el pago. Revisa los datos e intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen pb-24">
      <div className="px-4">
        <BackButton title="Pago con tarjeta" />
        
        {isLocalhost && (
          <div className="mt-4 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
              <div className="text-sm">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Entorno de desarrollo detectado
                </h3>
                <p className="text-yellow-700 mb-3">
                  MercadoPago puede bloquear solicitudes por CORS desde localhost. Para probar los pagos, recomendamos:
                </p>
                <ul className="text-yellow-700 space-y-1 ml-4">
                  <li>• Desplegar temporalmente en Vercel o Netlify</li>
                  <li>• Usar Ngrok para obtener un dominio HTTPS válido</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 16) {
                      setCardNumber(value);
                    }
                  }}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                placeholder="12345678"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                className="mt-1"
              />
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
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2 mb-6">
              <Lock size={16} />
              Tu información está cifrada y protegida
            </p>
          </div>

          <PaymentSummary concept="Pago de cuota" amount={65.00} isGratis={true} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-app-blue hover:bg-app-blue/90"
          onClick={handlePayment}
          disabled={isProcessing || isLocalhost}
        >
          {isProcessing ? "Procesando..." : isLocalhost ? "No disponible en localhost" : "Pagar ahora"}
        </Button>
      </div>

      <HelpButton />
    </div>
  );
}
