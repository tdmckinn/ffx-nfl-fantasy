<template>
  <div class="nfx-dashboard notification">
    <h1 class="nfx-dashboard__header title">
      <span>Weekly Games </span>
      <span>Date: {{today}}</span>
      <span>Game Week: {{gameWeek}}</span>
    </h1>
    <section class="nfx-dashboard__games" v-for="game in gameInfo.Games" :key="game.gameId">
      <div>Location: {{game.stadium}} | Weather Forecast: {{game.forecast}} 
        <span>
          <img v-if="isOnline" :src="game.smallImg" />
        </span>
      </div>
      <div>{{game.homeTeam}} VS {{game.awayTeam}} <span>Winner: {{game.winner}}</span></div>
      <hr>
    </section>
    <nfx-slide v-once :slides="slides"></nfx-slide>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { format } from 'date-fns'

import { NfxSlide } from '../components'
import { DEFAULT_DATE_FORMAT } from '../const'

export default Vue.extend({
  name: 'dashboard',
  components: {
    NfxSlide
  },
  data() {
    return {
      isOnline: navigator ? navigator.onLine : false,
      slides: [],
      gameWeek: 1,
      today: format(new Date(), DEFAULT_DATE_FORMAT)
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
  .nfx-dashboard {
    &__header {
      font-weight: bold;
      padding-bottom: 15px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
