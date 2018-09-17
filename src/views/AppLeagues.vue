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
                  Search Leagues
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
      <nfx-league type="appLeagues" :leagues="leagues">
        <div slot="actions" slot-scope="{ league }" class="nfx-league__actions">
          <nfx-button text="Join League" :click="() => { joinLeague(league.id) }" alt></nfx-button>
          <nfx-button text="Edit League" :click="editLeague" alt disabled></nfx-button>
        </div>
        <div slot="settings" class="nfx-league__settings">
          <div class="nfx__divider"></div>
          <span><i class="material-icons">perm_data_setting</i></span> Settings
        </div>
      </nfx-league>
    </section>
    <league-modifer-modal :show="showModal" v-on:closing="showModal = false"></league-modifer-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import gql from 'graphql-tag'

import { NfxSectionHeader, NfxButton, NfxLeague } from '../components'

export default Vue.extend({
  components: {
    NfxButton,
    NfxSectionHeader,
    NfxLeague
  },
  data() {
    return {
      showModal: false,
      leagues: []
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user
    })
  },
  apollo: {
    leagues: gql`
      {
        leagues {
          id
          DraftDateTime
          LeagueName
          LeagueSettings {
            DraftType
            Scoring
            MaxTeams
            WaiverType
            RosterPositions
            TradeDeadline
          }
          LeagueTeams {
            id
          }
        }
      }
    `
  },
  methods: {
    joinLeague(leagueId) {
      const { user } = (this.$store as any).state

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: JoinLeagueInput!) {
              joinLeague(input: $input) {
                id
                LeagueID
                OwnerID
              }
            }
          `,
          variables: {
            input: {
              id: leagueId,
              name: user.fullName
            }
          }
        })
        .then(() => {
          if (
            confirm(
              'Joined the league succesfully, check out your generated team!'
            )
          ) {
            // push route to my teams
          }
        })
    },
    editLeague() {
      // TODO: Implement me!
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
