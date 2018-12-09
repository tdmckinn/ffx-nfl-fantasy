<template>
  <div class="notification">
    <button class="delete"></button>
    {{message}}
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  }
}
</script>

