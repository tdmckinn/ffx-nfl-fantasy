<template>
  <div v-if="player" class="nfx-player box" @click="playerClicked">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{player.Name}}</strong> <small> Jersey # - {{player.Rank}}</small> <small>31m</small>
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
              <span class="icon is-small" @mouseover="isHovered = true" @mouseout="isHovered = false">
                <i
                  :class="[isHovered || isPlayerOnMyTeam ? 'fa-thumbs-up' : 'fa-thumbs-o-up']"
                  class="fa"
                  ></i>
              </span>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'nfx-player',
  props: {
    player: Object,
    onPlayerClicked: Function
  },
  data() {
    return {
      isHovered: false
    }
  },
  methods: {
    playerClicked() {
      if (this.onPlayerClicked) {
        this.onPlayerClicked(this.player)
      }
    }
  },
  computed: {
    isPlayerOnMyTeam() {
      if (this.$store.state.myTeam.length !== 0 && this.player) {
        return typeof this.$store.state.myTeam.find(item => item.playerId === this.player.playerId) !== 'undefined'
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.nfx-player {
  margin: 15px 0px;

  @media (max-width: 768px) {
    border-radius: 0;
  }
}
</style>
