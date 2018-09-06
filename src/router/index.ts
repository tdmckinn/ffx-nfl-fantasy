import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Players from '../views/Players.vue'
import Research from '../views/Research.vue'
import TopDrafts from '../views/TopDrafts.vue'
import Draft from '../views/Draft.vue'
import AppLeagues from '../views/AppLeagues.vue'

Vue.use(Router)

const NotFoundComponent = {
  template: `
  <section class="hero">
    <div class="hero-body">
      <div class="container" style="text-align: center;">
        <h1 class="title">
          Sorry Page Not Found
        </h1>
        <h2 class="subtitle">
          Please try one of the links at the top menu.
        </h2>
      </div>
    </div>
  </section>`
}

const MyTeam = () => import('../views/MyTeam.vue')

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/team',
      component: MyTeam
      // beforeEnter: (to, from, next) => {
      //   // ... isLogged In User
      // }
    },
    {
      path: '/leagues',
      component: AppLeagues,
    },
    {
      path: '/draft-rankings',
      component: TopDrafts,
    },
    {
      path: '/players',
      component: Players,
    },
    {
      path: '/highlights',
      component: Research,
    },
    {
      path: '/draft',
      component: Draft,
    },
    { path: '*', component: NotFoundComponent }
  ]
})

export default router
