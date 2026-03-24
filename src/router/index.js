import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import SheetView from '@/views/sheets/SheetView.vue'
import SequenceList from '@/views/sequences/SequenceList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/fiche/:slug', name: 'sheets', component: SheetView, props: true },
    { path: '/parcours', name: 'sequences', component: SequenceList }
    // { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
