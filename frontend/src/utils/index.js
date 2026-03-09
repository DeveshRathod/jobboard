import { formatDistanceToNow, format } from 'date-fns'

export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })

export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy')

export const formatSalary = (min, max, currency = 'USD') => {
  if (!min && !max) return null
  const fmt = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`
    return `$${n}/hr`
  }
  if (min && max) return `$${fmt(min)} - $${fmt(max)}`
  if (min) return `From $${fmt(min)}`
  return `Up to $${fmt(max)}`
}

export const JOB_TYPE_COLORS = {
  'full-time': 'bg-green-100 text-green-800',
  'part-time': 'bg-yellow-100 text-yellow-800',
  'contract': 'bg-blue-100 text-blue-800',
  'freelance': 'bg-purple-100 text-purple-800',
  'internship': 'bg-orange-100 text-orange-800',
  'remote': 'bg-teal-100 text-teal-800',
}

export const APPLICATION_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  reviewing: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-yellow-100 text-yellow-800',
  interviewed: 'bg-purple-100 text-purple-800',
  offered: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-500',
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
