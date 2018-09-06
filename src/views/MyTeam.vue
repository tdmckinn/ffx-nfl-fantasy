<template>
  <section class="nfx-my-team">
    <div v-if="condition">
      <h1 class="title"> My Team </h1>
        <div v-for="player in myTeam" :key="player.playerId">
          <player :player="player"></player>
      </div>
    </div>
    <div v-else>
      <div>Add Team</div>
    </div>  
  </section>
</template>

<script>
import { mapState } from 'vuex'

import { EmptyState, NfxPlayer } from '../components'

export default {
  name: 'my-team',
  components: {
    EmptyState,
    NfxPlayer
  },
  data() {
    return {
      condition: false
    }
  },
  components: {
    EmptyState,
    Player
  },
  computed: {
    ...mapState({
      myTeam: ({ myTeam }) => myTeam
    })
  }
}
</script>

<style lang="scss" scoped>
.nfx-my-team {
  margin-top: 50px;
}
</style>
