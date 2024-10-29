export function getSunday(date: Date) {
  const dateCopy = new Date(date)
  return new Date(dateCopy.setDate(dateCopy.getDate() - dateCopy.getDay() + 7))
}
