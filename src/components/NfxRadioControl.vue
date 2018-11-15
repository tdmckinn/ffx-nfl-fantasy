<template>
  <div class="nfx-radio__control control">
    <label v-for="(radio, index) in radios" class="radio" :key="radio.id || index">
      <input 
        type="radio" 
        :name="id" 
        :value="radio.value"
        @input="updateValue($event.target.value)"
      >
        {{radio.value || radio}}
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    id: String,
    radios: Array
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>


