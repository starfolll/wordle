import { getMonday } from './getMonday'

export function getWeek() {
  const today = new Date()
  const monday = getMonday(today)

  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(day.getDate() + i)
    return new Date(day.getFullYear(), day.getMonth(), day.getDate())
  })

  return week
}
