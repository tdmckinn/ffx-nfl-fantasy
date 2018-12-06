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
          <p class="level-item">
            <nfx-button text="Create League" :disabled="hasMaxLeaguesCreated" :title="createLeagueTitleText" class="is-success" :click="() => { showModal = true } "></nfx-button>
          </p>
        </div>
      </nav>
      <nfx-league type="appLeagues" :leagues="leagues">
        <div slot="actions" slot-scope="{ league }" class="nfx-league__actions">
          <router-link class="button is-success" :to="{path: `/leagues/${league.id}` }">
            League Lobby
          </router-link>
          <nfx-button :disabled="isUserJoinedLeague(league)" text="Join League" :click="() => { displayJoinLeagueModal(league.id) }" alt></nfx-button>
          <nfx-button text="Edit League" :click="editLeague" alt disabled></nfx-button>
        </div>
        <div slot="settings" slot-scope="{ league }" class="nfx-league__settings">
          <div class="nfx__divider"></div>
          <span><i class="material-icons">perm_data_setting</i></span> Settings
        </div>
      </nfx-league>
    </section>
    <league-modifer-modal :show="showModal" v-on:closing="showModal = false"></league-modifer-modal>
    <nfx-modal :show="showJoinLeagueModal" v-on:closing="showModal = false" :onClose="close">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Enter Team Details</p>
          <button class="delete" @click="close"></button>
        </header>
        <section class="modal-card-body">
          <nfx-fieldset
            text="Team Name"
          >
            <nfx-input v-model="newTeam.name" placeholder="Team Name Here"></nfx-input>
          </nfx-fieldset>
        </section>
        <footer class="modal-card-foot">
          <a class="button" @click="close">Close</a>
          <nfx-button text="Save" :click="joinLeague" alt></nfx-button>
        </footer>
      </div>
    </nfx-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import gql from 'graphql-tag'

import { NfxFieldset, NfxInput, NfxSectionHeader, NfxButton, NfxLeague } from '../components'

export default Vue.extend({
  components: {
    NfxInput,
    NfxFieldset,
    NfxButton,
    NfxSectionHeader,
    NfxLeague
  },
  data() {
    return {
      showModal: false,
      showJoinLeagueModal: false,
      leagueToJoinId: '',
      leagues: [],
      newTeam: {
        name: '',
      }
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user
    }),
    createLeagueTitleText() {
      return this.hasMaxLeaguesCreated
        ? 'Max Leagues Per User: 5'
        : 'Create A League'
    },
    hasMaxLeaguesCreated() {
      return (
        this.leagues &&
        this.leagues.filter(league => league.CommissionerID === this.user.id)
          .length === 5
      )
    }
  },
  apollo: {
    leagues: gql`
      {
        leagues {
          id
          DraftDateTime
          LeagueName
          CommissionerID
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
            OwnerID
          }
        }
      }
    `
  },
  methods: {
    displayJoinLeagueModal(id) {
      this.showJoinLeagueModal = true
      this.leagueToJoinId = id
    },
    isUserJoinedLeague(league) {
      return (
        league.CommissionerID === this.user.id ||
        league.LeagueTeams.some(team => team.OwnerID === this.user.id)
      )
    },
    joinLeague() {
      if (!this.newTeam.name) {
        console.log('Must enter team name')
        return false;
      }
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
              id: this.leagueToJoinId,
              ownerId: this.user.id,
              name: this.newTeam.name
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
    },
    close() {
      this.leagueToJoinId = ''
      this.newTeam = {
        name: '',
      }
      this.$emit('closing')
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
