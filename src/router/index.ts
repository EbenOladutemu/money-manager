import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'
import { ref } from 'vue'
import { useYearHelper } from '@/composables/year-helper'
import { useLoginStore } from '@/store/login'

const { yearInFuture, months, currentMonth, currentYear } = useYearHelper()
const isAuthenticated = ref(false)

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    children: [],
    component: () => import('../views/LoginView.vue'),
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      if (isAuthenticated.value) {
        next({ name: `${currentMonth.value}-${currentYear}` })
      } else {
        next()
      }
    }
  }
]

const monthsArray: any = []

let year = currentYear - 1

months.forEach((month: string) => {
  month = month.toLowerCase()
  monthsArray.push({
    path: month,
    name: `${month}-${year}`,
    component: () => import('@/components/MonthComponent.vue')
  })
})

while (year <= yearInFuture) {
  routes.push({
    path: `/${year}`,
    name: `${year}`,
    component: () => import('../views/YearMonthView.vue'),
    children: [
      {
        path: 'january',
        name: `January-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'february',
        name: `February-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'march',
        name: `March-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'april',
        name: `April-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'may',
        name: `May-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'june',
        name: `June-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'july',
        name: `July-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'august',
        name: `August-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'september',
        name: `September-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'october',
        name: `October-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'november',
        name: `November-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      },
      {
        path: 'december',
        name: `December-${year}`,
        component: () => import('@/components/MonthComponent.vue')
      }
    ]
  })
  year++
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
  const { token } = useLoginStore()
  isAuthenticated.value = !!token

  if (to.name !== 'Login' && !isAuthenticated.value) {
    next({ name: 'Login' })
  } else {
    next()
  }
  }
)

export default router
