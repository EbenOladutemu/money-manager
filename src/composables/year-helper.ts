/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'

export function useYearHelper() {
  let startYear = new Date().getFullYear() - 1
  const yearInFuture = 2050
  const years: any = ref([])
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  function getYears() {
    while (startYear <= yearInFuture) {
      years.value.push(startYear)
      startYear++
    }
  }

  getYears()

  return { startYear, years, yearInFuture, getYears, months }
}
