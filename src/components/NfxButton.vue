<template>
  <button
    type="button"
    class="nfx-button button"
    :class="{
      className,
      'is-primary': !alt,
      'is-alt': alt
    }"
    @click="onClick"
  >
    {{text}}
    <slot class="nfx-button__slot"></slot>
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
  },
  methods: {
    onClick() {
      if (this.click) {
        this.click()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../vars';

 .nfx-button {
   .material-icons {
     padding-left: 5px;
   }

   &.is-alt {
     background-color: $orange;
    border-color: $orange;
   }
 }
</style>
