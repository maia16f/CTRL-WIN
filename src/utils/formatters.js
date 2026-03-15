export const formatCurrency = (amount, currency = 'RON') => {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency }).format(amount);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
