import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SheetView from '@/views/sheets/SheetView.vue'
import SequenceList from '@/views/sequences/SequenceList.vue'
import SequenceView from '@/views/sequences/SequenceView.vue'
import ExerciceView from '@/views/exercices/ExerciceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/fiche/:slug', name: 'sheets-view', component: SheetView, props: true },
    { path: '/parcours', name: 'sequences-list', component: SequenceList },
    { path: '/parcours/:slug', name: 'sequences-view', component: SequenceView, props : true },
    { path: '/exercice/:slug', name: 'exercice-view', component: ExerciceView, props: true }
    // { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
