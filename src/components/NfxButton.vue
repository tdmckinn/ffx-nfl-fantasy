<template>
  <button 
    type="button" 
    class="button is-primary"
    :class="className"
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
