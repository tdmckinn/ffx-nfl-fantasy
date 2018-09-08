import Vue from 'vue'
import Router from 'vue-router'

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

const MyTeam = () => import('../views/MyTeam.vue' /* webpackChunkName: "my-team" */)
const Dashboard = () => import('../views/Dashboard.vue' /* webpackChunkName: "dashboard" */)
const Players = () => import('../views/Players.vue' /* webpackChunkName: "players" */)
const Research = () => import('../views/Research.vue' /* webpackChunkName: "research" */)
const TopDrafts = () => import('../views/TopDrafts.vue' /* webpackChunkName: "top-drafts" */)
const Draft = () => import('../views/Draft.vue' /* webpackChunkName: "draft" */)
const AppLeagues = () => import('../views/AppLeagues.vue' /* webpackChunkName: "leagues" */)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/logout',
      beforeEnter: () => {
        router.push('/');
        localStorage.clear();
        location.reload();
      }
    },
    {
      path: '/team',
      component: MyTeam
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
