import { useWordleStore } from '@/stores/wordle.store'
import HomeView from '@/views/Home.view.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
      name: 'game-classic',
      beforeEnter: () => {
        const wordleStore = useWordleStore()

        if (wordleStore.word === null)
          return { path: '/' }
      },
      component: () => import('@/views/Game.view.vue'),
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('@/views/Store.view.vue'),
    },
    {
      path: '/stickers-editor',
      name: 'stickers-editor',
      component: () => import('@/views/StickersEditor.view.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.view.vue'),
    },
  ],
})

export default router
