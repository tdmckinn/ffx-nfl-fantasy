<template>
  <div class="ffx-players">
    <h1 class="ffx-players__header title"> Players </h1>
    <div v-for="player in players" :key="player.playerId">
      <player :onPlayerClicked="onPlayerClicked"
        :player="player"></player>
    </div>
    <player-modal :player="selectedPlayer" :show="showModal" v-on:closing="showModal = false"></player-modal>
  </div>
</template>

<script>
import Player from '../components/player/Player.vue'

export default {
  name: 'players',
  components: {
    Player
  },
  data() {
    return {
      showModal: false,
      selectedPlayer: null
    }
  },
  computed: {
    players() {
      return this.$store.state.players
    }
  },
  methods: {
    onPlayerClicked(player) {
      this.selectedPlayer = player
      this.showModal = true
    }
  },
  created() {
    this.$store.dispatch('GET_PLAYERS')
  }
}
</script>

<style lang="scss" scoped>
.ffx-players {
  padding-top: 5px;

  &__header {
    font-weight: bold;
  }
}
</style>
