export function getToday() {
  const today = new Date()

  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}
