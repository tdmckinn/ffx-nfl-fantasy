<template>
  <h1
    :class="className"
    class="nfx-section-header title"
  >
    {{title}}
  </h1>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'nfx-section-header',
  props: {
    className: String,
    title: String
  }
})
</script>

<style lang="scss" scoped>
.nfx-section {
  &__header {
    font-weight: bold;
    padding-bottom: 15px;
  }
}
</style>
