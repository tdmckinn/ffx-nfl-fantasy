<template>
  <modal :show="show" :on-close="close">
    <div class="ffx-player-modal modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Player Details</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <player :player="player"></player>
      </section>
      <footer class="modal-card-foot">
        <a class="button is-success" :class="{ 'is-loading': isLoading }" @click="addPlayer">Add Player</a>
        <a class="button" @click="close">Cancel</a>
      </footer>
    </div>
  </modal>
</template>

<script>
import Player from '@/components/player/Player'

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
  methods: {
    close() {
      this.$emit('closing')
    },
    addPlayer() {
      this.isLoading = true
      this.$store.dispatch('ADD_PLAYER', this.player)

      setTimeout(() => {
        this.isLoading = false
        this.close()
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
 .bt-email-modal {
   text-align: left;
 }
</style>
