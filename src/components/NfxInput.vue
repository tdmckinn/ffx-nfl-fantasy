<template>
  <div>
    <input
      class="input"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="updateValue($event.target.value)"
      ref="input"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'nfx-input',
  props: {
    attributes: [],
    className: String,
    isInvalid: Boolean,
    isFocusOnMount: Boolean,
    name: String,
    placeholder: {
      type: String,
      default: 'Text Here'
    },
    type: {
      type: String,
      default: 'text'
    },
    value: String
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    }
  },
  mounted() {
    if (this.isFocusOnMount) {
      (this.$refs.input as HTMLInputElement).focus()
    }
  }
})
</script>

<style lang="scss">
</style>
