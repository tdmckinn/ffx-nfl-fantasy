<template>
  <div class="league-settings">
    <h4 class="title is-4">League Configuration / Settings</h4>
    <form>
      <nfx-fieldset
        text="Draft Type"
      >
         placeholder
      </nfx-fieldset>
      <nfx-fieldset
        text="Scoring"
      >
      </nfx-fieldset>
      <nfx-fieldset
        text="Max Teams"
      >
        placeholder
      </nfx-fieldset>
      <div>
        WaiverType
      </div>
      <div>
        Roster Positions
      </div>
      <div>
        Trade DeadLine
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { NfxInput }  from '../'

export default Vue.extend({
  props: ['LeagueID', 'DraftTypes', 'Scoring'],
  components: {
    NfxInput
  }
})
</script>

<style lang="scss" scoped>
.league-settings {
  // display: flex;
}
</style>
