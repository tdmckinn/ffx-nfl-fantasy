<template>
  <div class="nfx-players">
    <h1 class="nfx-players__header title"> Players </h1>
    <div v-for="player in players" :key="player.id">
      <nfx-player :onPlayerClicked="onPlayerClicked"
        :player="player"></nfx-player>
    </div>
    <player-modal :player="selectedPlayer" :show="showModal" v-on:closing="showModal = false"></player-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import { NfxPlayer } from '../components'

export default {
  name: 'players',
  components: {
    NfxPlayer
  },
  data() {
    return {
      players: [],
      showModal: false,
      selectedPlayer: null
    }
  },
  apollo: {
    players: gql`
      {
        players {
          id
          Name
          Rank
        }
      }
    `
  },
  methods: {
    onPlayerClicked(player) {
      this.selectedPlayer = player
      this.showModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
.nfx-players {
  padding-top: 5px;

  &__header {
    font-weight: bold;
  }
}
</style>
