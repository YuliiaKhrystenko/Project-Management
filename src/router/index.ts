import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/project/:id',
      name: 'ProjectDetails',
      component: () => import('@/views/ProjectDetailsView.vue'),
    },
  ],
})

export default router
