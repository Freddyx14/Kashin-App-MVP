
-- Crear tabla para almacenar los préstamos
CREATE TABLE public.prestamos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_usuario UUID REFERENCES auth.users NOT NULL,
  monto_prestamo DECIMAL(10,2) NOT NULL,
  fecha_solicitud TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.prestamos ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para que cada usuario solo vea sus propios préstamos
CREATE POLICY "Users can view their own loans" 
  ON public.prestamos 
  FOR SELECT 
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can create their own loans" 
  ON public.prestamos 
  FOR INSERT 
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Users can update their own loans" 
  ON public.prestamos 
  FOR UPDATE 
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can delete their own loans" 
  ON public.prestamos 
  FOR DELETE 
  USING (auth.uid() = id_usuario);
