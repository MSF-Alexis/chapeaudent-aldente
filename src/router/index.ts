import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SheetView from '@/views/sheets/SheetView.vue'
import SequenceView from '@/views/sequences/SequenceView.vue'
import ExerciceView from '@/views/exercices/ExerciceView.vue'
import SequenceTabsView from '@/views/sequences/SequenceTabsView.vue'
import RoadmapView from '@/views/roadmap/RoadmapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/roadmap', name: 'roadmap', component: RoadmapView },
    { path: '/fiche/:slug', name: 'sheets-view', component: SheetView, props: true },
    { path: '/parcours/domaine/:type?', name: 'sequences-list', component: SequenceTabsView, props: true },

    { path: '/parcours/:slug', name: 'sequences-view', component: SequenceView, props: true },
    { path: '/exercice/:slug', name: 'exercice-view', component: ExerciceView, props: true }
    // { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
