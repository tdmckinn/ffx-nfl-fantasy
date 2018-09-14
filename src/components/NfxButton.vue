<template>
  <button 
    type="button" 
    class="nfx-button button"
    :class="{
      className,
      'is-primary': !alt,
      'is-alt': alt
    }"
    @click="click"
  >
    {{text}}
  </button>
</template>

<script>
export default {
  name: 'nfx-button',
  props: {
    className: String,
    text: String,
    click: Function,
    alt: Boolean
  }
}
</script>

<style lang="scss" scoped>
@import '../vars';

 .nfx-button {
   &.is-alt {
     background-color: $orange;
    border-color: $orange;
   }
 }
</style>
