
-- Agregar columnas para método de pago y detalles del pago
ALTER TABLE public.prestamos 
ADD COLUMN metodo_pago TEXT,
ADD COLUMN detalle_pago TEXT,
ADD COLUMN estado TEXT DEFAULT 'Pendiente';
