<template>
  <div class="nfx-draft">
    <!-- <div class="nfx-draft__sticky">Hello</div> -->
    <div class="nfx-draft__exit">
      <nfx-button text="Exit Draft" :click="exitDraft">
        <i class="material-icons">
          exit_to_app
        </i>
      </nfx-button>
    </div>
    <div class="nfx-draft__header">
      <div class="nfx-draft__queued-pick">
        <span>
          <i class="nfx-draft__queued-icon material-icons">person</i>
          <span v-if="!selectedPick">No Player Selected</span>
          {{selectedPick && selectedPick.Name}}
        </span>
        <nfx-button text="Draft Player" :click="draftPlayer" alt :disabled="!selectedPick"></nfx-button>
      </div>
    </div>
    <section class="nfx-draft__content">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th><abbr title="Position">Pos</abbr></th>
            <th><abbr title="Rank">Rnk</abbr></th>
            <th style="width: 100%;"><abbr title="Name">Name</abbr></th>
            <th><abbr title="ADP">ADP</abbr></th>
            <th><abbr title="FX Pts">FTP</abbr></th>
            <th><abbr title="Age">Age</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in draft.Players" :key="player.id" @click="playerSelected(player)">
            <th>
              <i @click.stop="toggleQueuedPlayer(player)"
                class="nfx-draft__star-icon material-icons"
                :class="{
                  'is-active': isPlayerQueued(player),
                }"
              >
                {{starIcon(player)}}
              </i>
            </th>
            <th>{{player.Position}}</th>
            <td>{{player.Rank}}</td>
            <td>{{player.Name}}</td>
            <td>{{player.AverageDraftPosition}}</td>
            <td>{{player.FantasyPoints}}</td>
            <td>{{player.Age}}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <div class="nfx-draft__sidebar-left">
      <div class="nfx-draft__timer">Draft Start / Timer</div>
      <div class="nfx-draft__pick">You have the {{draftPickNumber}}th Pick</div>
      <nfx-draft-order :teams="teamsDraftingByRound"></nfx-draft-order>
    </div>
    <div class="nfx-draft__sidebar-right">
      <div class="nfx-draft__picks">
        <h3>My Picks</h3>
        <aside v-if="userTeam" class="menu">
          <ul class="menu-list">
            <li v-for="(userPick, index) in userTeam.Players" :key="`user_pick_${index}`">
              <span>{{index + 1}}. </span><span>{{userPick.Name}}</span>
            </li>
          </ul>
        </aside>
      </div>
      <div class="nfx-draft__queued">
        <h3>My Queue</h3>
        <aside v-if="myQueue" class="menu">
          <ul class="menu-list">
            <li v-for="(queuedPlayer, index) in myQueue" :key="`queue_${queuedPlayer.id}`">
              <span>{{index + 1}}. </span><span>{{queuedPlayer.Name}}</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
    <div class="nfx-draft__footer">The Last Pick Was: {{lastPick}}</div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import gql from 'graphql-tag'
import stickybits from 'stickybits'

import NfxDraftOrder from './NfxDraftOrder.vue'
import { NfxButton, NfxSectionHeader } from '../'

export default Vue.extend({
  components: {
    NfxButton,
    NfxSectionHeader,
    NfxDraftOrder
  },
  data() {
    return {
      draft: {},
      myQueue: [],
      selectedPick: null,
      leagueId: this.$route.params.id,
      isUserDrafting: false
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user
    }),
    draftPickNumber() {
      return 1
    },
    teamsDraftingByRound() {
      const teamsByRound = []
      // if (this.draft) {
      //   for (let i = 0; i < this.draft.Rounds - 1; i++) {
      //     const team = this.draft.Teams[i]

      //     teamsByRound.push({
      //       id: team.id,
      //       pick: team.Picks[i],
      //       name: team.Name
      //     })
      //   }
      // }
      return teamsByRound
    },
    userTeam() {
      return this.draft.hasOwnProperty('Teams') && this.draft.Teams.length !== 0
        ? this.draft.Teams.find(team => team.OwnerID === this.user.id)
        : null
    }
  },
  apollo: {
    draft: {
      query: gql`
        query GetDraft($draftId: String!) {
          draft(draftId: $draftId) {
            id
            LeagueID
            CurrentRound
            CurrentUserDrafting
            DraftDateTime
            IsDraftComplete
            Rounds
            Teams {
              id
              OwnerID
              Name
              Picks
              Players {
                id
                Name
                TeamID
                LineUpPosition
              }
            }
            Players {
              id
              Rank
              Name
              Position
              Age
              FantasyPoints
              AverageDraftPosition
            }
          }
        }
      `,
      subscribeToMore: {
        document: gql`
          subscription newUserDraftPick($selectedPick: PlayerPickInput!) {
            newUserDraftPick(selectedPick: $selectedPick) {
              id
              Name
              LineUpPosition
              TeamID
            }
          }
        `,
        // Variables passed to the subscription. Since we're using a function,
        // they are reactive
        variables() {
          return {
            selectedPick: this.selectedPick
          }
        },
        // Mutate the previous result
        updateQuery(previousResult, { subscriptionData }) {
          try {
            if (!subscriptionData.data) {
              throw new Error('Subscription not working ??')
            }

            const newDraftPick = subscriptionData.data.newUserDraftPick
            if (this.isDuplicateDraftPick(newDraftPick)) {
              return previousResult
            }

            const draft = cloneDeep(this.draft)
            const userTeamIndex = draft.Teams.findIndex(
              team => team.id === newDraftPick.TeamID
            )

            draft.Teams[userTeamIndex].Players.push({
              id: newDraftPick.id,
              TeamID: draft.Teams[userTeamIndex].id,
              Name: newDraftPick.Name,
              LineUpPosition: newDraftPick.LineUpPosition,
              __typename: newDraftPick.__typename
            })

            const index = draft.Players.findIndex(
              player => player.id === newDraftPick.id
            )

            draft.Players.splice(index, 1)

            return {
              draft
            }
          } catch (e) {
            console.log(e)
          }
        }
      },
      variables() {
        return { draftId: `draft_${this.leagueId}` }
      }
    }
  },
  methods: {
    /**
     * Esnure duplicate draft picks don't get added to teams
     * during optimistic updates
     */
    isDuplicateDraftPick(newPick) {
      return this.draft.Teams.some(team => {
        if (team.Players.some(pick => pick.id === newPick.id)) {
          return true
        }
        return false
      })
    },
    setDefaultLineUpPosition() {
      console.log('Set Deafult Lineup')
    },
    draftPlayer() {
      this.removeQueuePlayer(this.selectedPick)
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($selectedPick: PlayerPickInput!) {
              addDraftPickToUserTeam(selectedPick: $selectedPick) {
                id
                Name
                LineUpPosition
                TeamID
              }
            }
          `,
          variables: {
            selectedPick: this.selectedPick
          }
        })
        .then(({ data: { addDraftPickToUserTeam } }) => {
          console.log('User Drafted Pick', addDraftPickToUserTeam)
        })
    },
    playerSelected({ id, Name, Position }) {
      this.selectedPick = {
        id,
        Name,
        LineUpPosition: `${Position}1`,
        TeamID: this.userTeam ? this.userTeam.id : null,
        DraftID: this.draft.id
      }
    },
    toggleQueuedPlayer(player) {
      if (this.isPlayerQueued(player)) {
        this.removeQueuePlayer(player)
      } else {
        this.addQueuePlayer(player)
      }
    },
    removeQueuePlayer(player) {
      const index = this.myQueue.findIndex(i => i.id === player.id)
      this.myQueue.splice(index, 1)
    },
    addQueuePlayer(player) {
      this.myQueue.push(player)
    },
    isPlayerQueued(player) {
      return this.myQueue.find(i => i.id === player.id)
    },
    lastPick() {
      return 'Antonio Brown'
    },
    starIcon(player) {
      return this.isPlayerQueued(player) ? 'star' : 'star_border'
    },
    exitDraft() {
      if (confirm('Exiting Draft are you sure?')) {
        this.$store.commit('UPDATE_DRAFT_CONFIG', {
          isUserDrafting: false,
          isUserDraftLoading: false
        })
        this.$router.push('/draft')
      }
    }
  },
  mounted() {
    console.log('add sticky to selected draft player')
    // stickybits('.nfx-draft__sticky', {
    //   useStickyClasses: true,
    //   stickyBitStickyOffset: 73
    // })
  },
  beforeDestroy() {
    console.log('clean up draft session')
  }
})
</script>

<style lang="scss" scoped>
@import '../../vars';

.nfx-draft {
  display: grid;
  grid-gap: 20px;
  grid-template-areas:
    'header'
    'content'
    'sidebar-left'
    'sidebar-right'
    'footer';

  &__header {
    grid-area: header;
    grid-column-start: 2;
    grid-column-end: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding-left: 205px;
    // padding-right: 98px;
    font-weight: bold;
  }

  &__content {
    grid-area: content;
    min-height: 250px;

    table {
      tr {
        &:hover {
          background-color: #fab23a24;
        }
      }
    }
  }

  &__sidebar {
    &-left {
      grid-area: sidebar-left;
      display: flex;
      flex-direction: column;
    }
    &-right {
      grid-area: sidebar-right;
      display: flex;
      flex-direction: column;
    }
  }

  &__footer {
    grid-area: footer;
  }

  &__pick {
    font-size: 1rem;
  }

  &__picks {
    max-height: 180px;
    overflow: scroll;
    margin-bottom: 20px;
  }

  &__order {
    margin-top: 20px;
  }

  &__queued {
    &-pick {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border: 1px solid lightgray;
      border-radius: 5px;

      span {
        display: flex;
        align-items: center;
      }

      button {
        margin-right: 5px;
      }
    }

    &-icon {
      font-size: 50px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  &__star-icon {
    &.is-active {
      color: $orange;
    }

    &:hover {
      cursor: pointer;
    }
  }

  &__sticky {
    &.js-is-sticky {
      background-color: $orange;
      width: 100%;
      height: 100px;
      // top: 3.25rem;
    }
  }

  &__exit {
    grid-column-start: 3;
    align-self: center;
  }
}
@media (min-width: 700px) {
  .nfx-draft {
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-areas:
      'header header  header'
      'sidebar-left content sidebar-right'
      'footer footer  footer';
  }
}
</style>
