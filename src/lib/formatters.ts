export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  
  const truncated = cleaned.slice(0, 11);

  let formatted = truncated.replace(/^(\d{2})/, '($1)'); 
  formatted = formatted.replace(/^\((\d{2})\)(\d{5})/, '($1) $2-'); 
  formatted = formatted.replace(/^\((\d{2})\)(\d{4})/, '($1) $2-'); 

  return formatted;
};