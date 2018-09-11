<template>
  <div class="nfx-draft">
    <div class="nfx-draft__header">
      <div class="nfx-draft__queued-pick">
        <!-- button - add to queue or draft dependent state -->
      </div>      
    </div>
    <section class="nfx-draft__content">
      <table class="table">
        <thead>
          <tr>
            <th><abbr title="Position">Pos</abbr></th>
            <th><abbr title="Rank">Rnk</abbr></th>
            <th><abbr title="Name">Name</abbr></th>
            <th><abbr title="ADP">ADP</abbr></th>
            <th><abbr title="FX Pts">FTP</abbr></th>
            <th><abbr title="Age">Age</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in draft" :key="player.id">
            <th>{{player.Position}}</th>
            <td>{{player.Rank}}</td>
            <td>{{player.Name}}</td>
            <td>{{player.AverageDraftPosition}}</td>
            <td>{{player.FantasyPoints}}</td>
            <td>{{player.Age}}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <div class="nfx-draft__sidebar-left">
      <div class="nfx-draft__timer">Draft Start / Timer</div>
      <div class="nfx-draft__pick">You have the 5th Pick</div>
      <nfx-draft-order></nfx-draft-order>
    </div>
    <div class="nfx-draft__sidebar-right">
      <div class="nfx-draft__picks">My Picks</div>
      <div class="nfx-draft__picks">My Queue</div>
    </div>
    <div class="nfx-draft__footer">. . .</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

import NfxDraftOrder from './NfxDraftOrder.vue'
import { NfxButton, NfxSectionHeader, NfxLeague } from '../'

export default Vue.extend({
  components: {
    NfxButton,
    NfxSectionHeader,
    NfxDraftOrder
  },
  data() {
    return {
      draft: [],
      isUserDrafting: false
    }
  },
  apollo: {
    draft: gql`
      {
        draft {
          id
          Rank
          Name
          Position
          Age
          FantasyPoints
          AverageDraftPosition
        }
      }
    `
  },
})
</script>

<style lang="scss" scoped>
.nfx-draft {
  display: grid;
  grid-gap: 20px;
  grid-template-areas:
    'header'
    'content'
    'sidebar-left'
    'sidebar-right'
    'footer';

  &__header {
    grid-area: header;
    font-weight: bold;
  }

  &__content {
    grid-area: content;
    min-height: 250px;
  }

  &__sidebar {
    &-left {
      grid-area: sidebar-left;
      display: flex;
      flex-direction: column;
    }
    &-right {
      grid-area: sidebar-right;
      display: flex;
      flex-direction: column;
    }
  }

  &__footer {
    grid-area: footer;
  }

  &__queued-pick {

  }
}
@media (min-width: 700px) {
  .nfx-draft {
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-areas:
      'header header  header'
      'sidebar-left content sidebar-right'
      'footer footer  footer';
  }
}
</style>
