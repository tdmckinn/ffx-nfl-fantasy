<template>
  <div class="nfx-draft">
    <div class="nfx-draft__header">
      <div v-show="selectedPick" class="nfx-draft__queued-pick">
        <span>
          <i class="nfx-draft__queued-icon material-icons">person</i>{{selectedPick && selectedPick.Name}}</span>
        <nfx-button text="Draft Player" :click="draftPlayer"></nfx-button>
      </div>
      <div><nfx-button text="Exit Draft" :click="exitDraft"></nfx-button></div>
    </div>
    <section class="nfx-draft__content">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th><abbr title="Position">Pos</abbr></th>
            <th><abbr title="Rank">Rnk</abbr></th>
            <th><abbr title="Name">Name</abbr></th>
            <th><abbr title="ADP">ADP</abbr></th>
            <th><abbr title="FX Pts">FTP</abbr></th>
            <th><abbr title="Age">Age</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in draft.Players" :key="player.id" @click="playerSelected(player)">
            <th><i class="material-icons">star_border</i></th>
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
      <nfx-draft-order></nfx-draft-order>
    </div>
    <div class="nfx-draft__sidebar-right">
      <div class="nfx-draft__picks">My Picks</div>
      <div class="nfx-draft__picks">My Queue</div>
    </div>
    <div class="nfx-draft__footer">. . .</div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import gql from 'graphql-tag'

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
      draft: [],
      selectedPick: {},
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
    draftPick() {
      const selectedPick = this.selectedPick
      return selectedPick
        ? {
            id: selectedPick.id,
            Name: selectedPick.Name,
            LineUpPosition: `${selectedPick.Position}1`,
            TeamId: 1,
            DraftID: this.draft.id
          }
        : null
    },
    userTeam() {
      debugger
      return this.draft
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
            selectedPick: this.draftPick
          }
        },
        // Mutate the previous result
        updateQuery(_, { subscriptionData }) {
          try {
            if (!subscriptionData.data) {
              return null
            }

            const newDraftPick = subscriptionData.data.newUserDraftPick
            const draft = {
              ...this.draft,
              ...{
                Players: [...this.draft.Players],
                Teams: [...this.draft.Teams]
              }
            }

            const index = draft.Players.findIndex(
              player => player.id === newDraftPick.id
            )
            draft.Players.splice(index, 1)
            // draft.Teams[0].Players = []
            // draft.Teams[0].Players.push(newDraftPick);

            console.log('I"VE GOT AN ACTUALL SUBSCRIPTION')
            return draft
            // if (this.isDuplicateDraftPick(newDraftPick)) {
            // }

            // console.log(previousResult, subscriptionData)
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
    isDuplicateDraftPick(newPick, existingDraftPicks) {
      return (
        newPick.id !== null &&
        existingDraftPicks.some(pick => newPick.id === pick.id)
      )
    },
    setDefaultLineUpPosition() {
      console.log('Set Deafult Lineup')
    },
    draftPlayer() {
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
            selectedPick: this.draftPick
          }
        })
        .then(({ data: { addDraftPickToUserTeam } }) => {
          console.log('User Drafted Pick', addDraftPickToUserTeam)
        })
    },
    playerSelected(selectedPick) {
      this.selectedPick = selectedPick
    },
    exitDraft() {
      confirm('Exiting Draft are you sure?')
    }
  }
})
</script>

<style lang="scss" scoped>
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
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    padding-left: 205px;
    padding-right: 98px;
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

  &__order {
    margin-top: 20px;
  }

  &__queued {
    &-pick {
      span {
        display: flex;
        align-items: center;
      }

      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 623px;
      border: 1px solid lightgray;
      border-radius: 5px;

      button {
        margin-right: 5px;
      }
    }

    &-icon {
      font-size: 50px;
    }
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
