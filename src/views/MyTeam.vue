<template>
  <section class="nfx-my-team">
    <div v-if="condition">
      <nfx-section-header title="My Team"></nfx-section-header>
        <div v-for="player in myTeam" :key="player.playerId">
          <player :player="player"></player>
      </div>
    </div>
    <div v-else>
      <empty-state></empty-state>
      <div class="nfx-my-team__empty">
        Looks like you have don't teams, join a league to get started.
        <nfx-button text="Join League" :click="joinLeagueClick"></nfx-button>
      </div>
    </div>  
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import { EmptyState, NfxButton, NfxPlayer, NfxSectionHeader } from '../components'

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
      condition: false
    }
  },
  computed: {
    ...mapState({
      myTeam: ({ myTeam }) => myTeam
    })
  },
  methods: {
    joinLeagueClick() {
      this.$router.push('/leagues')
    }
  }
})
</script>

<style lang="scss" scoped>
.nfx-my-team {
  position: relative;
  margin-top: 50px;

  &__empty {
    position: absolute;
    top: 10%;
    left: 20%;
  }
}
</style>
