<template>
  <div class="league-settings">
    <h5 class="league-settings__title title is-5">League Configuration / Draft Settings</h5>
    <form v-if="defaultSettingsConfig.length !== 0">
      <div v-for="config in defaultSettingsConfig" :key="config.id">
        <nfx-fieldset
          v-if="config.type === 'radio'"
          :text="config.text"
        >
          <nfx-radio-control :id="config.id" :radios="config.values" v-model="leagueSettings[config.id]"></nfx-radio-control>
        </nfx-fieldset>
        <nfx-fieldset
          v-if="config.type === 'dropdown'"
          :text="config.text"
        >
          <nfx-dropdown :id="config.id" placeholder="Select Item" :items="config.values" v-model="leagueSettings[config.id]"></nfx-dropdown>
        </nfx-fieldset>
        <nfx-fieldset
          v-if="config.type === 'input'"
          :text="config.text"
        >
          <nfx-input type="text" :disabled="config.readOnly" :placeholder="config.value" v-model="leagueSettings[config.id]"></nfx-input>
        </nfx-fieldset>
        <nfx-fieldset
          v-if="config.type === 'other'"
          :text="config.text"
        >
          <nfx-input type="text" :disabled="config.readOnly" :placeholder="config.singleValues.join(',')" v-model="leagueSettings[config.id]"></nfx-input>
        </nfx-fieldset>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { NfxInput, NfxFieldset, NfxDropdown, NfxRadioControl } from '../'

export default Vue.extend({
  props: ['isLeagueOwner', 'leagueSettings', 'defaultSettingsConfig'],
  components: {
    NfxInput,
    NfxFieldset,
    NfxDropdown,
    NfxRadioControl
  }
})
</script>

<style lang="scss" scoped>
.league-settings {
  form {
    height: 225px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
}
</style>
