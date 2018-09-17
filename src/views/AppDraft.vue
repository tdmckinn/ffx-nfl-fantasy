<template>
  <div class="nfx-app-draft">
    <nfx-section-header class-name="nfx-app-draft__header" title="Draft"></nfx-section-header>
    <div v-if="!isUserDrafting" class="nfx-app-draft__container">
      <div class="nfx-app-draft__wizard">
        <h3>Draft Wizard</h3>
        <aside class="menu">
          <p class="menu-label">
            General
          </p>
          <ul class="menu-list">
            <li><a>Upcoming Drafts</a></li>
            <li><a>Mock Draft Simulator</a></li>
          </ul>
        </aside>
      </div>
      <section class="nfx-app-draft__content">
        <nfx-league type="appDraft" :leagues="leagues">
          <div slot="actions" slot-scope="{ league }" class="nfx-league__actions">
            <nfx-button text="Enter Draft" :click="() => { enterDraft(league.id) }" alt></nfx-button>
          </div>
        </nfx-league>
      </section>
    </div>
    <router-view v-if="isUserDrafting"></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import gql from 'graphql-tag'

import { NfxButton, NfxSectionHeader, NfxLeague } from '../components'
import { setTimeout } from 'timers'

export default Vue.extend({
  components: {
    NfxButton,
    NfxLeague,
    NfxSectionHeader
  },
  data() {
    return {
      leagues: []
    }
  },
  computed: {
    ...mapState({
      isUserDrafting: ({ draftConfig }) => draftConfig.isUserDrafting,
      isUserDraftLoading: ({ draftConfig }) => draftConfig.isUserDraftLoading
    } as any)
  },
  apollo: {
    leagues: gql`
      {
        leagues {
          id
          CommissionerName
          DraftDateTime
          LeagueName
          LeagueSettings {
            MaxTeams
          }
          LeagueTeams {
            id
          }
        }
      }
    `
  },
  methods: {
    enterDraft(leagueId: number) {
      this.$store.commit('UPDATE_DRAFT_CONFIG', {
        isUserDrafting: false,
        isUserDraftLoading: true
      })

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($leagueId: String!) {
              enteredDraft(leagueId: $leagueId) {
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
                  }
                }
              }
            }
          `,
          // Parameters
          variables: {
            leagueId
          }
        })
        .then(({ data: { enteredDraft } }: any) => {
          if (enteredDraft) {
            setTimeout(() => {
              this.$store.commit('UPDATE_DRAFT_CONFIG', {
                isUserDrafting: true,
                isUserDraftLoading: false
              })

              this.$router.push({
                name: 'live',
                params: { id: leagueId.toString() }
              })
            }, 2000)

            return true
          }
          console.log('Sorry could not enter draft please try again!')
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.nfx-app-draft {
  &__container {
    display: flex;
    min-height: 250px;
  }

  &__wizard {
    margin-right: 50px;
  }
}
</style>
