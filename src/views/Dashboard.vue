<template>
  <div class="notification">
    <strong>Date: {{today}}</strong>
    <strong>Game Week: {{gameInfo.Week}}</strong>
    <div v-for="game in gameInfo.Games" :key="game.gameId">
      <div>Location: {{game.stadium}} | Weather Forecast: {{game.forecast}} <span><img :src="game.smallImg" /></span></div>
      <div>{{game.awayTeam}} VS {{game.awayTeam}} <span>Winner: {{game.winner}}</span></div>
    </div>
    <ffx-slide v-once :slides="slides"></ffx-slide>
  </div>
</template>

<script>
import moment from 'moment'

import FfxSlide from '@/components/Slide'

export default {
  name: 'dashboard',
  components: {
    FfxSlide
  },
  data() {
    return {
      slides: [],
      today: moment().format('MM / DD / YYYY')
    }
  },
  computed: {
    gameInfo() {
      return this.$store.state.gameInfo
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_WEATHER')
  }
}
</script>

<style lang="scss" scoped>
.ffx-dashboard {
  margin-top: 50px;
}
</style>
