export function capitalize(str: string): string {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1)
}
