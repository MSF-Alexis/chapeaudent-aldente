import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import HtmlListView from '@/views/html/ListView.vue'
import JSListView from '@/views/js/ListView.vue'
import CSSListView from '@/views/css/ListView.vue'
import IntegrationListView from '@/views/integration/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/html', name: 'html-list', component: HtmlListView },
    { path: '/css', name: 'css-list', component: CSSListView },
    { path: '/js', name: 'js-list', component: JSListView },
    { path: '/integration', name: 'integration-list', component: IntegrationListView },
    // { path: '/html', name: 'html-list', component: HtmlListView },
    // { path: '/html/:id', name: 'html-fiche', component: HtmlFicheView, props: true },
    // { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
