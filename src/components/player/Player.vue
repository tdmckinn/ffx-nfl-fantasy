<template>
  <div v-if="player"class="ffx-player box" @click="playerClicked">
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{player.displayName}}</strong> <small>Jersey # - {{player.jersey}}</small> <small>31m</small>
          <br>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small"><i class="fa fa-heart"></i></span>
          </a>
        </div>
      </nav>
    </div>
  </article>
</div>
</template>

<script>
export default {
  name: 'player',
  props: {
    player: Object,
    onPlayerClicked: Function
  },
  methods: {
    playerClicked() {
      if (this.onPlayerClicked) {
        this.onPlayerClicked(this.player)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ffx-player {
  margin: 15px 0px;
}
</style>
