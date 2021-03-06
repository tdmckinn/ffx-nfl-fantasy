import Vue from 'vue'
import Router from 'vue-router'
import netlifyIdentity from 'netlify-identity-widget'

import store from '../store'

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

const AppUserTeams = () =>
  import('../views/AppUserTeams.vue' /* webpackChunkName: "my-team" */)
const Dashboard = () =>
  import('../views/AppDashboard.vue' /* webpackChunkName: "dashboard" */)
const Players = () =>
  import('../views/AppPlayers.vue' /* webpackChunkName: "players" */)
const Research = () =>
  import('../views/AppResearch.vue' /* webpackChunkName: "research" */)
const TopDrafts = () =>
  import('../views/AppTopDrafts.vue' /* webpackChunkName: "top-drafts" */)
const AppDraft = () =>
  import('../views/AppDraft.vue' /* webpackChunkName: "draft" */)
const Leagues = () =>
  import('../views/AppLeagues.vue' /* webpackChunkName: "leagues" */)
const NfxDraft = () =>
  import('../components/draft/NfxDraft.vue' /* webpackChunkName: "nfx-draft-live" */)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/logout',
      beforeEnter: () => {
        netlifyIdentity.logout()
        location.href = '/'
      }
    },
    {
      path: '/teams',
      component: AppUserTeams
    },
    {
      path: '/leagues',
      component: Leagues
    },
    {
      path: '/draft-rankings',
      component: TopDrafts
    },
    {
      path: '/players',
      component: Players
    },
    {
      path: '/highlights',
      component: Research
    },
    {
      path: '/draft',
      component: AppDraft,
      children: [
        {
          path: 'live/:id',
          name: 'live',
          component: NfxDraft,
          beforeEnter: (_to, _from, next) => {
            const {
              draftConfig: { isUserDrafting }
            } = store.state
            if (!isUserDrafting) {
              if (location.pathname.includes('/draft/live')) {
                router.push('/draft')
              } else {
                router.push('/')
              }
            }
            next()
            return
          }
          // beforeRouteLeave: (_to, _from, next) => {
          //   console.log('Im leaving...')
          //   next()
          // }
        }
      ]
    },
    { path: '*', component: NotFoundComponent }
  ]
})

export default router
