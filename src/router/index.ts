import { useWordleStore } from '@/stores/wordle.store'
import HomeView from '@/views/Home.view.vue'
import { createRouter, createWebHistory, useRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game',
      name: 'game',
      beforeEnter: () => {
        const wordleStore = useWordleStore()

        if (wordleStore.word === null)
          return { path: '/' }
      },
      component: () => import('@/views/Game.view.vue'),
    },
  ],
})

export default router
