export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Obtenir les composants de la date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 car les mois vont de 0 à 11
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}h${minutes}`;
};