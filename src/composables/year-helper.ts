/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'

export function useYearHelper() {
  const currentMonth = ref()
  const currentYear = new Date().getFullYear()
  let startYear = 2023
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

  function getCurrentMonth() {
    const month = new Date().getMonth()
    currentMonth.value = months[month]
  }

  getCurrentMonth()

  function getYears() {
    while (startYear <= yearInFuture) {
      years.value.push(startYear)
      startYear++
    }
  }

  getYears()

  return {
    startYear,
    years,
    yearInFuture,
    getYears,
    months,
    currentMonth,
    currentYear
  }
}
