import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: number | Date): string {
  return format(date, 'PPP p'); // This will show date and time (e.g., "April 29, 2023 at 3:45 PM")
}

export function formatRelativeDate(date: number | Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}