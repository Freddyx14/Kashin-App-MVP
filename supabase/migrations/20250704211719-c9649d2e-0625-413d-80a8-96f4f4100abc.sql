
-- Crear tabla para registrar los pagos de cuotas
CREATE TABLE public.pagos_cuotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_usuario UUID REFERENCES auth.users NOT NULL,
  id_prestamo UUID REFERENCES public.prestamos(id) NOT NULL,
  tipo_pago TEXT NOT NULL, -- 'cuota_individual' o 'pago_completo'
  monto_pagado NUMERIC NOT NULL,
  metodo_pago TEXT NOT NULL,
  detalle_pago TEXT,
  referencia_pago TEXT NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para la tabla de pagos
ALTER TABLE public.pagos_cuotas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pagos_cuotas
CREATE POLICY "Users can view their own payments" 
  ON public.pagos_cuotas 
  FOR SELECT 
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can create their own payments" 
  ON public.pagos_cuotas 
  FOR INSERT 
  WITH CHECK (auth.uid() = id_usuario);

-- Agregar columnas para tracking de pagos en la tabla prestamos
ALTER TABLE public.prestamos 
ADD COLUMN IF NOT EXISTS cuotas_pagadas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monto_pagado NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS fecha_ultimo_pago TIMESTAMP WITH TIME ZONE;

-- Función para actualizar el estado del préstamo después de un pago
CREATE OR REPLACE FUNCTION public.actualizar_prestamo_despues_pago()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el préstamo con la información del pago
  UPDATE public.prestamos 
  SET 
    cuotas_pagadas = CASE 
      WHEN NEW.tipo_pago = 'pago_completo' THEN cuotas_totales
      ELSE COALESCE(cuotas_pagadas, 0) + 1
    END,
    monto_pagado = COALESCE(monto_pagado, 0) + NEW.monto_pagado,
    fecha_ultimo_pago = NEW.fecha_pago,
    estado = CASE 
      WHEN NEW.tipo_pago = 'pago_completo' OR (COALESCE(cuotas_pagadas, 0) + 1) >= COALESCE(cuotas_totales, 1) THEN 'Pagado'
      ELSE estado
    END
  WHERE id = NEW.id_prestamo;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar préstamos automáticamente
CREATE TRIGGER trigger_actualizar_prestamo_despues_pago
  AFTER INSERT ON public.pagos_cuotas
  FOR EACH ROW
  EXECUTE FUNCTION public.actualizar_prestamo_despues_pago();
