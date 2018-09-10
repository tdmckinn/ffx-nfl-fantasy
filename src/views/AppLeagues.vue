<template>
  <div class="nfx-app__leagues">
    <nfx-section-header title="Leagues"></nfx-section-header>
    <section>
      <!-- Main container -->
      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-5">
              <strong>{{leagues.length}}</strong> League(s)
            </p>
          </div>
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <input class="input" type="text" placeholder="Find a league">
              </p>
              <p class="control">
                <button class="button">
                  Search Leauges
                </button>
              </p>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
          <p class="level-item"><a class="button is-success" @click.prevent="showModal = true">Create League</a></p>
        </div>
      </nav>
      <div class="nfx-leagues" v-for="league in leagues" :key="league.id">
        <div>{{league.LeagueName}}</div>
        <div class="nfx-leagues__actions">
          <nfx-button text="Join League" :click="joinLeague" alt></nfx-button>
          <nfx-button text="Edit League" :click="editLeague" alt disabled></nfx-button>
        </div>
      </div>
    </section>
    <league-modifer-modal :show="showModal" v-on:closing="showModal = false"></league-modifer-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'

import { NfxSectionHeader, NfxButton } from '../components'

export default Vue.extend({
  components: {
    NfxButton,
    NfxSectionHeader
  },
  data () {
    return {
      showModal: false,
      leagues: []
    }
  },
  apollo: {
    leagues: gql`
      {
        leagues {
          id
          CommissionerName
          LeagueName
        }
      }
    `
  },
  methods: {
    joinLeague() {

    },
    editLeague() {
      // TODO: Implement me!
    }
  }
})
</script>

<style lang="scss" scoped>
.nfx-app__leagues {
}
.nfx-leagues {
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
  border-radius: 6px;
  padding: 12px;
  margin-top: 50px;

  &__actions {
    .button:first-child {
      margin-right: 15px;
    }
  }
}
</style>
