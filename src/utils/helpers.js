import { GRADING_SCALE } from './constants';

// Format date to readable string
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format currency
export function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Get initials from a full name
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Calculate grade from percentage
export function calculateGrade(percentage) {
  for (const item of GRADING_SCALE) {
    if (percentage >= item.min && percentage <= item.max) {
      return item;
    }
  }
  return GRADING_SCALE[GRADING_SCALE.length - 1];
}

// Generate receipt number
export function generateReceiptNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REC-${timestamp}-${random}`;
}

// Truncate text
export function truncate(str, maxLength = 50) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

// Capitalize first letter
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Class names helper (simple cn utility)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
