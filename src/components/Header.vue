<template>
  <header class="ffx-header">
    <nav class="navbar">
      <div class="navbar-start">
        <router-link id="link-brand" class="navbar-item" to="/">
          <h1 class="title is-3">
           NFX Fantasy <span>{{year}}</span>
          </h1>
        </router-link>
      </div>
      <div v-if="isLoggedInUser" class="navbar-end navbar-menu">
         <router-link class="navbar-item" to="/topdrafts">
           League Top Drafts
        </router-link>
         <router-link class="navbar-item" to="/myteam">
           My Team
        </router-link>
        <router-link class="navbar-item" to="/players">
          Players
        </router-link>
        <router-link class="navbar-item" to="/research">
          Research
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import * as moment from 'moment'

export default {
  name: 'ffx-header',
  props: {
    isLoggedInUser: Boolean
  },
  data() {
    return {
      year: moment().year()
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "../vars";

.ffx-header {
  .navbar {
    box-shadow: 0 2px 3px $navShadow;
    padding: 10px 60px;
    background-color: $primary;

    .navbar-item a,
    a.navbar-item {
      color: $orange;
      border-bottom: 1px solid $primary;

      &:hover {
        background:$primary;
        border-bottom: 1px solid $orange;
      }
    }

    #link-brand {
      &:hover {
        background-color: $primary;
        border-bottom: 1px solid $primary;
      }
    }
  }

  .title {
    color: $orange;
  }

}
</style>
