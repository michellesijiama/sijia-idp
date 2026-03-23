import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isValid } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return dateStr
    return format(date, 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return dateStr
    return format(date, 'MMM d, yyyy · h:mm a')
  } catch {
    return dateStr
  }
}

export function getDaysUntilDue(dueDate: string): number {
  const due = parseISO(dueDate)
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getDueDateStatus(dueDate: string): 'overdue' | 'soon' | 'ok' {
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return 'overdue'
  if (days <= 30) return 'soon'
  return 'ok'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
