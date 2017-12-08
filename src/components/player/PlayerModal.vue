<template>
  <modal :show="show" :on-close="close">
    <div class="ffx-player-modal modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Player Details</p>
        <button class="delete" @click="close"></button>
      </header>
      <section v-if="player" class="modal-card-body">
        <player :player="player"></player>
      </section>
      <footer class="modal-card-foot">
        <a v-if="!isPlayerOnMyTeam" class="button is-success" :class="{ 'is-loading': isLoading }" @click="addPlayer">Add Player</a>
        <a v-else class="button is-danger" :class="{ 'is-loading': isLoading }" @click="removePlayer">Remove Player</a>
        <a class="button" @click="close">Cancel</a>
      </footer>
    </div>
  </modal>
</template>

<script>
import Player from './Player.vue'

export default {
  props: {
    show: Boolean,
    sumbit: Function,
    player: Object
  },
  components: {
    Player
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    isPlayerOnMyTeam() {
      if (this.$store.state.myTeam.length !== 0 && this.player) {
        return typeof this.$store.state.myTeam.find(item => item.playerId === this.player.playerId) !== 'undefined'
      }
      return false
    }
  },
  methods: {
    close() {
      setTimeout(() => {
        this.isLoading = false
        this.$emit('closing')
      }, 500)
    },
    removePlayer() {
      this.isLoading = true
      this.$store.dispatch('REMOVE_PLAYER', this.player)
      this.close()
    },
    addPlayer() {
      this.isLoading = true
      this.$store.dispatch('ADD_PLAYER', this.player)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
 .bt-email-modal {
   text-align: left;
 }
</style>
