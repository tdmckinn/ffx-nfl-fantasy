<template>
  <div class="nfx-empty-state">
    <img :src="emptyStateImg" />
  </div>
</template>

<script>
  export default {
    props: {
      size: Number,
      height: Number,
      width: Number,
      maxHeight: Number
    },
    data() {
      return {
        emptyStateImg: require('../assets/empty-backpack.png')
      }
    }
  }
</script>

<style lang="scss" scoped>
.nfx-empty-state {
   
}
</style>
