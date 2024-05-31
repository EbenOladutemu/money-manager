import { useYearHelper } from '@/composables/year-helper'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const { yearInFuture } = useYearHelper()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: localStorage.getItem('token') ? `2023/january` : '',
    children: [],
    component: () => import('../views/years/HomeView.vue')
  }
]

let year = new Date().getFullYear() - 1
while (year <= yearInFuture) {
  routes.push({
    path: `/${year}`,
    name: `${year}`,
    component: () => import('../views/years/YearView.vue'),
    children: [
      {
        path: 'january',
        name: `january-${year}`,
        component: () => import('../views/months/JanuaryView.vue')
      },
      {
        path: 'february',
        name: `february-${year}`,
        component: () => import('../views/months/FebruaryView.vue')
      },
      {
        path: 'march',
        name: `march-${year}`,
        component: () => import('../views/months/MarchView.vue')
      },
      {
        path: 'april',
        name: `april-${year}`,
        component: () => import('../views/months/AprilView.vue')
      },
      {
        path: 'may',
        name: `may-${year}`,
        component: () => import('../views/months/MayView.vue')
      },
      {
        path: 'june',
        name: `june-${year}`,
        component: () => import('../views/months/JuneView.vue')
      },
      {
        path: 'july',
        name: `july-${year}`,
        component: () => import('../views/months/JulyView.vue')
      },
      {
        path: 'august',
        name: `august-${year}`,
        component: () => import('../views/months/AugustView.vue')
      },
      {
        path: 'september',
        name: `september-${year}`,
        component: () => import('../views/months/SeptemberView.vue')
      },
      {
        path: 'october',
        name: `october-${year}`,
        component: () => import('../views/months/OctoberView.vue')
      },
      {
        path: 'november',
        name: `november-${year}`,
        component: () => import('../views/months/NovemberView.vue')
      },
      {
        path: 'december',
        name: `december-${year}`,
        component: () => import('../views/months/DecemberView.vue')
      }
    ]
  })
  year++
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
