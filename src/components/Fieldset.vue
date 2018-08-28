<template>
  <fieldset class="nfx-fieldset field">
    <label class="label">{{text}}</label>
    <div class="control">
      <slot></slot>
    </div>
    <p class="help">{{helpText}}</p>
  </fieldset>
</template>

<script>
export default {
  name: 'nfx-fieldset',
  props: {
    text: String,
    helpText: String
  }
}
</script>

<style lang="scss" scoped>
.nfx-fieldset {
  text-align: left;
  border: none;
}
</style>
