<template> 
  <div>
    <h1 class="title"> My Team </h1>
      <div v-for="player in myTeam" :key="player.playerId">
        <player :player="player"></player>
    </div>
  </div>
</template>

<script>
import Player from '@/components/player/Player'

export default {
  name: 'my-team',
  components: {
    Player
  },
  computed: {
    myTeam() {
      return this.$store.state.myTeam
    }
  }
}
</script>

<style lang="scss" scoped>
.ffx-dashboard {
  margin-top: 50px;
}
</style>
