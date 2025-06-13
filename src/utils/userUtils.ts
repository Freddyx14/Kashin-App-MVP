
// Función para extraer solo el primer nombre
export const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

// Función para generar código de invitación personalizado
export const generateInvitationCode = (firstName: string): string => {
  if (!firstName) return 'USER0000';
  
  const cleanFirstName = getFirstName(firstName);
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Genera 4 dígitos aleatorios
  
  return `${cleanFirstName}${randomDigits}`;
};
