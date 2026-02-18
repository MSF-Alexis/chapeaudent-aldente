import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
// import HtmlListView from '../views/HtmlListView.vue'
// import HtmlFicheView from '../views/HtmlFicheView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    // { path: '/html', name: 'html-list', component: HtmlListView },
    // { path: '/html/:id', name: 'html-fiche', component: HtmlFicheView, props: true },
    // { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
