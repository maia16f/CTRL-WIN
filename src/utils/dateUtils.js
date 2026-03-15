import { format, formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return format(d, 'dd MMM yyyy', { locale: ro });
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true, locale: ro });
};
