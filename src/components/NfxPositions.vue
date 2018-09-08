<template>
  <div class="nfx-positions">
    <nfx-dropdown text="Roster Positions" :items="rosterPositions"></nfx-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

import NfxDropdown from './NfxDropdown.vue'

export default Vue.extend({
  components: {
    NfxDropdown
  },
  data () {
    return {
      rosterPositions: []
    }
  },
  apollo: {
    rosterPositions: gql`
      {
        rosterPositions {
          id
          Name
        }
      }
    `
  }
})
</script>

