
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
  const [mpInstance, setMpInstance] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("localhost");
    setIsLocalhost(isLocal);

    const loadMercadoPagoSDK = () => {
      if (window.MercadoPago) {
        console.log("MercadoPago SDK ya está cargado");
        initializeMercadoPago();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = () => {
        console.log("MercadoPago SDK cargado exitosamente");
        setTimeout(initializeMercadoPago, 100); // Pequeño delay para asegurar que el SDK esté listo
      };
      script.onerror = () => {
        console.error("Error al cargar el SDK de MercadoPago");
        toast.error("Error al cargar el sistema de pagos");
      };
      document.head.appendChild(script);
    };

    const initializeMercadoPago = () => {
      try {
        if (window.MercadoPago) {
          const mp = new window.MercadoPago("TEST-177b782c-c205-4a22-a9cf-c012b6eebc53", {
            locale: "es-PE"
          });
          setMpInstance(mp);
          console.log("MercadoPago inicializado correctamente");
        }
      } catch (error) {
        console.error("Error inicializando MercadoPago:", error);
        toast.error("Error al inicializar el sistema de pagos");
      }
    };

    loadMercadoPagoSDK();
  }, []);

  const getCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    // Tarjetas de prueba específicas de MercadoPago
    if (cleanNumber.startsWith('4509')) return 'visa';
    if (cleanNumber.startsWith('5031')) return 'mastercard';
    if (cleanNumber.startsWith('3711')) return 'amex';
    
    // Fallbacks generales
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    
    return 'visa';
  };

  const validateCardData = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (!cardName.trim() || cardName.trim().length < 2) {
      toast.error("El nombre del titular debe tener al menos 2 caracteres");
      return false;
    }
    
    // Validar tarjetas de prueba específicas
    const validTestCards = ['4509953566233704', '5031433215406351', '3711803032769225'];
    if (!validTestCards.includes(cleanCardNumber) && cleanCardNumber.length < 13) {
      toast.error("Usa una tarjeta de prueba válida de MercadoPago");
      return false;
    }
    
    if (!expiry || expiry.length !== 5) {
      toast.error("Fecha de expiración inválida (MM/AA)");
      return false;
    }
    
    // Validar que la fecha no sea pasada
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const cardDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    
    if (cardDate < currentDate) {
      toast.error("La tarjeta está vencida");
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast.error("CVV debe tener al menos 3 dígitos");
      return false;
    }
    
    if (!dni || dni.length < 8) {
      toast.error("DNI debe tener al menos 8 dígitos");
      return false;
    }
    
    return true;
  };

  const createPaymentToken = async (): Promise<string> => {
    if (!mpInstance) {
      throw new Error("SDK de MercadoPago no disponible");
    }

    return new Promise((resolve, reject) => {
      const [month, year] = expiry.split("/");
      
      const cardData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName: cardName.trim().toUpperCase(),
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode: cvv,
        identificationType: "DNI",
        identificationNumber: dni,
      };

      console.log("Creando token con datos:", { 
        ...cardData, 
        securityCode: "***", 
        cardNumber: cardData.cardNumber.replace(/\d(?=\d{4})/g, "*")
      });

      const timeoutId = setTimeout(() => {
        reject(new Error("Timeout al crear token de tarjeta"));
      }, 10000);

      try {
        mpInstance.createCardToken(cardData, (error: any, token: any) => {
          clearTimeout(timeoutId);
          
          console.log("Respuesta createCardToken - Error:", error);
          console.log("Respuesta createCardToken - Token:", token);
          
          if (error) {
            console.error("Error detallado del token:", error);
            
            if (error.cause && error.cause.length > 0) {
              const firstError = error.cause[0];
              reject(new Error(`Error en ${firstError.code}: ${firstError.description}`));
            } else {
              reject(new Error(error.message || "Error desconocido creando token"));
            }
          } else if (token && token.id) {
            console.log("Token creado exitosamente:", token.id);
            resolve(token.id);
          } else {
            reject(new Error("Token inválido recibido del SDK"));
          }
        });
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Error en createCardToken:", err);
        reject(err);
      }
    });
  };

  const processPayment = async (token: string) => {
    const paymentData = {
      token,
      transaction_amount: 65,
      payment_method_id: getCardType(cardNumber),
      installments: 1,
      payer: {
        email: "test_user_12345678@testuser.com",
        identification: {
          type: "DNI",
          number: dni,
        },
        first_name: cardName.split(' ')[0] || cardName,
        last_name: cardName.split(' ').slice(1).join(' ') || "Test"
      },
      description: "Pago de cuota - Prestamos Kashin",
      binary_mode: false,
      statement_descriptor: "KASHIN"
    };

    console.log("Procesando pago con datos:", paymentData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("Timeout en petición de pago");
      controller.abort();
    }, 20000);

    try {
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": "Bearer TEST-4917101840137683-061503-5ff0359d778336bd9985af07b2323238-519329860",
          "Content-Type": "application/json",
          "X-Idempotency-Key": `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        },
        body: JSON.stringify(paymentData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      console.log("Respuesta completa del servidor:", responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parseando respuesta JSON:", parseError);
        throw new Error("Respuesta inválida del servidor");
      }

      console.log("Respuesta parseada:", result);

      if (!response.ok) {
        console.error("Error HTTP:", response.status, result);
        const errorMsg = result.message || 
                        (result.cause && result.cause[0] && result.cause[0].description) || 
                        `Error HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error en processPayment:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (isLocalhost) {
      toast.error("⚠️ Para probar pagos, usa un dominio válido (no localhost)");
      return;
    }

    if (!validateCardData()) {
      return;
    }

    if (!mpInstance) {
      toast.error("Error: Sistema de pagos no inicializado. Recarga la página.");
      return;
    }

    setIsProcessing(true);
    console.log("=== INICIANDO PROCESO DE PAGO ===");

    try {
      console.log("Paso 1: Creando token de tarjeta...");
      const token = await createPaymentToken();
      
      console.log("Paso 2: Procesando pago con token:", token);
      const result = await processPayment(token);

      console.log("Estado del pago:", result.status);
      console.log("Detalle del estado:", result.status_detail);

      if (result.status === "approved") {
        console.log("✅ Pago aprobado exitosamente");
        toast.success("✅ ¡Pago aprobado exitosamente!");
        navigate("/pagar/exito");
      } else if (result.status === "pending") {
        console.log("⏳ Pago pendiente");
        toast.success("⏳ Pago en proceso de verificación");
        navigate("/pagar/exito");
      } else {
        const statusDetail = result.status_detail || "Estado desconocido";
        console.error("❌ Pago rechazado:", result.status, statusDetail);
        toast.error(`❌ Pago rechazado: ${statusDetail}`);
      }

    } catch (error: any) {
      console.error("=== ERROR EN EL PROCESO DE PAGO ===", error);
      
      if (error.name === 'AbortError') {
        toast.error("❌ Tiempo de espera agotado. Intenta nuevamente.");
      } else if (error.message?.includes('CORS')) {
        toast.error("❌ Error de CORS. Usa un dominio válido.");
      } else if (error.message?.includes('Timeout')) {
        toast.error("❌ Tiempo de espera agotado. Verifica tu conexión.");
      } else {
        const errorMsg = error.message || "Error desconocido";
        toast.error(`❌ Error: ${errorMsg}`);
      }
    } finally {
      setIsProcessing(false);
      console.log("=== PROCESO DE PAGO FINALIZADO ===");
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
                  MercadoPago requiere un dominio válido. Para probar:
                </p>
                <ul className="text-yellow-700 space-y-1 ml-4">
                  <li>• Usa Vercel, Netlify o similar</li>
                  <li>• Configura Ngrok con HTTPS</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            📋 Tarjetas de prueba de MercadoPago
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Visa:</strong> 4509 9535 6623 3704</p>
            <p><strong>Mastercard:</strong> 5031 4332 1540 6351</p>
            <p><strong>CVV:</strong> 123 | <strong>Fecha:</strong> 11/25</p>
            <p><strong>DNI:</strong> 12345678</p>
          </div>
        </div>
        
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
          disabled={isProcessing || isLocalhost || !mpInstance}
        >
          {isProcessing ? "Procesando..." : isLocalhost ? "No disponible en localhost" : !mpInstance ? "Cargando sistema de pagos..." : "Pagar ahora"}
        </Button>
      </div>

      <HelpButton />
    </div>
  );
}
