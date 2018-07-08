<template>
  <button type="button" class="button is-primary" @click="click">{{text}}</button>
</template>

<script>
export default {
  name: 'ffx-button',
  props: {
    className: String,
    text: String,
    click: Function
  }
}
</script>
