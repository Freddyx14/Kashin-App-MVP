
-- Agregar columnas para el manejo de cuotas y cálculos de préstamos
ALTER TABLE public.prestamos 
ADD COLUMN interes NUMERIC,
ADD COLUMN total_a_devolver NUMERIC,
ADD COLUMN cuotas_totales INTEGER,
ADD COLUMN monto_por_cuota NUMERIC,
ADD COLUMN fecha_primer_pago DATE,
ADD COLUMN dias_para_pago INTEGER;

-- Renombrar la columna monto_prestamo para mayor claridad
ALTER TABLE public.prestamos 
RENAME COLUMN monto_prestamo TO monto_prestado;
