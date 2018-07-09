<template>
  <div class="notification">
    <h1 class="ffx-dashboard__header">
      Weekly Game - 
      Date: {{today}}
      Game Week: {{gameInfo.Week}}
    </h1>
    <div v-for="game in gameInfo.Games" :key="game.gameId">
      <div>Location: {{game.stadium}} | Weather Forecast: {{game.forecast}} <span><img :src="game.smallImg" /></span></div>
      <div>{{game.homeTeam}} VS {{game.awayTeam}} <span>Winner: {{game.winner}}</span></div>
      <hr>
    </div>
    <ffx-slide v-once :slides="slides"></ffx-slide>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import moment from 'moment'

import FfxSlide from '../components/Slide.vue'

const gameFormat: string = 'MM/DD/YYYY'

export default Vue.extend({
  name: 'dashboard',
  components: {
    FfxSlide
  },
  data() {
    return {
      slides: [],
      today: moment().format(gameFormat)
    }
  },
  computed: {
    ...mapState({
      gameInfo: ({ gameInfo }) => gameInfo
    })
  },
  created() {
    this.$store.dispatch('GET_WEATHER')
  }
})
</script>

<style lang="scss" scoped>
  .ffx-dashboard {
    margin-top: 50px;

    &__header {
      font-weight: bold;
      font-size: 20px;
      padding-bottom: 15px;
    }
  }
</style>
