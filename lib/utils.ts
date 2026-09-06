import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount || 0).toLocaleString("en-IN")}`;
}

export function formatDateTime(dateString: string | Date): string {
  return new Date(dateString).toLocaleString()
}
