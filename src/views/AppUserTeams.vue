<template>
  <section class="nfx-my-teams">
    <div v-if="userHasTeams">
      <nfx-section-header title="My Teams"></nfx-section-header>
      <div class="nfx-team__item" v-for="team in userTeams" :key="team.id">
        <p>{{team.Name}}</p>
        <nfx-button text="View Team" :click="() => { viewTeamClick(team) }" alt></nfx-button>
      </div>
    </div>
    <div v-else>
      <empty-state></empty-state>
      <div class="nfx-my-teams__empty">
        Looks like you have don't teams, join a league to get started.
        <nfx-button text="Join League" :click="joinLeagueClick"></nfx-button>
      </div>
    </div>
    <nfx-modal :show="showModal" v-on:closing="showModal = false" :onClose="close">
      <div v-if="userCurrentTeam.length !== 0" class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Team: {{selectedTeam.Name}}</p>
          <button class="delete" @click="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="nfx-team__party">Offense</div>
          <div class="nfx-team__player"><span class="nfx-team__position">QB</span>{{userCurrentTeam.QB1.Name}}</div>
          <div class="nfx-team__player"><span class="nfx-team__position">WR</span>{{userCurrentTeam.WR1.Name}}</div>
          <div class="nfx-team__player"><span class="nfx-team__position">RB</span>{{userCurrentTeam.WR2.Name}}</div>
          <div class="nfx-team__player"><span class="nfx-team__position">RB</span>{{userCurrentTeam.RB1.Name}}</div>
          <div class="nfx-team__player"><span class="nfx-team__position">RB</span>{{userCurrentTeam.RB2.Name}}</div>
          <div class="nfx-team__player"><span class="nfx-team__position">TE</span>{{userCurrentTeam.TE.Name}}</div>
          <div class="nfx-team__player"><span class="nfx-team__position">W/R/T</span>{{userCurrentTeam.Flex.Name}}</div>
          <div class="nfx-team__player" v-for="benchPlayer in userCurrentTeam.Bench" :key="benchPlayer.id">
            <span class="nfx-team__position">BN</span>{{benchPlayer.Name}}
          </div>
          <div class="nfx-team__party">Kicker</div>
          <div class="nfx-team__player"><span class="nfx-team__position">K</span>{{userCurrentTeam.Kicker.Name}}</div>
          <div class="nfx-team__party">Defense Special / Teams</div>
          <div class="nfx-team__player"><span class="nfx-team__position">DEF</span>{{userCurrentTeam.DEF.Name}}</div>
        </section>
        <footer class="modal-card-foot">
          <a class="button" @click="close">Close</a>
        </footer>
      </div>
    </nfx-modal>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import gql from 'graphql-tag'

import {
  EmptyState,
  NfxButton,
  NfxPlayer,
  NfxSectionHeader
} from '../components'

export default Vue.extend({
  name: 'my-team',
  components: {
    EmptyState,
    NfxButton,
    NfxPlayer,
    NfxSectionHeader
  },
  data() {
    return {
      selectedTeam: null,
      showModal: false,
      userTeams: [],
      condition: false
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user
    }),
    userHasTeams() {
      return this.userTeams && this.userTeams.length !== 0
    },
    userCurrentTeam() {
      if (!this.selectedTeam) {
        return []
      }

      const { Players } = this.selectedTeam
      return {
        QB1: Players.find(player => player.LineUpPosition === 'QB1'),
        WR1: Players.find(player => player.LineUpPosition === 'WR1'),
        WR2: Players.find(player => player.LineUpPosition === 'WR2'),
        RB1: Players.find(player => player.LineUpPosition === 'RB1'),
        RB2: Players.find(player => player.LineUpPosition === 'RB2'),
        TE: Players.find(player => player.LineUpPosition === 'TE'),
        Flex: Players.find(player => player.LineUpPosition === 'Flex'),
        Kicker: Players.find(player => player.LineUpPosition === 'K'),
        DEF: Players.find(player => player.LineUpPosition === 'DEF'),
        Bench: Players.filter(player => player.LineUpPosition === 'BN')
      }
    }
  },
  apollo: {
    userTeams: {
      query: gql`
        query($userId: String!) {
          userTeams(userId: $userId) {
            id
            Name
            LeagueID
            Players {
              id
              Name
              TeamID
              LineUpPosition
            }
          }
        }
      `,
      variables() {
        return {
          userId: this.user.id
        }
      }
    }
  },
  methods: {
    close() {
      this.showModal = false
    },
    viewTeamClick(team) {
      this.selectedTeam = team
      this.showModal = true
    },
    joinLeagueClick() {
      this.$router.push('/leagues')
    }
  }
})
</script>

<style lang="scss" scoped>
.nfx-my-teams {
  position: relative;
  margin-top: 50px;

  &__empty {
    position: absolute;
    top: 10%;
    left: 20%;
  }
}
.nfx-team {
  &__party {
    display: flex;
    justify-content: center;
    background: lightgray;
    margin: 5px 0;
  }

  &__player {
    display: flex;
  }

  &__position {
    font-weight: bold;
    padding-right: 15px;
    width: 75px;
  }

  &__item {
    display: flex;
    border-top: 1px solid lightgray;
    padding: 10px 0;

    p {
      margin-right: 15px;
    }
  }
}
</style>
