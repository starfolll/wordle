export function getDateShort(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
