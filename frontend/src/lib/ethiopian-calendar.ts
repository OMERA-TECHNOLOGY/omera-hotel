// Ethiopian Calendar Utilities
export interface EthiopianDate {
  year: number
  month: number
  day: number
}

const ethiopianMonths = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
]

// Convert Gregorian to Ethiopian date
export function gregorianToEthiopian(date: Date): EthiopianDate {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // Simplified conversion (actual conversion is more complex)
  // This is a basic approximation
  let ethYear = year - 7
  let ethMonth = month + 4
  let ethDay = day
  
  if (ethMonth > 13) {
    ethMonth -= 13
    ethYear += 1
  }
  
  // Adjust for Pagume (13th month, 5-6 days)
  if (ethMonth === 13 && ethDay > 5) {
    ethMonth = 1
    ethYear += 1
    ethDay = 1
  }
  
  return { year: ethYear, month: ethMonth, day: ethDay }
}

// Convert Ethiopian to Gregorian date
export function ethiopianToGregorian(ethDate: EthiopianDate): Date {
  // Simplified conversion
  let year = ethDate.year + 7
  let month = ethDate.month - 4
  let day = ethDate.day
  
  if (month <= 0) {
    month += 13
    year -= 1
  }
  
  return new Date(year, month - 1, day)
}

// Format Ethiopian date as string
export function formatEthiopianDate(ethDate: EthiopianDate): string {
  return `${ethiopianMonths[ethDate.month - 1]} ${ethDate.day}, ${ethDate.year}`
}

// Get Ethiopian month name
export function getEthiopianMonthName(month: number): string {
  return ethiopianMonths[month - 1] || ""
}
