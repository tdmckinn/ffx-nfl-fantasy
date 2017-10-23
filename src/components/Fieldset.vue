<template>
  <fieldset class="ffx-fieldset field">
    <label class="label">{{text}}</label>
    <div class="control">
      <slot></slot>
    </div>
    <p class="help">{{helpText}}</p>
  </fieldset>
</template>

<script>
export default {
  name: 'ffx-fieldset',
  props: {
    text: String,
    helpText: String
  }
}
</script>

<style lang="scss" scoped>
.ffx-fieldset {
  text-align: left;
  border: none;
}
</style>
